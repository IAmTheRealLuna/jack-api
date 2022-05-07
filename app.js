const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Sentry = require('@sentry/node');
const bodyParser = require("body-parser");
const morgan = require('morgan')
const rfs = require('rotating-file-stream')
const path = require('path')
const moment = require('moment');
const compression = require('compression')
const helmet = require("helmet");
const favicon = require('serve-favicon')
const rateLimit = require('express-rate-limit')

require("dotenv").config();

// DB Connection init
mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("Connected to DB"),
);

// create a rotating write stream for access log
const accessLogStream = rfs.createStream(`${moment().format('DD-MM-YYYY')}-access.log`, {
  interval: '1d', // rotate daily
  compress: "gzip",
  path: path.join(__dirname, 'log')
})

// Sentry Inits
Sentry.init({ dsn: process.env.DSN });

const apiRequestLimiter = rateLimit({
  windowMs: 60 * 1000 * 60, // 60 minute
  max: 3000 // limit each IP to 3000 requests per windowMs
})

app.use(apiRequestLimiter)

app.use(favicon(path.join(__dirname, 'assets', 'favicon.png')))

// Parser for JSON
app.use(bodyParser.json());

// HTTP Logging User Agent + ip
app.use(morgan('combined', { stream: accessLogStream }))

// Security Headers Middleware
app.use(helmet());

//Compression
app.use(compression())

// Sentry app use
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());

// Router imports for /routes
const jokesRoute = require("./routes/jokes");

// App use for stuff in /routes
app.use("/jokes", jokesRoute);

app.use(function (req, res, next) {
  res.status(404);
  res.send('404: Endpoint Not Found');
});

// Listening port
app.listen(process.env.PORT, function () {
  console.log("Server is running on: https://api.magically.works");
});
