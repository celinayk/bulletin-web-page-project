const maria = require('mysql');

const conn = maria.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'yeonkyung',
    password: '20201207',
    database: 'bulletinboard'
});


module.exports = conn;