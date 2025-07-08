import * as fs from "fs";
import path from "path";
import * as mechanics from "@/mechanics/scrapeGScholar.js";

export default async function handler(req, res) {
     const action = req.query?.action || "";
    try {
        if (action === "refetch") {
            mechanics.fetchAllScholarLinks(path.join(process.cwd(), "JSONs", "publications", "gScholarLinks.json"))
                .then(() => console.log('Scraping completed successfully.'))
                .catch(error => console.error("Error during scraping:", error));
        }

        const filePath = path.join(process.cwd(), "JSONs", "publications", "gScholarLinks.json");
        const data = await fs.promises.readFile(filePath, "utf-8");
        const parsedData = JSON.parse(data);
        
        res.status(200).json(parsedData);
    } catch (err) {
        console.error("Error reading projects data:", err);
        res.status(500).json({ error: "Failed to read JSON file" });
    }
}
