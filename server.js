const express = require("express");
const path = require("path");
const cors = require("cors");
const corsOptions = require("./configs/corsOptions.config");
const { logger } = require("./middeware/logEvents");
const errorHandler = require("./middeware/errorHandler");

const PORT = process.env.PORT || 3500;

const app = express();

// Middleware

// custom logger
app.use(logger);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// serve static files
app.use(express.static(path.join(__dirname, "/public")));

// routes
app.use("/", require("./routes/root.route"));

app.use("/employees", require("./routes/api/employees.route"));

// Route handlers
app.get(
  "/hello(.html)?",
  (req, res, next) => {
    console.log("attempted to load hello.html");
    next();
  },
  (req, res) => {
    res.send("Hello World!");
  },
);

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

app.listen(PORT, () => console.log(`[server] Server running on port ${PORT}`));
