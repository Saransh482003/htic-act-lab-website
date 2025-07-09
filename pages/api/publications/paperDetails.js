import * as fs from "fs";
import path from "path";
import * as mechanics from "@/mechanics/scrapeGScholar.js";

function sleepRandom(min = 8000, max = 15000) {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}

export default async function handler(req, res) {
  const action = req.query?.action || "";

  try {
    if (action === "refetch") {
      const linksFile = path.join(process.cwd(), "JSONs", "publications", "scholarLinks.json");
      const savePath = path.join(process.cwd(), "JSONs", "publications", "paperDetails.json");

      // Load all scholar links
      const linksData = await fs.promises.readFile(linksFile, "utf-8");
      const allLinks = JSON.parse(linksData);

      // Load existing data if available
      let existingData = [];
      try {
        const prevData = await fs.promises.readFile(savePath, "utf-8");
        existingData = JSON.parse(prevData);
      } catch (e) {
        console.log("No previous data found. Starting fresh.");
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

          // Save progress immediately
          await fs.promises.writeFile(savePath, JSON.stringify(existingData, null, 4), "utf-8");
          console.log(`✅ Saved index ${i + 1}`);
        }

        await sleep(3000); // Wait before next fetch
      }

      console.log("🎉 Refetch complete.");
    }

    // READ FROM FILE TO RESPOND
    const filePath = path.join(process.cwd(), "JSONs", "publications", "paperDetails.json");
    const data = await fs.promises.readFile(filePath, "utf-8");
    const parsedData = JSON.parse(data);

    res.status(200).json(parsedData);
  } catch (err) {
    console.error("❌ Error reading or writing paper details:", err);
    res.status(500).json({ error: "Failed to read or write JSON file" });
  }
}
