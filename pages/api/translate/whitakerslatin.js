const cheerio = require("cheerio");
const fetch = require('node-fetch');

export default async function handler(req, res) {
    //console.log(req,req.params,req.body);
    const keyword = req.query.word;
    console.log(keyword);
    let url = `http://archives.nd.edu/cgi-bin/wordz.pl?keyword=${keyword}`
    let page = await fetch(url);
    let html = await page.text();
    console.log(html);
    const $ = cheerio.load(html);
    const pre = $("pre");
    const siteContent = pre.html();
    console.log(siteContent);
    res.send("<pre>" + siteContent + "</pre>");
    // res.status(200).json({  })
}
  