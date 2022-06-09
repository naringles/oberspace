const express = require('express')            // express 모듈 가져옴
const mongoose = require('mongoose')          // mongoDB 연결
const bodyParser = require('body-parser')     // 클라 - 서버 통신
const cookieParser = require('cookie-parser') // 쿠키 저장
const { User } = require("./models/User")     // User 스키마
const config = require('./config/key')        // mongoURI 보안
const { auth } = require("./middleware/auth") // 로그인 인증
const app = express()                         // express 앱 만들기
const port = 5000                             // 포트 번호 (아무거나)

app.use(cookieParser());

// body-parser가 클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있게 하는 것
// application/x-www-form-urlencoded 타입 데이터
// application/json 타입 데이터
app.use(express.urlencoded({extended: true})); 
app.use(express.json());

// DB 연결 및 확인
mongoose.connect(config.mongoURI)
.then(() => console.log('== MongoDB Connected =='))
.catch(err => console.log(err))

// 회원가입을 위한 라우팅
app.post('/api/users/register', (req, res) => {
  // 회원가입 할 때 필요한 정보들 client에서 가져오면 
  // 해당 데이터를 데이터베이스에 넣어준다.
  // req.body안에는 json 형식으로 정보들이 들어있음(id, pw) (body-parser)
  const user = new User(req.body)

  // mongoDB 메소드, save해주면 Usermodel에 저장됨 
  user.save((err,userInfo) => { 
      if(err){
        console.log("회원가입 저장 에러 발생")
        return res.json({registerSuccess:false, err})
      }
      console.log("에러 없음, 성공 확인됨")
      //status(200)은 성공을 의미
      return res.status(200).json ({registerSuccess: true }) 
  })
})

// 로그인을 위한 라우팅
app.post('/api/users/login',(req,res) => {
    // 요청된 이메일을 데이터베이스에 있는지 찾기

    User.findOne({userid: req.body.userid}, (err, user) => {
      console.log("아이디 찾기 시작")
      if(!user) {
        return res.json({
          loginSuccess: false,
          message: "제공된 아이디에 해당하는 유저가 없습니다."
        })
      }
      console.log("제공된 아이디에 해당하는 아이디가 존재합니다.")
      // 요청한 아이디가 데이터베이스에 있다면 비밀번호 맞는지 확인
      user.comparePassword(req.body.password, (err, isMatch) => {
        if(!isMatch)
          return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."})
        else
          console.log("비밀번호가 일치합니다.")
        // 토큰 생성하기
        user.generateToken((err, user) => {
          //jsonwebtoken 활용
          if(err) return res.status(400).send(err);
          // 쿠키에 토큰을 저장한다. token 사용.
          // 1분을 1000으로 계산해서, 곱셈으로 입력해주면 됨.
          // Date.now()는 현재시간을 UTC 기준으로 정해지며, 쿠키에 저장될때도 한국시간으로 저장되는것이 아니니,
          // 이 부분은 참고할것.
          res.cookie("Oberspace_Access", user.token, {
            expires: new Date(Date.now() + 1800000),    // 30분 저장
            httpOnly: true                              // XSS 공격 대처방안.
          })
          .status(200)
          .json({ loginSuccess: true, userId: user._id })
        })
      })
    })
  })

// 인증 라우팅
// role 1 어드민
// role 0 일반유저, 기본은 일반유저인 0로 저장된다.
// 어드민 계정이 필요하면 따로 DB에 추가하는 방식을 사용할것..
// 이 부분에서 자동 로그인이 시작된다.
app.get('/api/users/auth', auth, (req, res) => {  // 미들웨어 (엔드포인트에 req받기 전에 중간에서 별도로 해주는 것)
  // 여기까지 왔다는 얘기는 Authentication이 true라는 말
  // 이 미들웨어는 client/components/App.js를 시작으로,
  // 2) hoc/auth.js,
  // 3) _action/user_actions.js,
  // 4) _reducers/user_reducer.js,
  // 5) 여기,
  // 6) _reducers/types.js,
  // 7) _reducers/user_reducer.js,
  // 8) 각 views에 맞는 페이지,
  // 순으로 이동하니 에러가 난다면 이 부분들을 살펴볼것.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    userid: req.user.userid,
    email: req.user.email,
    username: req.user.username,
    role: req.user.role
  })
})

// 로그아웃 라우팅
app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id},
    { token: ""},
    (err, user) => {
      if(err) return res.json({success: false, err});
      return res.status(200).send({
        success: true
      })
    })
})


app.get('/', (req, res) => {             // 루트 디렉토리 오면 hello~ 출력
  res.send('Hello World!')
})

app.listen(port, () => {                 // 5000번에서 서버 실행
  console.log(`Server is listening on port ${port}`)
})

// LandingPage에서 보내준 /api/hello를 받았다면, "안녕하세요"를 응답.
app.get('/api/hello', (req, res) => {
  res.send("안녕하세요")
})
