const cheerio = require("cheerio");
const fetch = require('node-fetch');

export default async function whitakerslatin(req, res) {
    //console.log(req,req.params,req.body);
    const keyword = req.query.word;
    let url = `http://archives.nd.edu/cgi-bin/wordz.pl?keyword=${keyword}`
    let page = await fetch(url);
    let html = await page.text();
    const $ = cheerio.load(html);
    const pre = $("pre");
    const siteContent = pre.html();
    res.send("<pre>" + siteContent + "</pre>");
    // res.status(200).json({  })
}
  