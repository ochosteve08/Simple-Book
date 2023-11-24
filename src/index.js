const express = require("express");
require("dotenv").config();
const { ConnectToDb, getDb } = require("./utils/db");

const app = express();
app.use(express.json());

app.get("/", (request, response) => {
  response.json({ message: "this is working fine" });
  console.log("GET request");
});

let db;
ConnectToDb((err) => {
  if (!err) {
    app.listen(process.env.APP_PORT || 8000, (err) => {
      console.info(
        `Server running on ${process.env.APP_HOST}:${process.env.APP_PORT}`
      );
    });
    db = getDb();
  }
});
