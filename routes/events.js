var express = require('express');
var router = express.Router();

/* GET events listing. */
router.get('/', function(req, res) {
  var mysql = require('mysql');
  var connection = mysql.createConnection({
    host: process.env.REACT_APP_DATA_HOST,
    user: process.env.REACT_APP_DATA_USER,
    password: process.env.REACT_APP_DATA_PASSWORD,
    database: process.env.REACT_APP_DATA_DATABASE
  })

  connection.connect();
  connection.query(process.env.REACT_APP_DATA_QUERY_EVENTS, function (err, rows) {
    if (err) res.json(err)
    res.json(rows);
  })
});

module.exports = router;
