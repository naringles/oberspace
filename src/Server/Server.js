// express 모듈 ; npm install express후 실행 해야함
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;

// http://localhost:4000/ 으로 접속 시 응답메시지 출력
app.get('/', (req,res) => {
    res.send('Server Success');
})

app.listen(PORT, () => {
    console.log(`Server run : http://localhost:${PORT}/`)
})