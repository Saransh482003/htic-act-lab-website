const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

const BASE_URL = "https://scholar.google.com/citations?user=jkACmbEAAAAJ&hl=en&pagesize=100";
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:92.0) Gecko/20100101 Firefox/92.0",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 15_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0"
];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function getRandomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}


async function fetchAllScholarLinks(pathToSave) {
  let allLinks = [];
  let page = 0;
  let keepgoing = true;

  while (keepgoing) {
    let retries = 3;

    while (retries > 0) {
      try {
        console.log(`🔍 Fetching page ${page}...`);
        const response = await axios.get(`${BASE_URL}&cstart=${page * 100}`, {
          headers: {
            "User-Agent": getRandomUserAgent()
          }
        });

        const $ = cheerio.load(response.data);
        const links = [];

        $(".gsc_a_t > a").each((index, element) => {
          const link = $(element).attr("href");
          if (link) {
            links.push(`https://scholar.google.com${link}`);
          }
        });

        allLinks.push(...links);

        if (links.length === 100) {
          page++;
          await sleep(Math.floor(Math.random() * 3000 + 2000)); // 2–5s delay
        } else {
          keepgoing = false;
        }

        break; // Success, break retry loop
      } catch (error) {
        const status = error?.response?.status;

        if (status === 429) {
          console.warn(`⚠️ 429 Too Many Requests. Retrying in 60 seconds... (${retries} retries left)`);
          await sleep(60000);
          retries--;
        } else {
          console.error("❌ Error fetching page:", error.message || error);
          keepgoing = false;
          break;
        }
      }
    }

    if (retries === 0) {
      console.error("❌ Max retries reached. Stopping...");
      break;
    }
  }

  fs.writeFileSync(pathToSave, JSON.stringify(allLinks, null, 4));
  console.log(`✅ All links saved to ${pathToSave} (${allLinks.length} total)`);
}

async function fetchPaperDetails(link, retries = 3) {
  try {
    const response = await axios.get(link, {
      headers: {
        "User-Agent": getRandomUserAgent()
      }
    });

    const $ = cheerio.load(response.data);

    const title = $(".gsc_oci_title_link").text().trim();
    const paperLink = $(".gsc_oci_title_link").attr("href");
    const labels = $(".gsc_oci_field");
    const values = $(".gsc_oci_value");
    let dataTray = {};
    for (let i = 0; i < labels.length; i++) {
      let label = labels.eq(i).text().trim();
      let value = values.eq(i).text().trim();
      if (label === 'Total citations') {
        value = values.eq(i).find("a").eq(0).text().trim().slice(9,).trim()
      } else if (label === 'Authors') {
        value = values.eq(i).text().trim().split(", ").map(author => author.trim());
      }
      dataTray[label] = value;
    }
    dataTray["Title"] = title;
    dataTray["Paper Link"] = paperLink || link;
    return dataTray;
  } catch (error) {
    const status = error?.response?.status;

    if (status === 429 && retries > 0) {
      console.warn(`⚠️ 429 Too Many Requests. Retrying in 60 seconds... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, 60000));
      return fetchPaperDetails(link, retries - 1);
    }

    console.error("❌ Error fetching paper details:", status || error.message);
    return null;
  }
}


module.exports = {
    fetchAllScholarLinks,
    fetchPaperDetails
};

// Example usage:

// fetchAllScholarLinks(path.join(__dirname, '..', "JSONs", 'publications', 'scholarLinks.json'))
//     .then(() => console.log('Scraping completed successfully.'))
//     .catch(error => console.error("Error during scraping:", error));

// (async () => {
//   const paper = await fetchPaperDetails("https://scholar.google.com/citations?view_op=view_citation&hl=en&oe=ASCII&user=jkACmbEAAAAJ&pagesize=100&citation_for_view=jkACmbEAAAAJ:1taIhTC69MYC");
//   console.log(paper);
// })();