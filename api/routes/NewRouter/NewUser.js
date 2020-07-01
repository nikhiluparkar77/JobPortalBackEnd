const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// NewUser Model
const NewUser = require("../../models/NewModel/NewUser");

// Register Api
router.post("/SignUp", (req, res, next) => {
  NewUser.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        return res.status(400).json({ message: "Email already exists" });
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: "200", // Size
          r: "pg", // Rating
          d: "mm", // Default
        });

        const newUser = new NewUser({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => res.json(user))
              .catch((err) => console.log(err));
          });
        });
      }
    })
    .catch();
});

// Login Api
router.post("/SignIn", (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  NewUser.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          // User Match
          const payload = {
            // Create JWT payload
            id: user.id,
            name: user.name,
            avatar: user.avatar,
          };
          // Sign Token
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                message: "Login Successfully",
                token: "Bearer " + token,
              });
            }
          );
        } else {
          return res.status(400).json({ message: "Password incorrect" });
        }
      });
    })
    .catch((err) => console.log(err));
});

router.delete(
  "/DeleteUser/:userId",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    const id = req.params.userId;
    NewUser.remove({ id })
      .then((user) => res.json(user))
      .catch((err) => console.log(err));
  }
);

// Private Route
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  }
);

module.exports = router;
