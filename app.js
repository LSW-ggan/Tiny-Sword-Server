var express = require('express');
var cookieParser = require('cookie-parser');

const dotenv = require("dotenv");
dotenv.config();

const swaggerUi = require("swagger-ui-express");
const config = require("./config/config.js");

const { sequelize } = require("./models");
var logger = require('morgan');

var indexRouter = require('./routes/index');

const ApiError = require("./middleware/ApiError");

var app = express();
const appUrl = config.APP_URL;
const port = config.PORT || 8000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// swagger setting
const swaggerFile = require("./swagger/swagger-output.json");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use('/api', indexRouter);

app.use(ApiError);

const { dbConfig } = require("./config/config.js");

app.listen(port, async () => {
    console.log(`Server is up on port ${appUrl}:${port}`);
    try {
        await sequelize
            .sync({ force: false })
            .then(() => {
                console.log(
                    "DB Connection has been established successfully."
                );
            })
            .catch((error) => {
                console.log(dbConfig);
                console.error("Unable to connect to the database: ", error);
            });
        console.log(
            `${port} PORT Connection has been established successfully.`
        );
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
});

module.exports = app;
