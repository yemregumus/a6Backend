const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const cors = require("cors");
const dotenv = require("dotenv");
require("dotenv").config();
const userService = require("./user-service.js");
const app = express();
dotenv.config();

const HTTP_PORT = process.env.PORT || 8080;

// Setup Passport with JwtStrategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(jwtOptions, (jwtPayLoad, next) => {
    if (jwtPayLoad) {
      next(null, {
        _id: jwtPayLoad._id,
        userName: jwtPayLoad.userName,
      });
    } else next(null, false);
  })
);

app.use(express.json());
app.use(cors());
app.use(passport.initialize());

app.post("/api/user/register", (req, res) => {
  userService
    .registerUser(req.body)
    .then((msg) => {
      res.json({ message: msg });
    })
    .catch((msg) => {
      res.status(422).json({ message: msg });
    });
});

app.post("/api/user/login", (req, res) => {
  userService
    .checkUser(req.body)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      res.json({ message: "login successful", token: token });
    })
    .catch((error) => {
      res.status(422).json({ message: "Login failed", error: error.message });
    });
});

app.get("/", (req, res) => {
  res.send("Server is live!");
});

app.get("/api/user/favourites", (req, res) => {
  userService
    .getFavourites(req.user._id)
    .then((data) => {
      res.json(data);
    })
    .catch((msg) => {
      res.status(422).json({ error: msg });
    });
});

app.put("/api/user/favourites/:id", (req, res) => {
  userService
    .addFavourite(req.user._id, req.params.id)
    .then((data) => {
      res.json(data);
    })
    .catch((msg) => {
      res.status(422).json({ error: msg });
    });
});

app.delete("/api/user/favourites/:id", (req, res) => {
  userService
    .removeFavourite(req.user._id, req.params.id)
    .then((data) => {
      res.json(data);
    })
    .catch((msg) => {
      res.status(422).json({ error: msg });
    });
});

app.get("/api/user/history", (req, res) => {
  userService
    .getHistory(req.user._id)
    .then((data) => {
      res.json(data);
    })
    .catch((msg) => {
      res.status(422).json({ error: msg });
    });
});

app.put("/api/user/history/:id", (req, res) => {
  userService
    .addHistory(req.user._id, req.params.id)
    .then((data) => {
      res.json(data);
    })
    .catch((msg) => {
      res.status(422).json({ error: msg });
    });
});

app.delete("/api/user/history/:id", (req, res) => {
  userService
    .removeHistory(req.user._id, req.params.id)
    .then((data) => {
      res.json(data);
    })
    .catch((msg) => {
      res.status(422).json({ error: msg });
    });
});

userService
  .connect()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("API listening on: " + HTTP_PORT);
    });
  })
  .catch((err) => {
    console.log("unable to start the server: " + err);
    process.exit();
  });
