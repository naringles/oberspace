import React, { useContext, useState, useEffect } from "react";
import "./ContentBarP.css";
import { LoginContext } from "./LoginContext";
import { AiOutlineUser } from "react-icons/ai";
import { AiOutlineFolder } from "react-icons/ai";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import { BiMenu } from "react-icons/bi";
import Header from "./Header";
import ContentBar from "./ContentBar";
import UserHome from"../components/UserHome"
import styled from "styled-components";
import ExitToAppTwoToneIcon from "@material-ui/icons/ExitToAppTwoTone";
import NavComponent from "./NavComponent";
import { Navbar, Nav, Form, Button, NavDropdown } from "react-bootstrap";
import ContentBarP from "./ContentBarP";
import LoginTab from "./LoginTab";



function Personal(){
    const [loggedIn, setLoggedIn] = useContext(LoginContext)

        const MenuUserIcon = styled.div`
        margin-top: 8vh;
        background-color: #eeeeee;
        border-radius: 15px;
        `;


        const homeRoute = "/";

        const urlParams = new URL(window.location.href).searchParams;

        const name = urlParams.get('userName');

        console.log(name)

    return(
    <div>
      <div className = "headerStyle">
        <div className ="logout_c">
          
          Logout <ExitToAppTwoToneIcon style={{ fill: "white" }} />
        </div>
      </div>

        <div className="container-fluid">
          <div className="row" style={{ paddingTop: "2%" }}>
          <div className="col-sm-1">
            <ContentBarP/>
          </div>
          <div className="col-sm-4" style={{ padding: "0" }}>
          </div>

          <div className="col-sm-5">
            <br></br>
            <br></br>
            <br></br>

            <span className="UserIconBox" style={{ width:"300px", height:"300px"}}>
              <AiOutlineUser size="200" color="gray"/>
            </span>
            <br></br>
            <br></br>
            <div className="ChangeInfor" style={{ width:"600px", height:"60px"}}>
              <div className="ChangeInforText" style={{ fontSize: "20px" }}>정보 수정</div>
            </div>
            <div className="DeleteAccount" style={{ width:"600px", height:"60px"}}>
              <span className="DeleteAccountText" style={{ fontSize: "20px" }}>계정 탈퇴</span>
            </div> 
          </div>
          
            </div>
        </div>
        </div>
    );
}

export default Personal;