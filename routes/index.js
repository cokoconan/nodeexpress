var express = require('express'),		// express ����
	fs = require('fs'),			// ���� �ý��� ���
	ejs = require('ejs'),		// ejs ���ø� ������!!!!!!!! html �� �Ѱ��ָ�, jsp �� ������ ���ٰ� ��
	app = express(),			// app �� express �� �ް�,
	server = require('http').createServer(app),		// ������ �����
	io = require('socket.io').listen(server),
	http = require('http');


//var router = express.Router();

var db_pool = require('../libs/db_pool');


server.listen(5004);	// ��Ʈ ����


app.use("/js", express.static('../public/javascript/'));	 //js ���
app.use("/css", express.static('../public/stylesheets/'));	// css ���
app.use("/views/images", express.static('../public/images/'));	//�̹��� ���






/* GET home page. */
app.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  	var listQuery = "SELECT * FROM USER ";		// �������ۼ�
	getList(listQuery, res);		// list �θ��� �Լ� ��

});



function getList(getQuery, res){		// �Լ�
	
	fs.readFile('../views/index.ejs', 'utf8', function(error, data) {	//index.html �� eds.render �ؼ� �Ѱ��ִ°�.
		
		res.writeHead(200, {'Content-Type': 'text/html' });		//head �� �ϰ�,
		
 db_pool.acquire(function(err, db) {
		db.query(getQuery, function(err, rows){		// sql �پ ���� �ҷ�����


			if(err){
				console.log("MySQL Query Execution Failed...");
				console.log(err);
				rows = err;
			}
			db.destroy();		//���� ���� �ϰ�
			
			console.log("==============================");
			console.log('../views/index.ejs' );
			console.log("==============================");
			//console.log( data );
			console.log(rows[3].name);
			console.log("==============================");

			res.end(ejs.render( data , {
				'rows': rows
			}));
});

		});
	});		
};



//module.exports = app;