/* istanbul ignore file */

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

const config = {
    APP_URL: process.env.APP_URL,
    PORT: process.env.APP_PORT,
};

const dbConfig = {
    username: dbUsername,
    password: dbPassword,
    database: dbName,
    host: dbHost,
    dialect: "mysql",
    port: dbPort,
};

module.exports = {
    dbConfig,
    config,
};