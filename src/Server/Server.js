// express 모듈 ; npm install express후 실행 해야함
const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 4000;


const connection = mysql.createConnection({
    host : 'oberspacedb.cq9exfcv1cnv.ap-northeast-2.rds.amazonaws.com',
    user : 'oberspace',
    password : 'soft9280',
    database : 'sys',

});

connection.connect();

connection.query('SELECT * from table',(error,rows,fields) =>{
    if(error) throw error;
    res.send('User info is: ',rows);
})
// http://localhost:4000 으로 접속 시 응답메시지 출력
app.get('/', (req,res) => {
    res.send('Server Success');
})

app.listen(PORT, () => {
    console.log(`Server run : http://localhost:${PORT}/`)
})