const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");

const mongoose = require("mongoose");
const User = require("./models/User");
const Reminder = require("./models/Reminder");
require("dotenv").config();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));
//ejs
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
//for post
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongo Conection Open!");
  })
  .catch((err) => {
    console.log("Mongo ERROR: ", err);
  });

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("Login");
});

app.post("/register", async (req, res) => {
  const { name, email, password, repassword } = req.body;
  if (repassword == password) {
    const hPassword = await bcrypt.hash(password, 10);

    let user = new User({
      name,
      email,
      password: hPassword,
    });

    user
      .save()
      .then((user) => {
        const msg = "User saved successfully";
        console.log(msg, user);
        res.render("Login", { status: "success", message: msg });
      })
      .catch((err) => {
        console.log("Registration error: ", err);
      });
  } else {
    const msg = "Password didn't match, try again";
    console.log(msg);
    res.render("Login", { status: "error", message: msg });
  }
});

app.post("/login", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  const user = User.findOne({ email })
    .then(async (user) => {
      if (!user) {
        const msg = "User doesn't exists";
        console.log(msg);
        res.render("Login", { status: "error", message: msg });
      } else {
        if (await bcrypt.compare(password, user.password)) {
          const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET
          );
          res.cookie("jwtToken", token, {
            path: "/",
          });
          console.log("Success token: ", token);
          console.log("Decoded token: ", jwt.decode(token));
          res.redirect("/");
        } else {
          const msg = "Password is incorrect";
          console.log(msg);
          res.render("Login", { status: "error", message: msg });
        }
      }
    })
    .catch((err) => {
      console.log("Error: ", err);
    });
});

app.get("/signout", (req, res) => {
  res.clearCookie("jwtToken", { path: "/" });
  res.render("index");
  console.log("User signout successful");
});

app.get("/contact", (req, res) => {
  console.log("==================");
  const token = req.cookies.jwtToken;
  console.log(jwt.decode(token));
  res.render("Contact");
});

app.get("/reminder", (req, res) => {
  const cookie = req.cookies.jwtToken;
  if (cookie == undefined) {
    res.render("reminder");
  } else {
    const token = jwt.decode(cookie);
    const reminders = Reminder.find({ userId: token.id })
      .then((reminders) => {
        res.render("reminder", { id: token.id, reminders });
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

app.get("/settings", (req, res) => {
  res.render("settings");
});

app.get("/profile", async (req, res) => {
  const token = req.cookies.jwtToken;
  const userInfo = {
    id: "",
    name: "",
    dob: "",
    phone: "",
  };
  if (token != undefined) {
    const tokenDecoded = jwt.decode(token);
    const user = await User.findOne({ _id: tokenDecoded.id });
    userInfo = {
      id: user._id,
      name: user.name,
      dob: user.dob.toISOString().split("T")[0],
      phone: user.phone,
    };
  }
  res.render("profile", {
    user: userInfo,
  });
});

app.put("/update/profile/:id", async (req, res) => {
  const { id } = req.params;
  const updatedUser = await User.findByIdAndUpdate(id, req.body, {
    runValidators: true,
  })
    .then((user) => console.log(`updated user: ${user}`))
    .catch((err) => console.log(err));
  res.redirect("/profile");
});

app.post("/add/reminder", async (req, res) => {
  const cookie = req.cookies.jwtToken;
  if (cookie != undefined) {
    const token = jwt.decode(cookie);
    const { title, remindDate, notes } = req.body;
    let reminder = new Reminder({ userId: token.id, title, remindDate, notes });
    reminder
      .save()
      .then((reminder) => {
        console.log("Reminder saved", reminder);
        res.redirect("/reminder");
      })
      .catch((err) => console.log("Error: ", err));
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
