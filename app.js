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
    res.clearCookie("connect.sid").send();
    return;
  }
  if (req.params.data === "login") {
    const { username, password } = req.body;
    const key = "REACT_APP_DATA_POST_LOGIN";
    createConnection().query(
      process.env[key],
      [username, password],
      (err, rows) => {
        if (err) {
          res.json(err);
          return;
        }
        const user = rows[0];
        req.session.userId = user.id; /* auth for session */
        res.json(user);
      }
    );
  }
});

app.get("/api/:data/:id?", (req, res) => {
  if (!req.session.userId) {
    res.json({ error: { message: "you are not logged in" } });
    return;
  }
  const query = `REACT_APP_DATA_GET_${req.params.data.toUpperCase()}${
    req.params.id ? "_BY_ID" : ""
  }`;
  const id = req.params.id ? [req.params.id] : [];
  createConnection().query(process.env[query], id, (err, rows) => {
    if (err) res.json(err);
    res.json(rows);
  });
});

// error handler
// TODO currently just logging for development; make real handlers for production
app.use((req) => {
  if (!req.session) {
    console.error("no session found. please log in.");
    return;
  }
  console.error(`couldn't handle request for ${req.path}`);
});

module.exports = app;
