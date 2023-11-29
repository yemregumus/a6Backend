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

const corsOptions = {
  origin: ["http://localhost:3000"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(express.json());
app.use(cors());
app.use(passport.initialize());

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

app.post("/api/user/register", cors(corsOptions), (req, res) => {
  userService
    .registerUser(req.body)
    .then((msg) => {
      res.json({ message: msg });
    })
    .catch((msg) => {
      res.status(422).json({ message: msg });
    });
});

app.post("/api/user/login", cors(corsOptions), (req, res) => {
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

app.get("/", cors(corsOptions), (req, res) => {
  res.send("Server is live!");
});

app.get("/api/user/favourites", cors(corsOptions), (req, res) => {
  // Check if req.user is defined
  if (req.user && req.user._id) {
    userService
      .getFavourites(req.user._id)
      .then((data) => {
        res.json(data);
      })
      .catch((msg) => {
        res.status(422).json({ error: msg });
      });
  } else {
    // Handle the case where req.user or req.user._id is undefined
    res.status(500).json({ error: "User information not available" });
  }
});

app.put("/api/user/favourites/:id", cors(corsOptions), (req, res) => {
  // Check if req.user is defined
  if (req.user && req.user._id) {
    userService
      .addFavourite(req.user._id, req.params.id)
      .then((data) => {
        res.json(data);
      })
      .catch((msg) => {
        res.status(422).json({ error: msg });
      });
  } else {
    // Handle the case where req.user or req.user._id is undefined
    res.status(500).json({ error: "User information not available" });
  }
});

app.delete("/api/user/favourites/:id", cors(corsOptions), (req, res) => {
  // Check if req.user is defined
  if (req.user && req.user._id) {
    userService
      .removeFavourite(req.user._id, req.params.id)
      .then((data) => {
        res.json(data);
      })
      .catch((msg) => {
        res.status(422).json({ error: msg });
      });
  } else {
    // Handle the case where req.user or req.user._id is undefined
    res.status(500).json({ error: "User information not available" });
  }
});

app.get("/api/user/history", cors(corsOptions), (req, res) => {
  // Check if req.user is defined
  if (req.user && req.user._id) {
    userService
      .getHistory(req.user._id)
      .then((data) => {
        res.json(data);
      })
      .catch((msg) => {
        res.status(422).json({ error: msg });
      });
  } else {
    // Handle the case where req.user or req.user._id is undefined
    res.status(500).json({ error: "User information not available" });
  }
});

app.put("/api/user/history/:id", cors(corsOptions), (req, res) => {
  // Check if req.user is defined
  if (req.user && req.user._id) {
    userService
      .addHistory(req.user._id, req.params.id)
      .then((data) => {
        res.json(data);
      })
      .catch((msg) => {
        res.status(422).json({ error: msg });
      });
  } else {
    // Handle the case where req.user or req.user._id is undefined
    res.status(500).json({ error: "User information not available" });
  }
});

app.delete("/api/user/history/:id", cors(corsOptions), (req, res) => {
  // Check if req.user is defined
  if (req.user && req.user._id) {
    userService
      .removeHistory(req.user._id, req.params.id)
      .then((data) => {
        res.json(data);
      })
      .catch((msg) => {
        res.status(422).json({ error: msg });
      });
  } else {
    // Handle the case where req.user or req.user._id is undefined
    res.status(500).json({ error: "User information not available" });
  }
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
