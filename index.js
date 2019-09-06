require("sqlite3");

const app = require("./backend");
const express = require("express");
const path = require("path");

if (process.env["NODE_ENV"] === "development") {
  const proxy = require("http-proxy-middleware");
  app.use("/*", proxy({ target: "http://localhost:3001", changeOrigin: true, ws: true }));
}

app.use(express.static(path.join(__dirname, "frontend", "build")));
app.get("/*", (req, res) => res.sendFile("frontend/build/index.html", { root: __dirname }));
