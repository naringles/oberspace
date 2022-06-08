const { User } = require('../models/User');

let auth = (req,res,next) => {
  //인증처리
  //클라이언트 쿠키에서 토큰을 가져옴
  let token = req.cookies.Oberspace_Access;
  //토큰을 복호화 한 후 유저를 찾는다
  User.findByToken(token, (err, user) => {
    if(err) throw err;
    //유저가 없으면 인증 NO
    if(!user) return res.json({ isAuth: false, error: true})
    //유저가 있으면 인증 OK
    req.token = token;   // request에 넣어주는이유: index.js에서 token과 user 사용하기 위해
    req.user = user;
    next()               // index.js 미들웨어에서 다음으로 넘어갈 수 있도록
  })
}
module.exports = { auth }; 