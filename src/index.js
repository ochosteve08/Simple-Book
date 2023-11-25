const express = require("express");
require("dotenv").config();
const { ConnectToDb, getDb } = require("./utils/db");
const swaggerUi = require("swagger-ui-express");
const swaggerJson = require("./doc/swagger.json");
const morgan = require("morgan");

const app = express();
app.use(express.json());

app.get("/", (request, response) => {
  response.json({ message: "endpoint is working" });
});

app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerJson));
app.get("/api/v1/docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerJson);
});

app.use(morgan("dev"));
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
