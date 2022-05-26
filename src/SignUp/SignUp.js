import React, { useState } from 'react'
import './SignUp.css';
import osLogo from '../images/osLogo.png';

import {HiOutlineUser} from "react-icons/hi";
import {HiOutlineKey} from "react-icons/hi";
import {HiLockClosed} from "react-icons/hi";
import {HiOutlineStar} from "react-icons/hi";
import {HiMail} from "react-icons/hi";

<<<<<<< HEAD
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
=======
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
>>>>>>> dahye

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
<<<<<<< HEAD
          <input className="input-box"  placeholder='아이디' size = "20" />
=======
          <input className="input-box" onChange={(e)=>{setuserid(e.target.value)}} placeholder='아이디' size = "20" />
>>>>>>> dahye
        </div>
        <br/>

        <div className="data-box">
          <div className="small-box">
             <HiOutlineKey size = "40" color = "#898989" />
          </div> 
<<<<<<< HEAD
          <input className="input-box"  placeholder='비밀번호' size = "20" />
=======
          <input className="input-box" onChange={(e)=>{setpassword(e.target.value)}} placeholder='비밀번호' size = "20" />
>>>>>>> dahye
        </div>
        <br/>

        <div className="data-box">
          <div className="small-box">
             <HiLockClosed size = "40" color = "#898989"/>
         </div>   
<<<<<<< HEAD
         <input className="input-box"  placeholder='비밀번호 확인' size = "20" />
=======
         <input className="input-box" onChange={(e)=>{(e.target.value)===password ? setPass(true) : setPass(false) }} placeholder='비밀번호 확인' size = "20" />
>>>>>>> dahye
        </div>
        <br/>

        <div className="data-box">
          <div className="small-box">
             <HiOutlineStar size = "40" color = "#898989" />
          </div>
<<<<<<< HEAD
          <input className="input-box" placeholder='닉네임' size = "20" />
=======
          <input className="input-box" onChange={(e)=>{setusername(e.target.value)}} placeholder='닉네임' size = "20" />
>>>>>>> dahye
        </div>
        <br/>

    
        <div className="data-box">
          <div className="small-box">
             <HiMail size = "40" color = "#898989" />
          </div>
<<<<<<< HEAD
          <input className="input-box"  placeholder='이메일' size = "20" />
           
        </div>
        <br/><br/><br/>

        <button 
            className="button-box" 
            onClick={() => setSignUpModalOn(true)}> 
            가입하기
        </button>
        
          
      
        
        <br/><br/><br/><br/><br/>
        

=======
          <input className="input-box" onChange={(e)=>{setusermail(e.target.value)}} placeholder='이메일' size = "20" />
        </div>
        <br/><br/><br/>
        

        <button className="button-box" onClick={() => {setModalIsOpen(true)}} > 
           가입하기
        </button>
      
       <Modal style = {ModalStyle} isOpen= {modalIsOpen} >
        {username}님, 회원가입 완료!
         <br></br>
            <Link to = "/Login">
               <button className="modal-button" onClick={()=> setModalIsOpen(false)}>닫기</button>
            </Link> 
       </Modal>
        <br/><br/><br/><br/><br/>
      
>>>>>>> dahye
     </div>
    </div>
  );
  
}

<<<<<<< HEAD
=======


Modal.setAppElement('#root');
>>>>>>> dahye
export default SignUp;
