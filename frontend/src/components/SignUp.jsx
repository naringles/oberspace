import React, { useState } from "react";
import Header from "./Header";
import classNames from "classnames";
import Register from "./RegisterTab";
import LoginTab from "./LoginTab";
import { FcGoogle } from "react-icons/fc";
import logo from "../oneStorage.png";

function SignUp() {
  console.log("environment :", process.env.NODE_ENV);
  const containerClasses = classNames("container", "mt-5");
  const navClasses = classNames("nav", "nav-tabs");
  const navItemClasses = classNames("nav-link", "active");
  console.log("sign up");
  // const tabStyle = {width: "20rem" };

  const [register, setRegister] = useState(false);
  function registerClick() {
    setRegister(true);
  }
  function loginClick() {
    setRegister(false);
  }

  return (
    <div>
      <div className={containerClasses} style={{paddingBottom: "10%" , float:"left"}}>
      <div className="col-sm-6">
              <div
              // style={{
              //   color: "white"
              // }}
              >
                
                  <img
                    src={logo}
                    className = "Logo"
                    alt="OberSpace logo"
                  />
              </div>
          </div>
        <div className = "userInput" >
          
          <ul className={navClasses} style={{ paddingTop: "60%"}}>
            <li className="nav-item" style ={{ color: "#898989"}}>
              <button onClick={loginClick} className={navItemClasses}>
                로그인
              </button>
            </li>
            <li style={{ paddingLeft: "0.5rem" }} className="nav-item">
              <button onClick={registerClick} className="nav-link">
                회원가입
              </button>
            </li>
          </ul>
          <div className="row">
            <div className="col-sm-6">
              {register ? (
                <div style={{ paddingTop: "7%" }}>
                  <Register />
                </div>
              ) : (
                <div>
                  <div className="card-body" style={{ paddingLeft: "0%" }} >
                    <LoginTab />
                  </div>
                </div>
              )}
            </div>
          </div>
       
      </div>
      </div>
    </div>
  );
}

export default SignUp;
