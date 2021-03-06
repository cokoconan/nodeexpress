var express = require('express'),		// express 설정
	fs = require('fs'),			// 파일 시스템 모듈
	ejs = require('ejs'),		// ejs 템플릿 쓸꺼임!!!!!!!! html 로 넘겨주면, jsp 랑 문법이 같다고 함
	app = express(),			// app 에 express 를 받고,
	server = require('http').createServer(app),		// 서버를 만들고
	io = require('socket.io').listen(server),
	http = require('http');


//var router = express.Router();

var db_pool = require('../libs/db_pool');


server.listen(5004);	// 포트 설정


app.use("/js", express.static('../public/javascript/'));	 //js 경로
app.use("/css", express.static('../public/stylesheets/'));	// css 경로
app.use("/views/images", express.static('../public/images/'));	//이미지 경로






/* GET home page. */
app.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  	var listQuery = "SELECT * FROM USER ";		// 쿼리문작성
	getList(listQuery, res);		// list 부르는 함수 콜

});



function getList(getQuery, res){		// 함수
	
	fs.readFile('../views/index.ejs', 'utf8', function(error, data) {	//index.html 로 eds.render 해서 넘겨주는것.
		
		res.writeHead(200, {'Content-Type': 'text/html' });		//head 셋 하고,
		
 db_pool.acquire(function(err, db) {
		db.query(getQuery, function(err, rows){		// sql 붙어서 쿼리 불러오기


			if(err){
				console.log("MySQL Query Execution Failed...");
				console.log(err);
				rows = err;
			}
			db.destroy();		//접속 ㅂㅂ 하고
			
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
