import React, { useState } from 'react'
import './SignUp.css';
import osLogo from '../../images/osLogo.png';
import swal from "sweetalert"
import Auth from '../../../hoc/auth'

import { HiOutlineUser } from "react-icons/hi";
import { HiOutlineKey } from "react-icons/hi";
import { HiLockClosed } from "react-icons/hi";
import { HiOutlineStar } from "react-icons/hi";
import { HiMail } from "react-icons/hi";
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action';
import { useNavigate } from 'react-router-dom'

//TODO
// 아이콘 정렬, 모달 창 두가지로 뜨게 하는 방법 찾기

function SignUp(){ 

	const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userid,setuserid] = useState("");
  const [password,setpassword] = useState("");
  const [passwordcheck,setpasswordcheck] = useState("");
  const [username ,setusername] = useState("");
  const [email,setemail] = useState("");

  const onUseridHandler = (event) =>{
    setuserid(event.currentTarget.value)
  }
  const onUserpasswordHandler = (event) =>{
    setpassword(event.currentTarget.value)
  }
  const onUserpasswordcheckHandler = (event) =>{
    setpasswordcheck(event.currentTarget.value)
  }
  const onUsernameHandler = (event) =>{
    setusername(event.currentTarget.value)
  }
  const onemailHandler = (event) =>{
    setemail(event.currentTarget.value)
  }
	const onSubmit = (event) =>{
    event.preventDefault();
		if(password != passwordcheck){
      swal("로그인 실패",`비밀번호 확인이 일치하지 않습니다!`, "warning")
			return console.log('비밀번호 확인이 일치하지 않습니다.');
		}

		let body = {
			userid: userid,
			password: password,
			email: email,
			username: username
		};

    console.log("userid: ", userid)
    console.log("password: ", password)
    console.log("email: ", email)
    console.log("username: ", username)

		// Action Dispatch 구문
		dispatch(registerUser(body))
    .then(response =>{
			if(response.payload.registerSuccess){
				console.log('회원가입에 성공했습니다.');
        swal("회원가입 완료", "환영합니다! 로그인 해주세요.", "success")
            .then(()=>{
              window.location.replace('/login');
            })
			}
			else{
				console.log('회원가입에 실패했습니다.');
        swal("로그인 실패",`아이디나 이메일이 중복되었습니다!`, "error")
			}
		})
	}

  return (
    <div className = "App">
       
        <img className = "logo" src = {osLogo} alt = 'osLogo'/> 

      <div className = "App-header">

        <div className = "text">
         <br/>
         <div style={{color : '#898989', fontSize : '15px'}}> 회원 정보 입력</div>

        </div>
        <br/>

        <div className="data-box">
          <div className="small-box">
           <HiOutlineUser size = "40" color = "#898989"/>
          </div>
          <input name="userid" type="text" placeholder='아이디' value={userid} onChange={onUseridHandler} className="input-box"  size = "20" />
        </div>
        <br/>

        <div className="data-box">
          <div className="small-box">
             <HiOutlineKey size = "40" color = "#898989" />
          </div> 
          <input name="password" type="password" placeholder="비밀번호" value={password} onChange={onUserpasswordHandler } className="input-box" size = "20" />
        </div>
        <br/>

        <div className="data-box">
          <div className="small-box">
             <HiLockClosed size = "40" color = "#898989"/>
         </div>   
         <input name="passwordcheck" type="password" placeholder="비밀번호 확인" value={passwordcheck} onChange={onUserpasswordcheckHandler} className="input-box" size = "20" />
        </div>
        <br/>

        <div className="data-box">
          <div className="small-box">
             <HiOutlineStar size = "40" color = "#898989" />
          </div>
          <input name="username" type="text" placeholder="닉네임" value={username} onChange={onUsernameHandler} className="input-box" size = "20" />
        </div>
        <br/>

        <div className="data-box">
          <div className="small-box">
             <HiMail size = "40" color = "#898989" />
          </div>
          <input name="email" type="email" placeholder="이메일" value={email} onChange={onemailHandler} className="input-box" size = "20" />
        </div>
        <br/>
				
				<div><button type='submit' onClick={onSubmit} className="button-box"> 회원가입 </button></div>
				<br/><br/>
        
       	
      
     </div>
    </div>
  );
}

export default SignUp;