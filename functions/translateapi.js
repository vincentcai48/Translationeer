const router = require("express").Router();

const request = require("request");
const cheerio = require("cheerio");
const path = require("path");
const { response } = require("express");

//BELOW ARE ALL THE TRANSLATION ENDPOINTS

//Whitaker's Words to Latin
router.get("/whitakerslatin/:keyword", (req, res) => {
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

//Whitaker's Words to English
router.get("/whitakersenglish/:keyword", (req, res) => {
  const keyword = req.params.keyword;
  const url = "http://archives.nd.edu/cgi-bin/wordz.pl?english=" + keyword;
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

//Online Latin Dictionary .com, English to Latin
router.get("/onlinelatindictionary/latintoenglish/:keyword", (req, res) => {
  const keyword = req.params.keyword;
  const url =
    "https://www.online-latin-dictionary.com/latin-english-dictionary.php?parola=" +
    keyword;
  request(url, (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html);
      const domSelection = $(
        ".container table tbody #middle #wrapper #myth .english"
      );
      const siteContent = domSelection.html();
      res.send("<div>" + siteContent + "</div>");
    }
  });
});

//Online Latin Dictionary .com, Latin to English
router.get("/onlinelatindictionary/englishtolatin/:keyword", (req, res) => {
  const keyword = req.params.keyword;
  const url =
    "https://www.online-latin-dictionary.com/english-latin-dictionary.php?parola=" +
    keyword;
  request(url, (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html);
      const domSelection = $(
        ".container table tbody #middle #wrapper #myth .english"
      );
      const siteContent = domSelection.html();
      res.send("<div>" + siteContent + "</div>");
    }
  });
});

//LatDict, Latin to English
router.get("/latdict/latintoenglish/:keyword", (req, res) => {
  const keyword = req.params.keyword;
  const url = "https://latin-dictionary.net/search/latin/" + keyword;
  request(url, (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html);
      const domSelection = $("#search-results-list .definitions ol");
      const siteContent = domSelection.html();
      res.send("<div>" + siteContent + "</div>");
    }
  });
});

//LatDict, English to Latin
router.get("/latdict/englishtolatin/:keyword", (req, res) => {
  const keyword = req.params.keyword;
  const url = "https://latin-dictionary.net/search/english/" + keyword;
  request(url, (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html);
      const definition = $("#search-results-list h3 a");
      const info = $("#search-results-list .grammar ul");
      const siteContent = definition.html() + info.html();
      res.send("<div>" + siteContent + "</div>");
    }
  });
});

module.exports = router;
