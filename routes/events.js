var express = require('express');
var router = express.Router();

/* GET events listing. */
router.get('/', function(req, res, next) {
  var mysql = require('mysql');
  var connection = mysql.createConnection({
    host: process.env.REACT_APP_DATA_HOST,
    user: process.env.REACT_APP_DATA_USER,
    password: process.env.REACT_APP_DATA_PASSWORD,
    database: process.env.REACT_APP_DATA_DATABASE
  })

  connection.connect();
  connection.query(process.env.REACT_APP_DATA_QUERY, function (err, rows, fields) {
    if (err) res.json(err)
    res.json(rows);
  })
});

module.exports = router;
