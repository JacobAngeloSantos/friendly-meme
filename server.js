const express = require("express");
const app = express();

let database = [];

// Crawl function
async function crawl(url) {
  try {
    const res = await fetch(url);
    const html = await res.text();

    let titleMatch = html.match(/<title>(.*?)<\/title>/i);
    let title = titleMatch ? titleMatch[1] : "No title";

    let text = html.replace(/<[^>]*>/g, "").slice(0, 1000);

    database.push({
      title,
      url,
      content: text.toLowerCase()
    });

    console.log("Crawled:", url);
  } catch {
    console.log("Failed:", url);
  }
}

// Start crawler
async function startCrawler() {
  database = [];

  const sites = [
    "https://example.com",
    "https://www.wikipedia.org",
    "https://www.w3schools.com"
  ];

  for (let site of sites) {
    await crawl(site);
  }

  console.log("Crawling complete");
}

// Auto crawl every 10 minutes
setInterval(startCrawler, 10 * 60 * 1000);
startCrawler();

// API endpoint
app.get("/search", (req, res) => {
  let q = (req.query.q || "").toLowerCase();

  let results = database.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.content.includes(q)
  );

  res.json(results.slice(0, 10));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
