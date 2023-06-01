var express = require('express');
const { rawListeners } = require('../app');
var router = express.Router();
var connection = require('../database/connect/maria');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* GET select경로의 라우터 */ 
router.get('/select', (req, res) => {
  connection.query('SELECT * FROM reply', (err, rows) => {
    if (err) {
      console.error('Error executing query: ', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(rows);
    } 
  });
});


/* GET 게시물 목록 조회, list로만 라우팅되었을때 1로보냄*/
router.get('/list', function(req, res, next) {
  res.redirect('/list/1');
});


/* GET 게시물 목록 조회 */
router.get('/list/:page', function(req, res, next) {
  console.log("메인화면, 게시물 목록 조회");
  var page = req.params.page; //:page로 맵핑할 req값 가져옴
  var sql = "SELECT board_id, title, content, writer, date_format(regdate,'%Y-%m-%d %H:%i:%s') regdate, viewcnt from board ";
  connection.query(sql, function(err, rows) {
    //select쿼리문 날린 데이터를 rows변수에 담는다 
    if(err) {
      console.log("err : " + err);
    }
    res.render('index.ejs', {title : '글목록', rows:rows, page:page, length:rows.length-1, page_num:10, pass:true});
    console.log(rows.length-1);
  });
}); 




/* GET 게시물 상세 조회  */
router.get('/read/:board_id', function(req, res, next) {
  console.log("게시물 상세 조회");
  var board_id = req.params.board_id; //id로 맵핑할 req값 가져옴 
  var sql = "SELECT * FROM board where board_id=?";
  connection.query(sql, [board_id], function(err, rows) {
    if(err) {
      console.log("err : " + err);
    }
    res.render('read.ejs', {title : '글 상세 조회', rows:rows[0]});
  });
});


/* GET 글쓰기 페이지로 이동 */
router.get('/write', function(req, res, next) {
  res.render('write.ejs', {title : "게시판 글쓰기"})
});

/* 글쓰기 누르면 그 정보를 디비에 저장하는 역할? */
router.post('/write', function(req, res, next) {
  //var board_id = req.body.board_id;
  var title = req.body.title;
  var writer = req.body.writer;
  var content = req.body.content;
  var datas = [writer,title, content];//모든 데이터 배열로 묶음
  //req객체로 body속성에서 input 파라미터 가져오기
  var sql = "insert into board(writer, title, content, regdate) values(?,?,?, now())";
  connection.query(sql, datas, function(err, rows) {
    if(err) {
      console.log("err : " + err);
    }
    res.redirect('/list')
  });
});

/* 삭제 */
router.post('/delete', function(req, res, next) {
  var board_id = req.body.board_id;

  console.log(req.body.board_id); // 추가된 코드

  var sql="delete from board where board_id= ?";
  connection.query(sql, board_id, function(err, result) {
    if (err) {
      console.log(err);
      throw err; // 예외 처리를 위해 오류를 다시 던집니다.
    }
    if (result.affectedRows === 0) {
      res.send("<script>alert('일치하는 게시글이 없습니다.');history.back();</script>");
    }
    else {
      res.redirect('/list');
    }
  });
});

module.exports = router;
