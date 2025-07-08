import * as fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), "JSONs", "home", "news.json");
    const data = await fs.promises.readFile(filePath, "utf-8");
    const parsedData = JSON.parse(data); 
    
    const sortedNews = parsedData.news.sort((a, b) => new Date(b.date.full) - new Date(a.date.full));
    
    const featuredNews = sortedNews.filter(item => item.featured);
    const regularNews = sortedNews.filter(item => !item.featured);
    
    const homepageNews = [...featuredNews, ...regularNews].slice(0, 4);
    
    res.status(200).json(homepageNews);
  } catch (err) {
    console.error("Error reading news data:", err);
    res.status(500).json({ error: "Failed to read JSON file" });
  }
}
