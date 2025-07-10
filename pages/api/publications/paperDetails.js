import fs from "fs/promises";
import path from "path";
import mechanics from "@/mechanics/scrapeGScholar.js"; // Ensure alias is configured

function sleep(ms = 3000) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const action = req.query?.action || "";

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

    // Always respond with final saved data
    const data = await fs.readFile(savePath, "utf-8");
    const parsedData = data.trim() ? JSON.parse(data) : [];

    res.status(200).json(parsedData);
  } catch (err) {
    console.error("❌ Error reading or writing paper details:", err);
    res.status(500).json({ error: "Failed to read or write JSON file" });
  }
}
