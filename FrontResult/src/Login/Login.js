import React, {useState,Component} from 'react';
import './Login.css';
import { AiFillLock,AiOutlineUser} from "react-icons/ai";

class Login extends Component {
render() {
  return (
    <div className="App">
      <div className="obserSpace">
      <img className='L'
          src={require('../LogoImage.jpeg')}
      />
      </div>

      <div>
        <div className="iconId"><AiOutlineUser size="40" color="gray"/></div>
        <input type="text" className="loginId" placeholder='  아이디'></input>
      </div>

      <div>
        <div className="iconPw"><AiFillLock size="40" color="gray"/></div>
        <input type="password" className="loginPw" placeholder='  비밀번호'></input>
      </div>

      <input type="submit" className="login" value="로그인"></input>

      <div className="join1">
        <p> + 회원가입 </p>
      </div>
     </div>
  );
};
}
export default Login;
