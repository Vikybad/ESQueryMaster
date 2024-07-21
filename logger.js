const winston = require("winston");

const date = new Date();
const logger = winston.createLogger({
    transports: [new winston.transports.Console()],
});

const info = (message) => {
    logger.info(`${date.toLocaleString()} ${message}`);
};

const error = (message) => {
    logger.error(`${date.toLocaleString()} ${message}`);
};

module.exports = {
    info: info,
    error: error,
};