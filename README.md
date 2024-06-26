# 게시판 웹 페이지 구축

기능
|No|기능명|내용 및 조건|
|------|---|---|
|1|전체 게시글 조회|- 한 페이지에 모든 게시글을 조회하지 않고, N개 단위로 나누어 페이징(SQL 구현)한다. 내용/댓글을 제외한 모든 내용을 리스트로 확인 가능하다.|
|2|게시글 상세 조회|- 모든 내용과 댓글을 조회한다.|
|3|게시글 작성|- 작성자, 제목, 내용, 작성일자, 고유 번호가 포함되어야 한다.|
|4|게시글 삭제|- 게시글은 삭제 가능하다. - 게시글을 삭제하는 경우 댓글도 같이 삭제되어야 한다.|
|5|댓글 작성|- 게시글에 대한 댓글을 작성할 수 있다. - 댓글에 대한 댓글 기능은 제공하지 않는다. - 댓글에는 작성자, 시간, 내용이 포함된다.|
|6|댓글 삭제|- 댓글은 삭제 가능하다.|
|7|조회수|- 클릭할때 마다 조회수가 증가한다.|

동작
![Animation](https://github.com/celinayk/bulletin-web-page-project/assets/80758099/4593a8e4-19e7-4d77-b505-0390ce6d808c)


개발 환경 조건
RDBMS: MariaDB
Frontend: HTML / Web Framework(사용 가능)
Backend: node.js
node.js 내에서 SQL을 구현할 것(native한 SQL 사용)

ERD
![스크린샷(246)](https://github.com/celinayk/bulletin-web-page-project/assets/80758099/59918c52-8d49-40da-bbca-e69679b6adf2)
  
