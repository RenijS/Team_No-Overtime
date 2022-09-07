const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
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

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
