import React, { useContext, useState, useEffect } from "react";
import "./ContentBarP.css";
import { LoginContext } from "./LoginContext";
import { AiOutlineUser } from "react-icons/ai";
import { AiOutlineFolder } from "react-icons/ai";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import { BiMenu } from "react-icons/bi";
import Compare from "./Compare";
import Personal from "./Personal";
import styled from "styled-components";

function ContentBarP(){
    const [loggedIn, setLoggedIn] = useContext(LoginContext);

    const MenuUserIcon = styled.div`
    margin-top: 8vh;
    background-color: #eeeeee;
    border-radius: 15px;
    `;


return(
    <div className="MenuList">
    <div className="Logo3">
      <img className="L8" src={require("../LogoImage.jpeg")} />
    </div>
    <MenuUserIcon>
      <AiOutlineUser size="40" color="gray" className="AB" />
    </MenuUserIcon>
    <Link to="/">
      <BiMenu size="40" color="gray" />
    </Link>
    <AiOutlineFolder size="40" color="gray" />
    <Link to="/Compare">
      <div className="MenuUserIcon1">
        <AiOutlineExclamationCircle size="40" color="gray" />
      </div> 
    </Link>
</div>

 );
}

export default ContentBarP;