import * as fs from "fs";
import path from "path";

export default async function handler(req, res) {
     const limit = req.query?.limit || 15;
    try {
        const filePath = path.join(process.cwd(), "JSONs", "publications", "paperDetails.json");
        const data = await fs.promises.readFile(filePath, "utf-8");
        const parsedData = JSON.parse(data);

        let author_count = {}
        for(let i=0; i< parsedData.length; i++) {   
            if (parsedData[i].Authors) {
                for (let j = 0; j < parsedData[i].Authors.length; j++) {
                    const author = parsedData[i].Authors[j];
                    if (author_count[author]) {
                        author_count[author] += 1;
                    } else {
                        author_count[author] = 1;
                    }
                }
            }
        }
        
        // Convert author_count object to array of objects
        const authorArray = Object.entries(author_count).map(([name, count]) => ({
            name: name,
            publicationCount: count
        }));
        
        // Sort by publication count in descending order
        authorArray.sort((a, b) => b.publicationCount - a.publicationCount);

        // Get top authors
        const topAuthors = authorArray.slice(0, limit);

        res.status(200).json({
            message: `Top ${limit} authors with most publications`,
            totalAuthors: authorArray.length,
            topAuthors: topAuthors.map(author => author.name)
        });
    } catch (err) {
        console.error("Error reading projects data:", err);
        res.status(500).json({ error: "Failed to read JSON file" });
    }
}
