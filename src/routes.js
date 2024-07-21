const express = require("express");
const app = express.Router();

const { responseReturn } = require("./auth");
const logger = require("../logger");


const {
    putDocumentInIndex,
    createIndex,
    deleteIndex,
    queryInsideIndex,
    seeMappingOfIndex,
    runAnalyzer,
    updateParticularDoc,
} = require("./searchOperations");

// TODO: Create different view service for index operations

app.param("id", (req, res, next, id) => {
    logger.info("Id Number- " + id);
    next();
});

app.param("indName", (req, res, next, indName) => {
    logger.info("Index Name- " + indName);
    next();
});

app.post("/index/:indName/insertDocuments", async (req, res) => {
    let indexName = req.params.indName;
    let data = req.body;
    if (!data || !Object.keys(data).length) {
        return res.status(400).json({
            data: null,
            error: "Please enter document to be inserted",
            status: 400,
        });
    }
    let cookie = req.headers.authorization;

    let response = await putDocumentInIndex(JSON.stringify(data), indexName, cookie);

    return responseReturn(response, req, res);
});

app.put("/index/:indName/updateDocument/:id", async (req, res) => {
    let doc = req.body;

    if (!doc || !Object.keys(doc).length) {
        return res.status(400).json({
            data: null,
            error: "Please enter document to be updated!",
            status: 400,
        });
    }
    let indexName = req.params.indName;
    let _id = req.params.id;
    let cookie = req.headers.authorization;

    let response = await updateParticularDoc(indexName, _id, doc, cookie);

    return responseReturn(response, req, res);
});

app.put("/index/:indName/create", async (req, res) => {
    let indexName = req.params.indName;
    let isExplicitMapping = req.query?.isExplicitMapping || false;
    let cookie = req.headers.authorization;
    let query = req.body;
    let response = await createIndex(indexName, cookie, query, isExplicitMapping);
    return responseReturn(response, req, res);
});

app.delete("/index/:indName/delete", async (req, res) => {
    let indexName = req.params.indName;
    let cookie = req.headers.authorization;

    let response = await deleteIndex(indexName, cookie);

    return responseReturn(response, req, res);
});

app.post("/analyze", async (req, res) => {
    let query = req.body;
    let cookie = req.headers.authorization;
    if (!Object.keys(query).length) {
        return res.status(400).json({
            data: null,
            error: "Please provide some query to be analyzed",
            status: 400,
        });
    }

    let response = await runAnalyzer(query, cookie);

    return responseReturn(response, req, res);
});

app.get("/index/resync", async (req, res) => { });

app.get("/index/info", async (req, res) => { });

app.post("/searchIndex/:indName", async (req, res) => {
    let indexName = req.params.indName;
    let query = req.body;
    let cookie = req.headers.authorization;

    let response = await queryInsideIndex(query, indexName, cookie);
    return responseReturn(response, req, res);
});

app.post("/seeMappings/:indName", async (req, res) => {
    let indexName = req.params.indName;
    let auth = req.headers.authorization;
    let response = await seeMappingOfIndex(indexName, auth);

    return responseReturn(response, req, res);
});

module.exports = app;