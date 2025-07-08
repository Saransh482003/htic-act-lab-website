import * as fs from "fs";
import path from "path";
import * as mechanics from "@/mechanics/scrapeGScholar.js";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function handler(req, res) {
  const action = req.query?.action || "";

  try {
    if (action === "refetch") {
      const linksFile = path.join(process.cwd(), "JSONs", "publications", "gScholarLinks.json");
      const data = await fs.promises.readFile(linksFile, "utf-8");
      const parsedData = JSON.parse(data).slice(0, 5);
      let paperData = [];

      for (let link of parsedData) {
        const paperDetails = await mechanics.fetchPaperDetails(link);

        if (paperDetails) {
          paperData.push(paperDetails);
        }

        await sleep(3000);
      }

      // Save fetched data to file
      const savePath = path.join(process.cwd(), "JSONs", "publications", "paperDetails.json");
      await fs.promises.writeFile(savePath, JSON.stringify(paperData, null, 4), "utf-8");

      console.log("✅ Paper details saved.");
    }

    // READ FROM FILE TO RESPOND
    const filePath = path.join(process.cwd(), "JSONs", "publications", "paperDetails.json");
    const data = await fs.promises.readFile(filePath, "utf-8");
    const parsedData = JSON.parse(data);

    res.status(200).json(parsedData);
  } catch (err) {
    console.error("Error reading paper details data:", err);
    res.status(500).json({ error: "Failed to read or write JSON file" });
  }
}
