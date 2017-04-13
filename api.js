var express = require('express')
  , cors = require('cors')
  , app = express();
 
app.use(cors());

var request = require('request')  // Adding the request library (to make HTTP reqeusts from the server)

var app = express(); // initializing applicaiton

var request = require('request'); // Adding the request library (to make HTTP requests from the server)

var bodyParser = require('body-parser'); // Parser to gain access to request body

app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded 

app.use(bodyParser.json()); // support json encoded bodies

var sqlite3 = require('sqlite3').verbose(); //add the sqlite library
var db = new sqlite3.Database('pager.db'); //initialize the database pager.db

// POST request that creates a table if non existend and insert JSON file in that table.
app.post('/blog', function(req, res){

	var slug = req.body.slug;
	var title = req.body.title;
	var content = req.body.content;

	console.log(slug);
	console.log(title);
	console.log(content);

	db.serialize(function() {

		db.run("CREATE TABLE IF NOT EXISTS data (\
			slug varchar(255),\
			title varchar(255),\
			content varchar(100000))");

		db.run("INSERT INTO data "+
			"(slug, title, content) " +
			"VALUES (?,?,?)",
			slug,
			title,
			content);
	});

	res.json({"title": title})
});

//GET request that retreives data from the table data with a certain slug value
app.get('/blog', function(req ,res){
	console.log(req.query.slug);
	db.each("SELECT * FROM data WHERE slug = '"+req.query.slug+"'", function(err, row){
		res.json({'slug': row.slug,
					'title': row.title,
					'content' : row.content});
	});
});

//initiate the server with node
var server = app.listen(3001, function() {
	console.log('Server on localhost listening on port 3001');
});

