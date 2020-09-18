const request = require("request");
const cheerio = require("cheerio");
const express = require("express");
const path = require("path");

const app = express();

app.get("/search/:keyword", (req, res) => {
  const keyword = req.params.keyword;
  const url = "http://archives.nd.edu/cgi-bin/wordz.pl?keyword=" + keyword;
  request(url, (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html);
      const pre = $("pre");
      const siteContent = pre.html();
      // .replace(/(\r\n|\n|\r)/gm, " [linebreakhere]");
      res.send("<pre>" + siteContent + "</pre>");
    }
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server running on port: ${port}`);
});
