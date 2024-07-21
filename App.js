const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const logger = require("./logger");
const { isAuthorized } = require("./src/auth");
const elasticRoutes = require("./src/routes");
require("dotenv").config();
process.env.TZ = "Asia/Calcutta";

app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(isAuthorized);
app.use("/elastic", elasticRoutes);

const port = process.env.port || 8123;

app.listen(port, () => {
    logger.info("Server is up and running");
});

// Define a middleware for handling invalid routes
app.use((req, res, next) => {
    logger.info(`[method: ${req?.method}, endPoint: ${req?.originalUrl}]`)
    res.status(404).json({
        data: null,
        error: "Invalid Route",
        status: 404,
    });
});

app.get("/", (req, res) => {
    res.status(200).json({
        data: "Home Page GET Response successfull - Authorized User",
        error: null,
        status: 200,
    });
});