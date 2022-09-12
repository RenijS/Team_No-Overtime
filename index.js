const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));
//ejs
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  //res.sendFile(path.join(__dirname + "/public/html/index.html"));
  res.render("index");
});

app.get("/login", (req, res) => {
  //res.sendFile(path.join(__dirname + "/public/html/Login.html"));
  res.render("login");
});

app.get("/contact", (req, res) => {
  //res.sendFile(path.join(__dirname + "/public/html/Contact.html"));
  res.render("Contact");
});

app.get("/reminder", (req, res) => {
  //res.sendFile(path.join(__dirname + "/public/html/reminder.html"));
  res.render("reminder");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
