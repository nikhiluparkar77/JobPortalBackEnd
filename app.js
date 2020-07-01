const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");

const app = express();

// New Api
const NewUserRoute = require("./api/routes/NewRouter/NewUser");
const JobRoute = require("./api/routes/NewRouter/Jobs");
const PersonalInfoRoute = require("./api/routes/NewRouter/personalInfo");

mongoose.connect("mongodb://127.0.0.1:27017/ProjectData", {
  useCreateIndex: true,
  useNewUrlParser: true,
});

mongoose.Promise = global.Promise;

app.use(morgan("dev"));

app.use("/uploads", express.static("uploads"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Passport Middleware
app.use(passport.initialize());

// Passwort Config
require("./api/config/possport")(passport);

// New User Api
app.use("/api", NewUserRoute);

// Route which should Handle request
app.use("/api/job", JobRoute);
app.use("/api/profile", PersonalInfoRoute);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    err: {
      message: err.message,
    },
  });
});

module.exports = app;
