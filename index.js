const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));
//ejs
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/contact", (req, res) => {
  res.render("Contact");
});

app.get("/reminder", (req, res) => {
  res.render("reminder");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
