import React, { useState } from 'react';
import './Login.css';
import { AiFillLock,AiOutlineUser} from "react-icons/ai";
import {Link} from 'react-router-dom';
import swal from "sweetalert"

import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';

function Login(){
{
  
	const dispatch = useDispatch();

  const [userid,setuserid] = useState("");
  const [password,setpassword] = useState("");

  const onUseridHandler = (event) =>{
    setuserid(event.currentTarget.value)
  }
  const onUserpasswordHandler = (event) =>{
    setpassword(event.currentTarget.value)
  }

  const onSubmit = (event) =>{
		// Action Dispatch 구문
    let body = {
      userid: userid,
      password: password
    }

    console.log("클라이언트 전송확인");

		dispatch(loginUser(body))
    .then(response =>{
			if(response.payload.loginSuccess){
				console.log('로그인에 성공했습니다.');
        swal("로그인 성공", "환영합니다", "success")
            .then(()=>{
              window.location.replace('/');
            })
			}
			else{
				console.log('로그인에 실패했습니다.');
        swal("로그인 실패", "아이디나 비밀번호를 확인해주세요", "error")
			}
		})
	}

  return (
    <div className="App">
      <div className="obserSpace">
      <img className='L1'
          src={require('../../images/LogoImage.jpeg')}
      />
      </div>

      <div>
        <div className="layoutId">
          <AiOutlineUser size="40" color='gray' className='IconId'/></div>
        <input name="userid" type="text" value={userid} onChange={onUseridHandler} className="loginId" placeholder="  아이디"></input>
      </div>

      <div>
        <div className="layoutPw">
          <AiFillLock size="40" color="gray" className='IconPw'/></div>
        <input name="password" type="password" value={password} onChange={onUserpasswordHandler} className="loginPw" placeholder='  비밀번호'></input>
      </div>
      
      
      <div><button type='submit' onClick = {onSubmit} className="login"> 로그인 </button></div>
      
      <div className="join1">
           <Link className="a" to = "/sign_up" >
             <a className='App-link'>+ 회원가입</a>
          </Link>
      </div>
     </div>
  );
};
}
export default Login;
