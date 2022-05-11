import React, { useState } from 'react'
import './SignUp.css';
import osLogo from '../images/osLogo.png';

import {HiOutlineUser} from "react-icons/hi";
import {HiOutlineKey} from "react-icons/hi";
import {HiLockClosed} from "react-icons/hi";
import {HiOutlineStar} from "react-icons/hi";
import {HiMail} from "react-icons/hi";

import SignUpModal from '../Modals/SignUpModal';

//TODO
//모달 창 오류, 아이콘 정렬, 회원가입 취소 버튼 추가

function SignUp(){ 
  const [signUpModalOn, setSignUpModalOn] = useState(false);
  return (
    
  
    <div className = "App">
      
        <img className = "logo" src = {osLogo} alt = 'osLogo'/> 
      
      <SignUpModal 
            show={signUpModalOn} 
            onHide={()=>setSignUpModalOn(false)} 
      />

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
          <input className="input-box"  placeholder='아이디' size = "20" />
        </div>
        <br/>

        <div className="data-box">
          <div className="small-box">
             <HiOutlineKey size = "40" color = "#898989" />
          </div> 
          <input className="input-box"  placeholder='비밀번호' size = "20" />
        </div>
        <br/>

        <div className="data-box">
          <div className="small-box">
             <HiLockClosed size = "40" color = "#898989"/>
         </div>   
         <input className="input-box"  placeholder='비밀번호 확인' size = "20" />
        </div>
        <br/>

        <div className="data-box">
          <div className="small-box">
             <HiOutlineStar size = "40" color = "#898989" />
          </div>
          <input className="input-box" placeholder='닉네임' size = "20" />
        </div>
        <br/>

    
        <div className="data-box">
          <div className="small-box">
             <HiMail size = "40" color = "#898989" />
          </div>
          <input className="input-box"  placeholder='이메일' size = "20" />
           
        </div>
        <br/><br/><br/>

        <button 
            className="button-box" 
            onClick={() => setSignUpModalOn(true)}> 
            가입하기
        </button>
        
          
      
        
        <br/><br/><br/><br/><br/>
        

     </div>
    </div>
  );
  
}

export default SignUp;