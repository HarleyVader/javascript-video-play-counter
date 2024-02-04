const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Level } = require('level');
const fs = require('fs');
const https = require('https');

const app = express();
const PORT = 3000;
/*
var key = fs.readFileSync('/usr/local/hestia/ssl/certificate.key');
var cert = fs.readFileSync('/usr/local/hestia/ssl/certificate.crt');
var options = {
  key: key,
  cert: cert
};
*/
//using an anonimous function will asign the constant globaly
const filter = (value) => {
    if (value === "ico" || value === "css" || value === "counter") {
        return false; 
    }
    if (fs.statSync(path.resolve("../") + '/' + value).isDirectory()) {
        return true
    }
    return false
}
/*
//will asign the the scope of fs inside the function
function filter(value) {
    if (value === "ico" || value === "css") {
        return false; 
    }
    if (fs.statSync(path.resolve("./") + '/' + value).isDirectory()) {
        return true
    }
    return false
}
filter();
*/

//fs get dir list by filtering then joining & resolving the path for the fs to read the dir sync
let dirlist = fs.readdirSync(path.resolve("../")).filter(filter);
// Create a database
const db = new Level('vidViews', { valueEncoding: 'json' })
const addVid = async (value) => {
    if (!await db.get(value, () => false)) {
        await db.put(value, 0)
    }
}
async function addVidTodb() {
    dirlist.forEach(addVid)
}
addVidTodb();
let videoPlayCount;
// Middleware to parse JSON in the request body
app.use(bodyParser.json());
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.get("/api/list", async (req, res) => {
    let list = [];
    for await (const [key, value] of db.iterator({})) {
        list.push({ key, value });
    }
    return res.send(list);
})
app.get('/api/sync', (req, res) => {
    addVidTodb();
    return res.send("OK")
})
// Route to handle incrementing the video play counter
app.get('/api/counter/:videoId', async (req, res) => {
    const { videoId } = req.params;
    console.log(videoId)
    let videoviews = await db.get(videoId);
    console.log(videoviews)

    if (videoviews !== undefined) {   
        videoviews += 1;    
        await db.put(videoId, videoviews); 
        console.log(`Video ${videoId} play count incremented. Total plays: ${videoPlayCount}`);
        // Send the updated view count back to the client
        res.json({ success: true, viewCount: videoviews });
    } else {
        res.status(400).json({ success: false, error: 'Missing videoId in the request body' });
    }
});
var server = https.createServer(app);

server.listen(PORT, () => {
  console.log("server starting on port : " + PORT)
});

const debug = function () {
    console.log(dirlist);
    //() => { } //anonimous function 
    console.log(filter);
    //process.exit(); //forcefull prosses exit
    console.log(videoPlayCount);
    //console.log(() => { })
}
debug();
