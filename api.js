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
var db = new sqlite3.Database('content.db'); //initialize the database pager.db

// POST request that creates a table if non existend and insert JSON file in that table.
app.post('/model', function(req, res){

	var slug = req.body.slug;
	var title = req.body.title;
	var content = req.body.content;
	var author = req.body.author;
	var intro = req.body.intro;
	var youtube = req.body.youtube;
	var email = req.body.email;
	var extra = req.body.extra;
	var other = req.body.other;//Create extra an other if required

	console.log(slug);
	console.log(title);
	console.log(youtube);

	db.serialize(function() {

		db.run("CREATE TABLE IF NOT EXISTS data (" +
			"id INTEGER PRIMARY KEY AUTOINCREMENT," +
			"time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP," +
			"slug varchar(255)," +
			"title varchar(255)," +
			"author varchar (255)," +
			"intro varchar(255)," +
			"category varchar (255)," +
			"content varchar(10000000)," +
			"youtube varchar (255)," +
			"email varchar (255)," +
			"extra varchar (10000)," +
			"other varchar (255))");
		console.log("table has been created");

		db.run("INSERT INTO data "+
			"(slug, title, author, intro, category, content, youtube, email, extra, other)" +
			"VALUES (?,?,?,?,?,?,?,?,?,?)",
			slug,
			title,
			author,
			intro,
			content,
			youtube,
			email,
			extra,
			other);
	});

	res.json({"title": title})
});

//GET request that retreives data from the table data with a certain slug value
app.get('/model', function(req ,res){
	console.log(req.query.slug);
	db.each("SELECT * FROM data WHERE slug = '"+req.query.slug+"'", function(err, row){
		
		if (row.youtube !== null){
			var youslug = '"'+"https://www.youtube.com/embed/"+row.youtube+'"';
			var youhtml = "<iframe width="+'"'+"420"+'"'+" height="+'"'+"315"+'"'+" src ="+youslug+"></iframe>";
			console.log("youtube is not null")	
				} else {
			var youhtml = " ";
			console.log("youtube is null")
		};

		console.log(youhtml);

		res.json({'slug': row.slug,
					'title': row.title,
					'content' : row.content,
					'author' : row.author,
					'time' : row.time,
					'intro' : row.intro,
					'youtube' : youhtml,
					'email' : row.email,
					'extra' : row.extra});
	});
});

//initiate the server with node
var server = app.listen(3001, function() {
	console.log('API server on localhost listening on port 3001');
});

