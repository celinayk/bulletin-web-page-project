var express = require('express');
var router = express.Router();
var connection = require('../database/connect/maria');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* GET select경로의 라우터 */ 
router.get('/select', (req, res) => {
  connection.query('SELECT * FROM board', (err, rows) => {
    if (err) {
      console.error('Error executing query: ', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(rows);
    }
  });
});

module.exports = router;
