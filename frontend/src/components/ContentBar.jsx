import React, { useContext, useState, useEffect } from "react";
import "./ContentBar.css";
import { LoginContext } from "./LoginContext";
import { AiOutlineUser } from "react-icons/ai";
import { AiOutlineFolder } from "react-icons/ai";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import { BiMenu } from "react-icons/bi";
import Compare from "./Compare";

function ContentBar(){
    const [loggedIn, setLoggedIn] = useContext(LoginContext);

return(
    <div className="MenuList">
        <div className="Logo1">
            <img className="L2" src={require("../LogoImage.jpeg")} />
                </div>
                <Link to="/personal">
                  <div className="MenuUserIcon">
                    <AiOutlineUser size="40" color="gray" className="AB" />
                  </div>
                </Link>
                <div className="MenuBiIcon">
                  <BiMenu size="40" color="gray" />
                </div>
                <AiOutlineFolder size="40" color="gray" />
                <Link>
                <div className="MenuUserIcon1">
                  <Link to = "/Compare">
                    <AiOutlineExclamationCircle size="40" color="gray" />
                  </Link>
                </div> 
                </Link>
    </div>
 );
}

export default ContentBar;
