var elasticsearch = require('elasticsearch');
require("dotenv").config();
var elasticUrl = process.env.elastic_url
var client = new elasticsearch.Client({ host: elasticUrl, requestTimeout: 60000 });

console.log('Elastic url ', elasticUrl)
function getElasticClient() {
    return client
}
module.exports = {
    getElasticClient: getElasticClient
}