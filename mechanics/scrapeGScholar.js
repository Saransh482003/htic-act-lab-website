const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

let BASE_URL = "https://scholar.google.com/citations?user=jkACmbEAAAAJ&hl=en&pagesize=100";

async function fetchAllScholarLinks(pathToSave) {
    let allLinks = [];
    let page=0;
    let keepgoing = true

    while (keepgoing) {
        const response = await axios.get(`${BASE_URL}&cstart=${page * 100}`);
        const $ = cheerio.load(response.data);

        const links = [];
        try {
            $(".gsc_a_t > a").each((index, element) => {
                const link = $(element).attr('href');
                if (link) {
                    links.push(`https://scholar.google.com${link}`);
                }
            });
    
            allLinks.push(...links);
            if (links.length == 100) {
                page++;
            } else {
                keepgoing = false;
            }
        }
        catch (error) {
            console.error("Error parsing the page:", error);
            keepgoing = false;
        }
    }

    fs.writeFileSync(pathToSave, JSON.stringify(allLinks, null, 4));
    console.log(`All links saved to ${pathToSave}`);
}

async function fetchPaperDetails(link) {
    const response = await axios.get(link);
    const $ = cheerio.load(response.data);
    try {
        const title = $(".gsc_oci_title_link").text().trim();
        const paperLink = $(".gsc_oci_title_link").attr('href');
        const details = $(".gsc_oci_value");
        const authors = details.eq(0).text().trim().split(', ').map(author => author.trim());
        const publicationDate = dayjs(details.eq(1).text().trim(), "YYYY/M/D").format("DD MMMM YYYY");
        const conference = details.eq(2).text().trim();
        const pages = details.eq(3).text().trim();
        const publisher = details.eq(4).text().trim();
        const description = details.eq(5).text().trim();
        const citations = parseInt(details.eq(6).find('a:first-child').text().trim().replace("Cited by ", ""), 10) || 0;
    
        return {
            "title": title,
            "authors": authors,
            "publicationDate": publicationDate,
            "conference": conference,
            "pages": pages,
            "publisher": publisher,
            "description": description,
            "citations": citations
        };
    }
    catch (error) {
        console.error("Error fetching paper details:", error);
        return null;
    }
}

module.exports = {
    fetchAllScholarLinks,
    fetchPaperDetails
};

// Example usage:

// fetchAllScholarLinks(path.join(__dirname, '..', "JSONs", 'publications', 'gScholarLinks.json'))
//     .then(() => console.log('Scraping completed successfully.'))
//     .catch(error => console.error("Error during scraping:", error));

// (async () => {
//   const paper = await fetchPaperDetails("https://scholar.google.com/citations?view_op=view_citation&hl=en&oe=ASCII&user=jkACmbEAAAAJ&pagesize=100&citation_for_view=jkACmbEAAAAJ:yxmsSjX2EkcC");
//   console.log(paper);
// })();