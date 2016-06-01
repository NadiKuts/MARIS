var express = require('express');
var router = express.Router();


router.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,POST,PUT,DELETE');
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    if ('OPTIONS' == req.method){
        return res.send(200);
    }
    next();
});
 //router.listen(3000);
var pg = require('pg');
var connectionString = "pg://postgres:123@130.89.221.193:5432/statictables";

router.get('/api/v1/statictables', function(req, res) {
    var results = [];
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }
        // SQL Query > Select Data
        var query = client.query("SELECT * FROM animalsfood;");
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });
		//print res.json(results);
        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });
});

module.exports = router;

/* GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/



