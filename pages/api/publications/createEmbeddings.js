import fs from "fs/promises";
import path from "path";

// Simple but effective text preprocessing
function preprocessText(text) {
  if (!text) return '';
  return text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Tokenize text into words
function tokenize(text) {
  return preprocessText(text).split(' ').filter(word => word.length > 2);
}

// Simple hash function for consistent word mapping
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Generate a simple but effective embedding vector
function generateEmbedding(text, vocabularyMap = null, vectorSize = 300) {
  const words = tokenize(text);
  const vector = new Array(vectorSize).fill(0);
  
  if (words.length === 0) return vector;
  
  // Create a frequency map
  const wordFreq = {};
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });
  
  // Generate embedding using hash-based positioning with TF weighting
  Object.entries(wordFreq).forEach(([word, freq]) => {
    const positions = [
      simpleHash(word) % vectorSize,
      simpleHash(word + '_2') % vectorSize,
      simpleHash(word + '_3') % vectorSize
    ];
    
    const tf = freq / words.length; // Term frequency
    const weight = Math.log(1 + tf); // Log weighting
    
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

// Enhanced embedding that considers bigrams and trigrams
function generateAdvancedEmbedding(text, vectorSize = 300) {
  const words = tokenize(text);
  const vector = new Array(vectorSize).fill(0);
  
  if (words.length === 0) return vector;
  
  // Unigrams
  const unigrams = words;
  // Bigrams
  const bigrams = [];
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.push(words[i] + '_' + words[i + 1]);
  }
  // Trigrams
  const trigrams = [];
  for (let i = 0; i < words.length - 2; i++) {
    trigrams.push(words[i] + '_' + words[i + 1] + '_' + words[i + 2]);
  }
  
  // Combine all n-grams with different weights
  const allFeatures = [
    ...unigrams.map(w => ({ term: w, weight: 1.0 })),
    ...bigrams.map(w => ({ term: w, weight: 1.5 })),
    ...trigrams.map(w => ({ term: w, weight: 2.0 }))
  ];
  
  // Create frequency map with weights
  const featureFreq = {};
  allFeatures.forEach(({ term, weight }) => {
    featureFreq[term] = (featureFreq[term] || 0) + weight;
  });
  
  // Generate embedding
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

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const action = req.query?.action || "";
  const forceRebuild = req.query?.rebuild === "true";

  try {
    const paperDetailsPath = path.join(process.cwd(), "JSONs", "publications", "paperDetails.json");
    const embeddingsPath = path.join(process.cwd(), "JSONs", "publications", "embeddings.json");

    // Read paper details
    let paperDetails = [];
    try {
      const paperData = await fs.readFile(paperDetailsPath, "utf-8");
      paperDetails = paperData.trim() ? JSON.parse(paperData) : [];
    } catch (error) {
      console.error("Error reading paper details:", error);
      return res.status(500).json({ error: "Failed to read paper details" });
    }

    // Read existing embeddings
    let existingEmbeddings = [];
    try {
      const embeddingData = await fs.readFile(embeddingsPath, "utf-8");
      existingEmbeddings = embeddingData.trim() ? JSON.parse(embeddingData) : [];
    } catch (error) {
      console.log("No existing embeddings found or file is empty. Starting fresh.");
      existingEmbeddings = [];
    }

    if (action === "generate" || forceRebuild) {
      console.log(`📊 Processing ${paperDetails.length} papers for embeddings...`);
      
      let startIndex = 0;
      let embeddings = [];

      if (!forceRebuild && existingEmbeddings.length > 0) {
        // Incremental update - only process new entries
        startIndex = existingEmbeddings.length;
        embeddings = [...existingEmbeddings];
        console.log(`🔄 Incremental update: Processing ${paperDetails.length - startIndex} new papers`);
      } else {
        console.log("🔧 Full rebuild: Processing all papers");
      }

      if (startIndex >= paperDetails.length) {
        console.log("✅ All papers already have embeddings");
        return res.status(200).json({
          message: "All papers already have embeddings",
          total: paperDetails.length,
          embeddings: embeddings.length
        });
      }

      // Process papers from startIndex onwards
      for (let i = startIndex; i < paperDetails.length; i++) {
        const paper = paperDetails[i];
        
        // Extract text for embedding
        const title = paper.Title || paper.title || '';
        const description = paper.Description || paper.description || '';
        const authors = Array.isArray(paper.Authors) ? paper.Authors.join(' ') :
                       Array.isArray(paper.authors) ? paper.authors.join(' ') :
                       (paper.Authors || paper.authors || '');
        const conference = paper.Conference || paper.conference || '';
        
        // Combine all text with appropriate weighting
        const combinedText = `${title} ${title} ${description} ${authors} ${conference}`;
        
        // Generate embedding
        const embedding = generateAdvancedEmbedding(combinedText);
        
        const embeddingEntry = {
          index: i + 1,
          paperIndex: paper.index || i + 1,
          title: title,
          embedding: embedding,
          textLength: combinedText.length,
          timestamp: new Date().toISOString()
        };
        
        embeddings.push(embeddingEntry);
        
        // Save incrementally every 10 papers
        if ((i - startIndex + 1) % 10 === 0) {
          await fs.writeFile(embeddingsPath, JSON.stringify(embeddings, null, 2), "utf-8");
          console.log(`💾 Saved ${i - startIndex + 1} embeddings...`);
        }
      }

      // Final save
      await fs.writeFile(embeddingsPath, JSON.stringify(embeddings, null, 2), "utf-8");
      
      console.log(`🎉 Embedding generation complete!`);
      console.log(`📈 Total papers: ${paperDetails.length}`);
      console.log(`🔢 Total embeddings: ${embeddings.length}`);
      console.log(`➕ New embeddings: ${embeddings.length - startIndex}`);

      return res.status(200).json({
        message: "Embeddings generated successfully",
        total: paperDetails.length,
        embeddings: embeddings.length,
        newEmbeddings: embeddings.length - startIndex,
        vectorSize: 300
      });
    }

    // Default action - return status
    const status = {
      totalPapers: paperDetails.length,
      totalEmbeddings: existingEmbeddings.length,
      needsUpdate: paperDetails.length > existingEmbeddings.length,
      missingEmbeddings: Math.max(0, paperDetails.length - existingEmbeddings.length)
    };

    res.status(200).json(status);

  } catch (error) {
    console.error("❌ Error in embedding generation:", error);
    res.status(500).json({ 
      error: "Failed to generate embeddings",
      details: error.message 
    });
  }
}