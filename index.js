const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");

const mongoose = require("mongoose");
const User = require("./models/User");
const Reminder = require("./models/Reminder");
const Contact = require("./models/Contact");
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

const nodemailer = require("nodemailer");
const corn = require("node-cron");

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

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("Login");
});

app.post("/register", async (req, res) => {
  const { name, email, password, repassword } = req.body;
  const user = User.findOne({ email })
    .then(async (user) => {
      if (!user) {
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
              res.render("Login", { status: "success", message: msg });
            })
            .catch((err) => {
              console.log("Registration error: ", err);
            });
        } else {
          const msg = "Password didn't match, try again";
          res.render("Login", { status: "error", message: msg });
        }
      } else {
        const msg = "User already exists";
        res.render("Login", { status: "error", message: msg });
      }
    })
    .catch((err) => {
      console.log("Error: ", err);
    });
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

app.get("/contact", async (req, res) => {
  const cookie = req.cookies.jwtToken;
  if (cookie != undefined) {
    const token = jwt.decode(cookie);
    const contact = await Contact.find({ userId: token.id })
      .then((contact) => {
        console.log("Contact found", contact);
        res.render("Contact", { contact });
      })
      .catch((err) => {
        console.log("error: ", err);
      });
  } else {
    const msg = "Login is required";
    res.render("Login", { status: "error", message: msg });
  }
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

app.get("/profile", async (req, res) => {
  const token = req.cookies.jwtToken;
  let userInfo = {
    id: "",
    name: "",
    dob: "",
    phone: "",
    sosContact: "",
  };
  if (token != undefined) {
    const tokenDecoded = jwt.decode(token);
    const user = await User.findOne({ _id: tokenDecoded.id });
    userInfo = {
      id: user._id,
      name: user.name,
      dob: "",
      phone: user.phone,
      sosContact: user.sosContact,
    };
    if (user.dob != undefined) {
      userInfo = {
        id: user._id,
        name: user.name,
        dob: user.dob.toISOString().split("T")[0],
        phone: user.phone,
        sosContact: user.sosContact,
      };
    }
    console.log(userInfo);
    res.render("profile", {
      user: userInfo,
    });
  } else {
    const msg = "Login is required";
    res.render("Login", { status: "error", message: msg });
  }
});

app.put("/update/profile/:id", async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
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
    const user = await User.findOne({ _id: token.id });
    const { title, remindDate, notes } = req.body;
    const remDate = new Date(remindDate);
    const cronDate = `${remDate.getMinutes()} ${remDate.getHours()} ${remDate.getDate()} ${
      remDate.getMonth() + 1
    } ${remDate.getDay()}`;
    //email reminder
    //email config
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: `Reminder ${title}`,
      text: `This is your reminder for ${title} \n ${notes}`,
    };

    let reminder = new Reminder({ userId: token.id, title, remindDate, notes });
    reminder
      .save()
      .then((reminder) => {
        console.log("Reminder saved", reminder);

        corn.schedule(cronDate, () => {
          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              console.log(err);
            } else {
              console.log("Email send: " + info.response);
            }
          });
        });

        res.redirect("/reminder");
      })
      .catch((err) => console.log("Error: ", err));
  } else {
    const msg = "Login is required";
    res.render("Login", { status: "error", message: msg });
  }
});

app.post("/sms/sos", async (req, res) => {
  console.log("SOS Button Clicked");
  const token = req.cookies.jwtToken;
  if (token != undefined) {
    const tokenDecoded = jwt.decode(token);
    const user = await User.findOne({ _id: tokenDecoded.id });
    let userInfo = {
      id: user._id,
      name: user.name,
      dob: "",
      phone: user.phone,
      sosContact: user.sosContact,
    };
    if (user.dob != undefined) {
      userInfo = {
        id: user._id,
        name: user.name,
        dob: user.dob.toISOString().split("T")[0],
        phone: user.phone,
        sosContact: user.sosContact,
      };
    }
    if (user.sosContact != undefined) {
      client.messages
        .create({
          body: `SOS Message!, \n ${user.name} requires help \n please check the status of sender`,
          from: process.env.TWILIO_PHONE_NUM,
          to: `+61${user.sosContact}`,
        })
        .then((message) => {
          console.log(message.sid);
          res.redirect("/");
        })
        .catch((err) => {
          console.log(err);
          const msg = "SOS contact invalid";
          res.render("profile", {
            user: userInfo,
            status: "error",
            message: msg,
          });
        });
    } else {
      console.log("Error", "please enter sos contact number");
      res.redirect("/profile");
    }
  } else {
    const msg = "Login is required";
    res.render("Login", { status: "error", message: msg });
  }
});

app.post("/sms/msg", async (req, res) => {
  const token = req.cookies.jwtToken;
  const { numOpt, msg } = req.body;
  if (token != undefined) {
    const tokenDecoded = jwt.decode(token);
    const user = await User.findOne({ _id: tokenDecoded.id });

    client.messages
      .create({
        body: `Message from ${user.name}, \n "${msg}"`,
        from: process.env.TWILIO_PHONE_NUM,
        to: `+61${numOpt}`,
      })
      .then((message) => {
        console.log("message sent", message.sid);
        res.redirect("/contact");
      })
      .catch(async (err) => {
        console.log("Err", err);
        const contact = await Contact.find({ userId: token.id })
          .then((contact) => {
            console.log("contact search");
            if (err.status === 400) {
              const msg = "Error, invalid phone number.";
              res.render("Contact", { contact, status: "error", message: msg });
            } else {
              const msg = "Error, please try again";
              res.render("Contact", { contact, status: "error", message: msg });
            }
          })
          .catch((err) => {
            console.log("Contact error: ", err);
          });
      });
  } else {
    res.redirect("/login");
  }
});

app.post("/add/contact", (req, res) => {
  const cookie = req.cookies.jwtToken;
  if (cookie != undefined) {
    const token = jwt.decode(cookie);
    const { name, phone } = req.body;
    console.log(req.body);
    console.log(token.id, name, phone);
    let contact = new Contact({ userId: token.id, name, phone });
    contact
      .save()
      .then((contact) => {
        console.log("Contact saved:", contact);
        res.redirect("/contact");
      })
      .catch((err) => console.log(err));
  } else {
    const msg = "Login is required";
    res.render("Login", { status: "error", message: msg });
  }
});

app.delete("/delete/contact", async (req, res) => {
  const { contactId } = req.body;
  await Contact.deleteOne({ _id: contactId })
    .then((contact) => {
      console.log("Contact Deleted: ", contact);
      res.redirect("/contact");
    })
    .catch((err) => console.log(err));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
