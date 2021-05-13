const functions = require('firebase-functions');
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

const express = require('express');
const app = express();
const cors = require('cors');
//const path = require('path')
// const request = require('request');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
app.use(cors({ origin: true }));

// const request = require("request");
// const cheerio = require("cheerio");
// const express = require("express");
// const path = require("path");
const translateapi = require("./translateapi.js");
// //require("dotenv").config();

// //console.log(process.env.FIREBASE_API_KEY);

//const app = express();

//USES ALL THE API ENDPOINTS FOR TRANSLATION
app.use("/translateapi", translateapi);
app.post("/pickhacks/",(req,res)=>{
    var d = new Date()
    db.collection("pickhacks").add({
        songName: req.body.name,
        songId: req.body.id,
        time: d.getTime(),
    }).then(r=>{
        console.log(r);
        res.send(200);
    }).catch(e=>{
        res.send(500)
    })
})

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "build")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "build", "index.html"));
//   });
// }

// const port = process.env.PORT || 5000;

// // app.listen(port, () => {
//   console.log(`server running on port: ${port}`);
// });

//"heroku-postbuild": "cd client && npm install && npm run build"

exports.app = functions.https.onRequest(app);
