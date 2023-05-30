const maria = require('mysql');

const connection = maria.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'yeonkyung',
    password: '20201207',
    database: 'bulletinboard'
});

/*
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MariaDB: ', err);
  } else {
    console.log('Connected to MariaDB');
  }
});
*/

module.exports = connection;