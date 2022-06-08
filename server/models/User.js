const mongoose = require('mongoose');    // mongoose 연결
const bcrypt = require('bcrypt')
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema( {    // 스키마 세팅
  userid:  {
    type: String,  
    maxlength: 50,
    trim: true,
    unique: 1,
  },
  email: {
    type: String,
    trim: true,               // 공백 제거
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5
  },
  passwordcheck: {
    type: String,
    minlength: 5
  },
  username:  {
    type: String,  
    maxlength: 50
  },
  role: {                      //가입자(디폴트, 0), 관리자
    type: Number, 
    default: 0
  },
  token: {                     // 토큰 설정 (나중에 유효성 관리 가능)
    type: String
  },
  tokenExp: {                  // 토큰 유효기간
    type: Number
  }
})

// DB에 저장할때 비밀번호 암호화
userSchema.pre('save', function(next) {
    //비밀번호 암호화
    var user = this;
    if(user.isModified('password')) {  // pw변경시에만 해쉬값 넣도록
      bcrypt.genSalt(saltRounds, function(err, salt) {
        if(err) return next(err) //에러나오면 index로
        bcrypt.hash(user.password, salt, function(err, hash) {
          // Store hash in your password DB.
          if(err) return next(err)
          user.password = hash
          next()  // hash값 저장했으면 index로
        });
      });
    } else {
      next()
    }
  })

// 비밀번호 확인
userSchema.methods.comparePassword = function(plainPassword, cb) {
// plainPassword 1234567 일 때 암호화된 비밀번호(해쉬값) 비교
console.log("비밀번호 비교 중")
bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
    if(err) {
      console.log("비밀번호가 틀립니다.")
      return cb(err)
    }
    console.log("비밀번호 비교 중 에러가 존재하지 않습니다.")
    cb(null, isMatch)
})
}

// 토큰 생성
userSchema.methods.generateToken = function(cb) {
  console.log("토큰을 생성합니다.")
  var user = this; // ES5문법
  //jsonwebtoken이용해서 token생성
  var token = jwt.sign(user._id.toHexString(), 'secretToken') 
  //user._id + 'secretToken' = token
  //_id는 데이터베이스에 저장된 id값
  // -> 'secretToken' -> user_.id 확인가능
  user.token = token
  user.save(function(err, user) {
    if(err) return cb(err)
    cb(null, user)
  })
}
  
// 인증
userSchema.statics.findByToken = function(token, cb) { // jsonwebtoken usage
  var user = this;
  //토큰을 decode
  jwt.verify(token, 'secretToken', function(err, decoded) {
    //유저 아이디를 이용해서 유저를 찾은 다음에
    //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
    user.findOne({"_id": decoded, "token": token}, function (err, user) {
      if (err) return cb(err);
      cb(null, user)
    })
  })    
}

// 로그아웃
userSchema.statics.findByToken = function(token, cb) { // jsonwebtoken usage
  var user = this;
  //토큰을 decode
  jwt.verify(token, 'secretToken', function(err, decoded) {
    //유저 아이디를 이용해서 유저를 찾은 다음에
    //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
    user.findOne({"_id": decoded, "token": token}, function (err, user) {
      if (err) return cb(err);
      cb(null, user)
    })
  })    
}

const User = mongoose.model('User', userSchema)  // 모델
module.exports = { User }                        // export