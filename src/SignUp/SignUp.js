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

//TODO
// 아이콘 정렬, 모달 창 두가지로 뜨게 하는 방법 찾기

/*
           <Modal style = {ModalStyle} isOpen= {modalIsOpen} >
           <button className="modal-button" onClick={()=> setModalIsOpen(false)}>닫기</button>
           </Modal>

*/
const ModalStyle = {
	overlay: {
		position: "flexed",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(255, 255, 255, 0.45)",
		zIndex: 10,
	},
	content: {
		display: "flex",
		justifyContent: "center",
		background: "#ffffff",
		overflow: "auto",
		top: "42vh",
		left: "38vw",
		right: "38vw",
		bottom: "42vh",
		WebkitOverflowScrolling: "touch",
		borderRadius: "14px",
		outline: "none",
		zIndex: 10,
	},
};

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
        

        <button className="button-box" onClick={() => {setModalIsOpen(true)}} > 
           가입하기
        </button>
        
      {passwordcheck == true ? 
        <div>
          <Modal style = {ModalStyle} isOpen= {modalIsOpen} >
            {username}님, 회원가입 완료!
            <br></br>
            <Link to = "/Login">
               <button className="modal-button" onClick={()=> setModalIsOpen(false)}>닫기</button>
            </Link> 
          </Modal>
          <br/><br/><br/><br/><br/>
        </div>

        :

        <div>
          <Modal style = {ModalStyle} isOpen= {modalIsOpen} >
            비밀번호를 확인하세요!
            <br></br>
              <button className="modal-button" onClick={()=> setModalIsOpen(false)}>닫기</button>
          </Modal>
        </div>

      }
      
     </div>
    </div>
  );
  
}



Modal.setAppElement('#root');
export default SignUp;