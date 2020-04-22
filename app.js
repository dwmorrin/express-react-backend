require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.REACT_APP_COOKIE_SECRET));

const createConnection = () => {
  return require("mysql").createConnection({
    host: process.env.REACT_APP_DATA_HOST,
    user: process.env.REACT_APP_DATA_USER,
    password: process.env.REACT_APP_DATA_PASSWORD,
    database: process.env.REACT_APP_DATA_DATABASE,
  });
};

app.get("/api/:data", (req, res) => {
  const query = `REACT_APP_DATA_GET_${req.params.data.toUpperCase()}`;
  createConnection().query(process.env[query], (err, rows) => {
    if (err) res.json(err);
    res.json(rows);
  });
});

app.post("/api/:data", (req, res) => {
  console.log("cookies", req.cookies);
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
        const mockUUID = Math.random().toString().slice(2);
        res.cookie("id", mockUUID, {
          maxAge: 1000 * 60 * 15,
          httpOnly: true,
          signed: true,
        });
        res.json(rows);
      }
    );
  }
});

// catch 404 and forward to error handler
app.use((_, __, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
