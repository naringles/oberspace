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
      <Header />
      <div className={containerClasses}>
        <ul className={navClasses}>
          <li className="nav-item">
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
              <div style={{ paddingTop: "2%" }}>
                <Register />
              </div>
            ) : (
              <div>
                <div className="card-body">
                  <LoginTab />
                </div>
              </div>
            )}
          </div>
          <div className="col-sm-6">
            <div
            // style={{
            //   color: "white"
            // }}
            >
              <h1 style={{ textShadow: "0.5px 0.5px #440c05" }}>Oberspace</h1>
              <ul>
                <h3>여러 클라우드 스토리지를 위한 하나의 인터페이스!</h3>
                <ul>
                  <li>
                    당신의 google drive, one drive, dropbox 계정을 추가해보세요.
                  </li>
                  <li>
                    Oberspace 하나로 조직화된 방식을 통해 모든 파일에 접근할 수
                    있습니다.
                  </li>
                  <li>
                    단일 인터페이스로 여러 클라우드 스토리지 관리 - 더 많은
                    스토리지를 실현하세요.
                  </li>
                </ul>
                <img
                  src={logo}
                  style={{ position: "absolute", right: "1%" }}
                  width="600"
                  height="450"
                  alt="OberSpace logo"
                />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
