import React, {useState,Component} from 'react';
import './F_Login.css';
import { AiFillLock,AiOutlineUser} from "react-icons/ai";
import {Route, Link} from 'react-router-dom';

//+회원가입 밑줄 없애기

class F_Login extends Component {
render() {
  return (
    <div className="App">
      <div className="obserSpace">
      <img className='L'
          src={require('../LogoImage.jpeg')}
      />
      </div>

      <Link to = "/Login">
         <input type="submit" className="login2" value="로그인"></input>
      </Link>
      
      <div className="join2">
           <Link to = "/SignUp">
             <a className='App-link'>+ 회원가입</a>
          </Link>
        
      </div>
     </div>
  );
};
}
export default F_Login;