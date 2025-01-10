const express = require("express");
const router = express.Router();
const { createProxyMiddleware } = require("http-proxy-middleware");
const variables = require("../variables");

const serviceAProxy = createProxyMiddleware({
  target: variables.MS,
  changeOrigin: true,
  pathRewrite: {
    "^users": "",
  },
});

router.use("/", serviceAProxy);

module.exports = router;
