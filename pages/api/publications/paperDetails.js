import fs from "fs/promises";
import path from "path";
import mechanics from "@/mechanics/scrapeGScholar.js";

function sleep(ms = 3000) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function handler(req, res) {
  // Allow both GET and POST methods
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const action = req.query?.action || "";
  const body = req.body || {};

  try {
    const linksFile = path.join(process.cwd(), "JSONs", "publications", "scholarLinks.json");
    const savePath = path.join(process.cwd(), "JSONs", "publications", "paperDetails.json");

    if (action === "refetch") {
      const linksData = await fs.readFile(linksFile, "utf-8");
      const allLinks = JSON.parse(linksData);

      let existingData = [];
      try {
        const prevData = await fs.readFile(savePath, "utf-8");
        existingData = prevData.trim() ? JSON.parse(prevData) : [];
      } catch {
        console.log("No previous data found or file is empty. Starting fresh.");
      }

      let startIndex = existingData.length;
      console.log(`🔁 Resuming from index ${startIndex}`);

      for (let i = startIndex; i < allLinks.length; i++) {
        const link = allLinks[i];
        const paperDetails = await mechanics.fetchPaperDetails(link);

        if (paperDetails) {
          existingData.push({
            index: i + 1, // 1-based index
            ...paperDetails,
          });

          await fs.writeFile(savePath, JSON.stringify(existingData, null, 4), "utf-8");
          console.log(`✅ Saved index ${i + 1}`);
        }

        await sleep(3000); // Wait 3 seconds before next fetch
      }

      console.log("🎉 Refetch complete.");
    }
    else if (action === "similar") {
      // Get the query from request body or query parameters
      const query = req.body?.query || req.query?.query || "";
      
      if (!query || typeof query !== 'string' || query.trim().length === 0) {
        return res.status(400).json({ 
          error: "Query parameter is required and must be a non-empty string",
          usage: "POST /api/publications/paperDetails?action=similar with body: {\"query\": \"your search text\"} OR GET /api/publications/paperDetails?action=similar&query=your%20search%20text"
        });
      }

      // Import embedding functions from createEmbeddings.js
      const embeddingsPath = path.join(process.cwd(), "JSONs", "publications", "embeddings.json");
      
      // Helper functions (copied from createEmbeddings.js)
      function preprocessText(text) {
        if (!text) return '';
        return text.toLowerCase()
          .replace(/[^\w\s]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
      }

      function tokenize(text) {
        return preprocessText(text).split(' ').filter(word => word.length > 2);
      }

      function simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          const char = str.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash;
        }
        return Math.abs(hash);
      }

      function generateAdvancedEmbedding(text, vectorSize = 300) {
        const words = tokenize(text);
        const vector = new Array(vectorSize).fill(0);
        
        if (words.length === 0) return vector;
        
        // Unigrams, bigrams, trigrams
        const unigrams = words;
        const bigrams = [];
        for (let i = 0; i < words.length - 1; i++) {
          bigrams.push(words[i] + '_' + words[i + 1]);
        }
        const trigrams = [];
        for (let i = 0; i < words.length - 2; i++) {
          trigrams.push(words[i] + '_' + words[i + 1] + '_' + words[i + 2]);
        }
        
        const allFeatures = [
          ...unigrams.map(w => ({ term: w, weight: 1.0 })),
          ...bigrams.map(w => ({ term: w, weight: 1.5 })),
          ...trigrams.map(w => ({ term: w, weight: 2.0 }))
        ];
        
        const featureFreq = {};
        allFeatures.forEach(({ term, weight }) => {
          featureFreq[term] = (featureFreq[term] || 0) + weight;
        });
        
        Object.entries(featureFreq).forEach(([term, freq]) => {
          const positions = [
            simpleHash(term) % vectorSize,
            simpleHash(term + '_hash2') % vectorSize,
            simpleHash(term + '_hash3') % vectorSize
          ];
          
          const normalizedFreq = freq / allFeatures.length;
          const weight = Math.log(1 + normalizedFreq);
          
          positions.forEach(pos => {
            vector[pos] += weight / positions.length;
          });
        });
        
        // Normalize the vector
        const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
        if (magnitude > 0) {
          for (let i = 0; i < vector.length; i++) {
            vector[i] /= magnitude;
          }
        }
        
        return vector;
      }

      function cosineSimilarity(vecA, vecB) {
        if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
        
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        
        for (let i = 0; i < vecA.length; i++) {
          dotProduct += vecA[i] * vecB[i];
          normA += vecA[i] * vecA[i];
          normB += vecB[i] * vecB[i];
        }
        
        if (normA === 0 || normB === 0) return 0;
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
      }

      try {
        // Read embeddings
        let embeddings = [];
        try {
          const embeddingData = await fs.readFile(embeddingsPath, "utf-8");
          embeddings = embeddingData.trim() ? JSON.parse(embeddingData) : [];
        } catch (error) {
          return res.status(500).json({ error: "Failed to read embeddings. Please generate embeddings first." });
        }

        if (embeddings.length === 0) {
          return res.status(404).json({ error: "No embeddings found. Please generate embeddings first." });
        }

        // Generate embedding for the query
        const queryEmbedding = generateAdvancedEmbedding(query.trim());

        // Calculate similarities with all embeddings
        const similarities = [];
        
        for (let i = 0; i < embeddings.length; i++) {
          const embeddingEntry = embeddings[i];
          
          // Skip if embedding is missing or invalid
          if (!embeddingEntry.embedding || !Array.isArray(embeddingEntry.embedding)) {
            continue;
          }

          const similarity = cosineSimilarity(queryEmbedding, embeddingEntry.embedding);
          
          if (similarity > 0) {
            similarities.push({
              paperIndex: embeddingEntry.paperIndex || embeddingEntry.index,
              title: embeddingEntry.title,
              similarity: similarity,
              embeddingIndex: i
            });
          }
        }

        // Sort by similarity (highest first) and get top 10
        const topSimilarities = similarities
          .sort((a, b) => b.similarity - a.similarity)

        // Get the actual paper details for the top results
        const data = await fs.readFile(savePath, "utf-8");
        const allPapers = data.trim() ? JSON.parse(data) : [];
        
        const topPapers = topSimilarities.map(sim => {
          const paper = allPapers.find(p => (p.index || p.paperIndex) === sim.paperIndex);
          return {
            ...paper,
            similarityScore: Math.round(sim.similarity * 10000) / 100, // Convert to percentage
            relevanceRank: topSimilarities.indexOf(sim) + 1
          };
        }).filter(paper => paper !== undefined)


        return res.status(200).json({
          query: query.trim(),
          totalEmbeddings: embeddings.length,
          totalMatches: similarities.length,
          topMatches: topPapers.length,
          results: topPapers
        });

      } catch (error) {
        console.error("❌ Error in similarity search:", error);
        return res.status(500).json({ 
          error: "Failed to perform similarity search",
          details: error.message 
        });
      }
    }

    // Always respond with final saved data
    const data = await fs.readFile(savePath, "utf-8");
    const parsedData = data.trim() ? JSON.parse(data) : [];

    res.status(200).json(parsedData);
  } catch (err) {
    console.error("❌ Error reading or writing paper details:", err);
    res.status(500).json({ error: "Failed to read or write JSON file" });
  }
}
