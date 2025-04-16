require("dotenv").config();
require("./models/connection");

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors"); // <-- TRÈS IMPORTANT : avant tout

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const ordersRouter = require("./routes/orders");

const app = express();

// 💥 GESTION CORS COMPLÈTE
const allowedOrigins = [
  "https://lafabrique-frontend.vercel.app",
  "http://localhost:3001",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Autorise les appels sans origine (comme Postman ou les tests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "The CORS policy does not allow access from this origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Middlewares Express
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/orders", ordersRouter);

module.exports = app;