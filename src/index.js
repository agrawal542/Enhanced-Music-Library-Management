const express = require('express')
const apiRoutes = require('./routes/index.js');
const { ServerConfig, Logger } = require('./config/index.js');
const { ErrorMiddleware } = require('./middlewares/index.js');
const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use("/api", apiRoutes)

const swaggerDocument = YAML.load("./swaggerDoc.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use(ErrorMiddleware.errorHandler)
app.use(ErrorMiddleware.notFound)

app.listen(ServerConfig.PORT, () => {
    console.log(`Server is running on PORT : ${ServerConfig.PORT}`)
    Logger.info("Succesfully started the server")

})

