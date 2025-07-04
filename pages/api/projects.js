import * as fs from "fs";
import path from "path";

export default async function handler(req, res) {
    const { tag } = req.query;
    try {
        const filePath = path.join(process.cwd(), "JSONs", "projects", "projects.json");
        const data = await fs.promises.readFile(filePath, "utf-8");
        const parsedData = JSON.parse(data);
        
        if (tag) {
            const filteredData = parsedData.filter(project => project.tags.includes(tag));
            return res.status(200).json(filteredData);
        }
        let tags = [...new Set(parsedData.flatMap(project => project.tags))].map(tag => tag.toLowerCase()).sort();
        res.status(200).json({ projects: parsedData, tags });
    } catch (err) {
        console.error("Error reading projects data:", err);
        res.status(500).json({ error: "Failed to read JSON file" });
    }
}
