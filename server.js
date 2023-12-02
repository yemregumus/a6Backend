const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const cors = require("cors");
const dotenv = require("dotenv");
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
  new JwtStrategy(jwtOptions, (jwtPayload, next) => {
    if (jwtPayload) {
      next(null, {
        _id: jwtPayload._id,
        userName: jwtPayload.userName,
      });
    } else next(null, false);
  })
);

const corsOptions = {
  origin: ["https://sparkling-jersey-bull.cyclic.app", "http://localhost:3000", "https://assignment6yeg.netlify.app/"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // include credentials
  optionsSuccessStatus: 204,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(passport.initialize());

// Middleware for routes requiring authentication
const authenticateJWT = passport.authenticate("jwt", { session: false });

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
      const token = jwt.sign({ _id: user._id, userName: user.userName }, process.env.JWT_SECRET);
      res.json({ message: "login successful", token: token });
    })
    .catch((error) => {
      res.status(422).json({ message: "Login failed", error: error.message });
    });
});

app.get("/", cors(corsOptions), (req, res) => {
  res.send("Server is live!");
});

app.get("/api/user/favourites", cors(corsOptions), authenticateJWT, (req, res) => {
  userService
    .getFavourites(req.user._id)
    .then((data) => {
      res.json(data);
    })
    .catch((msg) => {
      res.status(422).json({ error: msg });
    });
});

app.put("/api/user/favourites/:id", cors(corsOptions), authenticateJWT, (req, res) => {
  userService
    .addFavourite(req.user._id, req.params.id)
    .then((data) => {
      res.json(data);
    })
    .catch((msg) => {
      res.status(422).json({ error: msg });
    });
});

app.delete("/api/user/favourites/:id", cors(corsOptions), authenticateJWT, (req, res) => {
  userService
    .removeFavourite(req.user._id, req.params.id)
    .then((data) => {
      res.json(data);
    })
    .catch((msg) => {
      res.status(422).json({ error: msg });
    });
});

app.get("/api/user/history", cors(corsOptions), authenticateJWT, (req, res) => {
  userService
    .getHistory(req.user._id)
    .then((data) => {
      res.json(data);
    })
    .catch((msg) => {
      res.status(422).json({ error: msg });
    });
});

app.put("/api/user/history/:id", cors(corsOptions), authenticateJWT, (req, res) => {
  userService
    .addHistory(req.user._id, req.params.id)
    .then((data) => {
      res.json(data);
    })
    .catch((msg) => {
      res.status(422).json({ error: msg });
    });
});

app.delete("/api/user/history/:id", cors(corsOptions), authenticateJWT, (req, res) => {
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
