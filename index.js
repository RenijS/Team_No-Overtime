const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/html/index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/html/Login.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/html/Contact.html"));
});

app.get("/reminder", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/html/reminder.html"));
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
