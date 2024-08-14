const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Webhook server is running and ready to receive events.");
});

app.post("/webhook", (req, res) => {
  if (req.headers["x-github-event"] === "push") {
    console.log("push event occured");
    exec(
      `cd ~/NadoCat
        && git stash
        && git pull origin develop
        && cd ~/NadoCat/server
        && npm install 
        && npm run build 
        && pm2 restart ./dist/index.js 
        && cd ~/NadoCat/client && npm install 
        && npm run build 
        && pm2 restart client`,
      (err, stdout, stderr) => {
        if (err) {
          console.error(`exec error: ${err}`);
          res.status(500).send("Server error");

          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);

        if (!res.headersSent)
          res.status(200).send("Webhook received and processed successfully");
      }
    );
  }
});

const PORT = 3030;
app.listen(PORT, () => {
  console.log(`Webhook Server is running on port ${PORT}`);
});
