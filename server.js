const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const fs = require('fs');
const path = require('path')

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const filePath = path.join(process.cwd(), "../visitors.csv");
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, "ip,timestamp\n");
}

app.get("/", (req, res) => {
  const ip =
    req.headers["x-forwarded-for"]?.split(",").shift() ||
    req.socket?.remoteAddress;

  const timestamp = new Date().toISOString();
  console.log("Visitor IP:", ip);

  fs.appendFileSync(filePath, `${ip},${timestamp}\n`);

  res.sendFile(path.join(process.cwd(), "index.html"));
});

