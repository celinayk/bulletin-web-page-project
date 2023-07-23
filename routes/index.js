var express = require('express');
//const { rawListeners } = require('../app');
var router = express.Router();
var connection = require('../database/connect/maria');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('get요청이 발생했습니다');
  res.render('main.ejs', { title: 'Express' });
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
  var board_id = req.params.board_id; // id로 맵핑할 req값 가져옴 
  var sql = "SELECT * FROM board where board_id=?";
  var reply_sql = "SELECT * FROM reply WHERE board_id=?"; // 댓글 조회를 위한 쿼리문 추가
  
  // 조회수 증가
  var updateViewsSql = "UPDATE board SET viewcnt = viewcnt + 1 WHERE board_id = ?";
  connection.query(updateViewsSql, [board_id], function(err, result) {
    if (err) {
      console.log("조회수 업데이트 오류: " + err);
    }

    // 게시물 상세 조회 
    connection.query(sql, [board_id], function(err, rows) {
      if (err) {
        console.log("err : " + err);
      }

      connection.query(reply_sql, [board_id], function(err, replyRows) {
        if (err) {
          console.log("err임 : " + err);
        } else {
          res.render('read.ejs', { title: '글 상세 조회', rows: rows[0], replies: replyRows });
          //console.log("댓글 목록:", replyRows);
        }
      });
    });
  });
});


/* POST 댓글 작성 */
router.post('/read/:board_id', function(req, res, next) {
  var board_id = req.params.board_id;
  var reply_writer = req.body.reply_writer;
  var reply_content = req.body.reply_content;

  if (!reply_writer || !reply_content) {
    console.log("작성자와 내용을 입력해주세요.");
    res.redirect('/read/' + board_id);
    return;
  }

  var sql = "INSERT INTO reply (board_id, reply_writer, reply_content, reply_regdate) VALUES (?, ?, ?, NOW())";
  var values = [board_id, reply_writer, reply_content];

  connection.query(sql, values, function(err, result) {
    if (err) {
      console.log("err : " + err);
    }

    
    res.redirect('/read/' + board_id); // 게시물 상세 조회 페이지로 리디렉션
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


router.post('/delete', function(req, res, next) {
  var board_id = req.body.board_id;

  // 댓글 삭제
  var deleteReplySql = "DELETE FROM reply WHERE board_id=?";
  connection.query(deleteReplySql, [parseInt(board_id)], function(err, result) {
    if (err) {
      console.log("댓글 삭제 오류: " + err);
      res.redirect('/list');
      return;
    }

    // 게시글 삭제!!
    var deleteBoardSql = "DELETE FROM board WHERE board_id=?";
    connection.query(deleteBoardSql, [parseInt(board_id)], function(err, result) {
      if (err) {
        console.log("게시물 삭제 오류: " + err);
        res.redirect('/list');
        return;
      }
      res.redirect('/list');
    });
  });
});





/* 댓글 삭제 */
router.post('/deleteReply', function(req, res, next) {
  var reply_id = req.body.reply_id;

  var selectReplySql = "SELECT * FROM reply WHERE reply_id=?";
  connection.query(selectReplySql, [reply_id], function(err, rows) {
    if (err) {
      console.log("댓글 조회 오류: " + err);
      res.redirect('/list');
      return;
    }

    if (rows.length === 0) {
      console.log("해당 댓글이 존재하지 않습니다.");
      res.redirect('/list');
      return;
    }

    var deleteReplySql = "DELETE FROM reply WHERE reply_id=?";
    connection.query(deleteReplySql, [reply_id], function(err, result) {
      if (err) {
        console.log("댓글 삭제 오류: " + err);
        console.log("reply_id: ", reply_id); // reply_id 값 출력
        res.redirect('/list');
        return;
      }
      // 댓글이 삭제되면 해당 게시물 상세 조회 페이지로 리디렉트
      console.log("삭제된 댓글 ID: " + rows[0].reply_id);
      console.log("삭제된 댓글 내용: " + rows[0].reply_content);
      var board_id = rows[0].board_id;
      res.redirect('/read/' + board_id);
    });
  });
});




module.exports = router;
