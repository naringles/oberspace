import React, { useContext, useState, useEffect } from "react";
import "./ContentBar.css";
import { LoginContext } from "./LoginContext";
import { AiOutlineUser } from "react-icons/ai";
import { AiOutlineFolder } from "react-icons/ai";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import { BiMenu } from "react-icons/bi";
import Header from "./Header";
import ContentBar from "./ContentBar";
import catalog from "../compareFile.png";
import UserHome from"../components/UserHome"
import ExitToAppTwoToneIcon from "@material-ui/icons/ExitToAppTwoTone";



function Compare(){
    const [loggedIn, setLoggedIn] = useContext(LoginContext);

    return(
        <div>
            <div className = "headerStyle">
                <div className ="logout_c">
                    
                    Logout <ExitToAppTwoToneIcon style={{ fill: "white" }} />
                </div>
            </div>
                <div className="compareContainer">  
                <div className="MenuList_c">
                        <div className="Logo1">
                            <img className="L5" src={require("../LogoImage.jpeg")} />
                                </div>
                                <Link to = "/personal">
                                    <div className="MenuUserIcon">
                                        <AiOutlineUser size="40" color="gray" className="AB" />
                                    </div>
                                </Link>
                                <Link to = "/user/home/:userName">
                                    <div className="MenuBiIcon1">
                                    <BiMenu size="40" color="gray" />
                                    </div>
                                </Link>
                                    <AiOutlineFolder size="40" color="gray" />
                                    <div className="MenuBiIcon">
                                <Link to = "/compare">
                                    <AiOutlineExclamationCircle size="40" color="gray" />
                                </Link>
                                </div> 
                            
                    </div>

                    <div>
                        <img src = {catalog} alt='catalog' className="compareCatalog"/>
                    </div>
            </div>
        </div>

    );
}

export default Compare;