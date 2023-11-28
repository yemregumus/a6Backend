const express = require("express");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const cors = require("cors");
const dotenv = require("dotenv");
const userService = require("./user-service.js");

dotenv.config();

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Setup Passport with JwtStrategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(jwtOptions, (jwtPayload, done) => {
    // You can perform database queries here to check if the user exists, etc.
    // For simplicity, we'll assume the user is valid if the payload contains an ID.
    if (jwtPayload._id) {
      return done(null, { userId: jwtPayload._id });
    } else {
      return done(null, false);
    }
  })
);

app.use(express.json());
app.use(cors());
app.use(passport.initialize()); // Initialize Passport middleware

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
      // Assuming you have a user object to generate a token
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      res.json({ message: "login successful", token: token });
    })
    .catch((msg) => {
      res.status(422).json({ message: msg });
    });
});

// Routes protected with Passport middleware
app.get("/api/user/favourites", passport.authenticate("jwt", { session: false }), (req, res) => {
  userService
    .getFavourites(req.user.userId)
    .then((data) => {
      res.json(data);
    })
    .catch((msg) => {
      res.status(422).json({ error: msg });
    });
});

app.put("/api/user/favourites/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
  userService
    .addFavourite(req.user.userId, req.params.id)
    .then((data) => {
      res.json(data);
    })
    .catch((msg) => {
      res.status(422).json({ error: msg });
    });
});

// Delete a favorite by ID
app.delete("/api/user/favourites/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
  userService
    .removeFavourite(req.user.userId, req.params.id)
    .then((data) => {
      res.json(data);
    })
    .catch((msg) => {
      res.status(422).json({ error: msg });
    });
});

// Get user history
app.get("/api/user/history", passport.authenticate("jwt", { session: false }), (req, res) => {
  userService
    .getHistory(req.user.userId)
    .then((data) => {
      res.json(data);
    })
    .catch((msg) => {
      res.status(422).json({ error: msg });
    });
});

// Add an artwork to user history by ID
app.put("/api/user/history/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
  userService
    .addHistory(req.user.userId, req.params.id)
    .then((data) => {
      res.json(data);
    })
    .catch((msg) => {
      res.status(422).json({ error: msg });
    });
});

// Remove an artwork from user history by ID
app.delete("/api/user/history/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
  userService
    .removeHistory(req.user.userId, req.params.id)
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
    console.log("Unable to start the server: " + err);
    process.exit();
  });
