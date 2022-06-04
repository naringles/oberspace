import React, { useState } from 'react'
import './SignUp.css';
import osLogo from '../images/osLogo.png';

import {HiOutlineUser} from "react-icons/hi";
import {HiOutlineKey} from "react-icons/hi";
import {HiLockClosed} from "react-icons/hi";
import {HiOutlineStar} from "react-icons/hi";
import {HiMail} from "react-icons/hi";

import Modal from 'react-modal';
import {Route, Link} from 'react-router-dom';
import swal from "sweetalert"

//TODO
// 아이콘 정렬



function SignUp(){ 

  let [userid,setuserid] = useState("");
  let [username ,setusername] = useState("");
  let [password,setpassword] = useState("");
  let [passwordcheck,setpasswordcheck] = useState("");
  let [usermail,setusermail] = useState("");

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [pass, setPass] = useState(false);

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
          <input className="input-box" onChange={(e)=>{setuserid(e.target.value)}} placeholder='아이디' size = "20" />
        </div>
        <br/>

        <div className="data-box">
          <div className="small-box">
             <HiOutlineKey size = "40" color = "#898989" />
          </div> 
          <input className="input-box" type="password" onChange={(e)=>{setpassword(e.target.value)}} placeholder='비밀번호' size = "20" />
        </div>
        <br/>

        <div className="data-box">
          <div className="small-box">
             <HiLockClosed size = "40" color = "#898989"/>
         </div>   
         <input className="input-box" type="password" onChange={(e)=>{(e.target.value)===password ? setpasswordcheck(true) : setpasswordcheck(false) }} placeholder='비밀번호 확인' size = "20" />
        </div>
        <br/>

        <div className="data-box">
          <div className="small-box">
             <HiOutlineStar size = "40" color = "#898989" />
          </div>
          <input className="input-box" onChange={(e)=>{setusername(e.target.value)}} placeholder='닉네임' size = "20" />
        </div>
        <br/>

    
        <div className="data-box">
          <div className="small-box">
             <HiMail size = "40" color = "#898989" />
          </div>
          <input className="input-box" onChange={(e)=>{setusermail(e.target.value)}} placeholder='이메일' size = "20" />
        </div>
        <br/><br/><br/>
        

        <button className="button-box" onClick={() => {
          {passwordcheck==true?
            swal("가입완료!", "환영합니다!", "success")
            .then(()=>{
              window.location.replace('/Login');
            })
          :
           swal("가입실패!", "비밀번호를 확인하세요!", "warning")
          }
        }} > 
           가입하기
        </button>
        
      
      
     </div>
    </div>
  );
  
}



Modal.setAppElement('#root');
export default SignUp;