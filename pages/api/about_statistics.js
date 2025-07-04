import * as fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), "JSONs", "home", "about_statistics.json");
    const data = await fs.promises.readFile(filePath, "utf-8");
    const parsedData = JSON.parse(data);
    
    res.status(200).json(parsedData);
  } catch (err) {
    console.error("Error reading about_statistics data:", err);
    res.status(500).json({ error: "Failed to read JSON file" });
  }
}
