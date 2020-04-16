var express = require('express');
var router = express.Router();

router.get('/', function (_, res) {
  res.json({id: 1})
});

module.exports = router;