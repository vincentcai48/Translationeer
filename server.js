const request = require("request");
const cheerio = require("cheerio");
const express = require("express");
const path = require("path");
const translateapi = require("./translateapi.js");

const app = express();

//USES ALL THE API ENDPOINTS FOR TRANSLATION
app.use("/translateapi", translateapi);

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
