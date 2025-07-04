import * as fs from "fs";

export default async function handler(req, res) {
  try {
    const data = await fs.promises.readFile("JSONs/home/our_work.json", "utf-8");
    const parsedData = JSON.parse(data); // Convert string to JSON
    res.status(200).json(parsedData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read JSON file" });
  }
}
