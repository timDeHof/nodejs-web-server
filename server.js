require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const corsOptions = require("./configs/corsOptions.config");
const { logger } = require("./middeware/logEvents");
const errorHandler = require("./middeware/errorHandler");
const verifyJWT = require("./middeware/veriftyJWT");
const credentials = require("./middeware/credentials");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const connectDB = require("./configs/dbConn");
const PORT = process.env.PORT || 3500;

// connect to db
connectDB();

const app = express();

// custom logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// serve static files
app.use(express.static(path.join(__dirname, "/public")));

// routes
app.use("/", require("./routes/root.route"));
app.use("/register", require("./routes/register.route"));
app.use("/auth", require("./routes/auth.route"));
app.use("/refresh", require("./routes/refresh.route"));
app.use("/logout", require("./routes/logout.route"));

app.get(
  "/hello(.html)?",
  (req, res, next) => {
    console.log("attempted to load hello.html");
    next();
  },
  (req, res) => {
    res.json({ message: "Hello World!" });
  },
);
app.use(verifyJWT);
app.use("/employees", require("./routes/api/employees.route"));

// Route handlers

// app.use('/')
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () =>
    console.log(`[server] Server running on port ${PORT}`),
  );
});
