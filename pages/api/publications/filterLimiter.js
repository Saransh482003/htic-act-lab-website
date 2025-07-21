import * as fs from "fs";
import path from "path";

export default async function handler(req, res) {
     const authorLim = req.query?.authors || 15;
     const publisherLim = req.query?.publishers || 5;
     const yearLim = req.query?.years || 5;
    try {
        const filePath = path.join(process.cwd(), "JSONs", "publications", "paperDetails.json");
        const data = await fs.promises.readFile(filePath, "utf-8");
        const parsedData = JSON.parse(data);

        // Count authors
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
        
        // Count publishers
        let publisher_count = {}
        for(let i=0; i< parsedData.length; i++) {   
            if (parsedData[i].Publisher) {
                const publisher = parsedData[i].Publisher;
                if (publisher_count[publisher]) {
                    publisher_count[publisher] += 1;
                } else {
                    publisher_count[publisher] = 1;
                }
            }
        }
        
        // Count years
        let year_count = {}
        for(let i=0; i< parsedData.length; i++) {   
            if (parsedData[i]["Publication date"]) {
                const year = new Date(parsedData[i]["Publication date"]).getFullYear().toString();
                if (year_count[year]) {
                    year_count[year] += 1;
                } else {
                    year_count[year] = 1;
                }
            }
        }
        
        // Convert author_count object to array of objects
        const authorArray = Object.entries(author_count).map(([name, count]) => ({
            name: name,
            publicationCount: count
        }));
        
        // Convert publisher_count object to array of objects
        const publisherArray = Object.entries(publisher_count).map(([name, count]) => ({
            name: name,
            publicationCount: count
        }));
        
        // Convert year_count object to array of objects
        const yearArray = Object.entries(year_count).map(([year, count]) => ({
            year: year,
            publicationCount: count
        }));
        
        // Sort by publication count in descending order
        authorArray.sort((a, b) => b.publicationCount - a.publicationCount);
        publisherArray.sort((a, b) => b.publicationCount - a.publicationCount);
        yearArray.sort((a, b) => parseInt(b.year, 10) - parseInt(a.year, 10));

        // Get top items based on limits
        const topAuthors = authorArray.slice(0, authorLim);
        const topPublishers = publisherArray.slice(0, publisherLim);
        const topYears = yearArray.slice(0, yearLim);

        const groundAuths = path.join(process.cwd(), "JSONs", "publications", "groundAuthors.json");
        const groundAuthsList = await fs.promises.readFile(groundAuths, "utf-8");
        const groundAuthors = JSON.parse(groundAuthsList);

        res.status(200).json({
            message: `Top ${authorLim} authors, ${publisherLim} publishers, and ${yearLim} years with most publications`,
            totalAuthors: authorArray.length,
            totalPublishers: publisherArray.length,
            totalYears: yearArray.length,
            topAuthors: topAuthors.map(author => author.name),
            topPublishers: topPublishers.map(publisher => publisher.name),
            topYears: topYears.map(year => year.year),
            groundAuthors: groundAuthors
        });
    } catch (err) {
        console.error("Error reading projects data:", err);
        res.status(500).json({ error: "Failed to read JSON file" });
    }
}
