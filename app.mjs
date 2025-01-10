const express = require("express");
const morgan = require("morgan");
const chalk = require("chalk");
const responseTime = require("response-time");
const rate_limiter = require("./limiter/rate_limiter");
const speed_limiter = require("./limiter/speed_limiter");
const user_routes = require("./routes/user_routes");
morgan.token("status", (req, res) => {
  const status = res.statusCode;
  const color =
    status >= 500
      ? "red"
      : status >= 400
      ? "yellow"
      : status >= 300
      ? "cyan"
      : status >= 200
      ? "green"
      : "white";
  return chalk[color](status);
});

morgan.token("method", (req, res) => {
  return chalk.blue(req.method);
});

morgan.token("url", (req, res) => {
  return chalk.magenta(req.url);
});

morgan.token("date", (req, res) => {
  return chalk.gray(new Date().toISOString());
});

morgan.token("response-time", (req, res) => {
  let responseTime = parseFloat(res.getHeader("X-Response-Time"));

  if (responseTime > 1000) {
    responseTime = `${(responseTime / 1000).toFixed(2)} s`;
  } else {
    responseTime = `${responseTime} ms`;
  }
  return chalk.yellow(responseTime);
});

const app = express();

app.set("trust proxy", 1); // Enable trust proxy

app.use(responseTime()); // to set the X-Response-Time header
app.use(morgan(":date :method :url :status :response-time"));
app.use(speed_limiter);
app.use(rate_limiter);
app.use(express.json()); // middleware for parsing JSON bodies

// Routing to microservices
app.use("/users", user_routes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "gateway says ok!" });
});

module.exports = app;
