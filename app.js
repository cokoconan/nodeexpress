var  express = require('express'),	
	fs = require('fs'),			
	ejs = require('ejs'),		
	app = express(),			
	server = require('http').createServer(app),		
	io = require('socket.io').listen(server),
	http = require('http');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//var routes = require('./routes/index');
//var users = require('/routes/users');

var app = express();
var db_pool = require(__dirname + '/libs/db_pool');
//var router = express.Router();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(require('stylus').middleware(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
//app.use('/users', users);


app.use("/js", express.static('../public/javascript/'));	
app.use("/css", express.static('../public/stylesheets/'));	
app.use("/views/images", express.static('../public/images/'));	



server.listen(5004);





app.get('/userlist', function(req, res) {
  	var listQuery = "SELECT * FROM USER ";		
	getList(listQuery, '/views/index.ejs');		
});

app.get('/finduser/:name', function(req, res) {
  	var listQuery = "SELECT * FROM USER WHERE name like '%"+name +"%'" ;		
	getList(listQuery, res , '/views/index.ejs');		
});



function getList(getQuery, res, viewejs){		
	
	fs.readFile(__dirname + viewejs , 'utf8', function(error, data) {
		
		res.writeHead(200, {'Content-Type': 'text/html' });		
		
 db_pool.acquire(function(err, db) {
		db.query(getQuery, function(err, rows){		

			if(err){
				console.log("MySQL Query Execution Failed...");
				console.log(err);
				rows = err;
			}
			db.destroy();		
			
			console.log("==============================");
			console.log( data );
			console.log(rows[3].name);
			console.log("==============================");

			res.end(ejs.render( data , {
				'rows': rows 
			}));
});

		});
	});		
};







// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


//module.exports = app;
