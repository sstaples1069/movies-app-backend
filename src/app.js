if (process.env.USER) require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const errorHandler = require("../errors/errorHandler")
const notFound = require("../errors/notFound");

app.use(cors());
app.use(express.json());

app.use(notFound);
app.use(errorHandler)

module.exports = app;
