const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
dotenvExpand(dotenv.config());

// const createError = require("http-errors");
const express = require("express");
const session = require("express-session");
const logger = require("morgan");
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.REACT_APP_COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

const createConnection = () => {
  return require("mysql").createConnection({
    host: process.env.REACT_APP_DATA_HOST,
    user: process.env.REACT_APP_DATA_USER,
    password: process.env.REACT_APP_DATA_PASSWORD,
    database: process.env.REACT_APP_DATA_DATABASE,
  });
};

app.post("/api/:data", (req, res) => {
  if (req.params.data === "logout") {
    req.session.destroy();
    return res.clearCookie("connect.sid").send();
  }
  if (req.params.data === "login") {
    const { username, password } = req.body;
    const key = "REACT_APP_DATA_POST_LOGIN";
    const connection = createConnection();
    connection.query(process.env[key], [username, password], (err, rows) => {
      if (err) {
        res.json(err);
        return;
      }
      const user = rows[0];
      req.session.userId = user.id; /* auth for session */
      res.json(user);
    });
    connection.end();
  }
});

app.get("/api/:data/:id?", (req, res) => {
  if (!req.session.userId) {
    return res.status(403).send("not logged in");
  }
  const query = `REACT_APP_DATA_GET_${req.params.data.toUpperCase()}${
    req.params.id ? "_BY_ID" : ""
  }`;
  const id = req.params.id ? [req.params.id] : [];
  const connection = createConnection();
  connection.query(process.env[query], id, (err, rows) => {
    if (err) res.json(err);
    res.json(rows);
  });
  connection.end();
});

// error handler
// TODO currently just logging for development; make real handlers for production
app.use((req, res) => {
  if (!req.session) {
    return res.status(403).send("forbidden");
  }
  return res.status(404).send("not found");
});

module.exports = app;
