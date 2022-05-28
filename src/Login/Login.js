import React, {useState,Component} from 'react';
import './Login.css';
import { AiFillLock,AiOutlineUser} from "react-icons/ai";
import {Route, Link} from 'react-router-dom';

//+회원가입 밑줄 없애기

class Login extends Component {
render() {
  return (
    <div className="App">
      <div className="obserSpace">
      <img className='L1'
          src={require('../LogoImage.jpeg')}
      />
      </div>

      <div>
        <div className="layoutId">
          <AiOutlineUser size="40" color='gray' className='IconId'/></div>
        <input type="text" className="loginId" placeholder="  아이디"></input>
      </div>

      <div>
        <div className="layoutPw">
          <AiFillLock size="40" color="gray" className='IconPw'/></div>
        <input type="password" className="loginPw" placeholder='  비밀번호'></input>
      </div>
      
      <Link to = "/">
          <input type="submit" className="login" value="로그인"></input>
      </Link>
      <div className="join1">
           <Link to = "/SignUp">
             <a className='App-link'>+ 회원가입</a>
          </Link>
        
      </div>
     </div>
  );
};
}
export default Login;
