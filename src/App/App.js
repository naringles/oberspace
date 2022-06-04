import React, { Component, useEffect, useState } from "react";
import "./A.css";
import { AiOutlineUser } from "react-icons/ai";
import { AiOutlineFolder } from "react-icons/ai";
import { AiOutlineSwap } from "react-icons/ai";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { BiMenu } from "react-icons/bi";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { AiOutlineCloud } from "react-icons/ai";

import Main from "../Main/index";
import styled from "styled-components";
import Login from "../Login";
import SignUp from "../SignUp/SignUp";
import Compare from "../Compare";
import Swal from "sweetalert2";
import { data1 } from "../data";

class Rr extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test: false,
      ShowGoogleDrive: true,
      ShowOneDrive: true,
      ShowMegaDrive: true,
      one: true,
      two: true,
      three: true,
    };
  }

  parentFunction = (data) => {
    console.log(data);
  };

  OneDriveShow = () => {
    this.setState({
      oneDriveShow: true,
    });
  };

  OneDriveNotShow = () => {
    this.setState({
      oneDriveShow: false,
    });
  };

  MegaDriveShow = () => {
    this.setState({
      MegaDriveShow: true,
    });
  };

  MegaDriveNotShow = () => {
    this.setState({
      MeaDriveShow: false,
    });
  };

  GoogleDriveChange = () => {
    this.setState({
      GoogleDriveShow: true,
    });
    console.log("a");
    console.log(this.state.GoogleDriveShow);
  };

  testtrue = (data) => {
    this.setState({
      test: data,
    });
    console.log(data);
  };

  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Main
                test={this.state.test}
                testtrue={this.testtrue}
                parentFunction={this.parentFunction}
                ShowGoogleDrive={this.state.ShowGoogleDrive}
                GoogleDriveChange={this.GoogleDriveChange}
              ></Main>
            }
          ></Route>
          <Route
            path="/a"
            element={
              <App
                test={this.state.test}
                ShowGoogleDrive={this.state.ShowGoogleDrive}
                ShowOneDrive={this.state.ShowOneDrive}
                ShowMegaDrive={this.state.ShowMegaDrive}
              ></App>
            }
          ></Route>
          <Route path="/Login" element={<Login></Login>}></Route>
          <Route path="/SignUp" element={<SignUp></SignUp>}></Route>
          <Route path="/Compare" element={<Compare></Compare>}></Route>
        </Routes>
      </BrowserRouter>
    );
  }
}

//DROP

const LeftMain = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 45vw;
  height: 100;
`;

const MenuUserIcon = styled.div`
  margin-top: 15vh;
  background-color: #eeeeee;
  border-radius: 15px;
`;

function App() {
  const [driveMap, setDriveMap] = useState(
    () => JSON.parse(window.localStorage.getItem("data")) || data1
  );

  useEffect(() => {
    window.localStorage.setItem("data", JSON.stringify(driveMap));
  }, [driveMap]);

  const deleteDrive = (str, i) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: `${str} 해지하시겠습니까?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        reverseButtons: false,
      })
      .then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire(
            `${str} 해지되었습니다`,
            "",
            "success"
          );

          setDriveMap(
            driveMap.map((data) => ({
              ...data,
              value: data.id !== i ? data.value : "",
            }))
          );
          console.log(driveMap);
        }
      });
  };

  return (
    <html>
      <body>
        <div className="Main">
          <div className="Left">
            <div className="MenuList">
              <div className="Logo">
                <img className="L" src={require("../LogoImage.jpeg")} />
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
              <span
                onClick={() => {
                  console.log(this.props.ShowGoogleDrive);
                }}
              >
                {" "}
              </span>
            </div>
            <LeftMain>
              <div className="UserIconBox">
                <AiOutlineUser size="80" color="gray" />
              </div>
              <span className="UserText">USER</span>
              <div className="UserInformationBox">
                <div>ID : kmu2022</div>
                <div>e-mail : kmu2022@naver.com</div>
              </div>

              <div className="ChangeInfor">
                <span className="ChangeInforText">정보 수정</span>
              </div>
              <div className="DeleteAccount">
                <span className="DeleteAccountText">계정 탈퇴</span>
              </div>
            </LeftMain>
          </div>

          <div className="Hr"></div>

          <div className="RightMain">
            <div className="Right1"></div>
            <>
              {driveMap.map((item, i) => (
                <>
                  {item.value !== "" ? (
                    <div className="CloudBox">
                      <div className="CloudBoxUp">
                        <div className="">
                          <AiOutlineCloud size="40" />
                        </div>
                        <div className="CloudBoxUpText">
                          <div className="GoogleDriveText">
                            {item.value[0]}
                            <span
                              className="OneDriveDel"
                              onClick={() => deleteDrive(item.value[0], i)}
                            >
                             계정해제
                            </span>
                          </div>
                          <span>string</span>
                        </div>
                      </div>

                      <div className="ProgressDiv">
                        <progress
                          value="50"
                          max="80"
                          className={
                            item.value[1] === "Progress"
                              ? "Progress"
                              : item.value[1] === "OneDriveProgress"
                              ? "OneDriveProgress"
                              : "MegaDriveProgress"
                          }
                        />
                      </div>

                      <span className="StorageVolume">50GB / 80GB</span>
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              ))}
            </>
          </div>
        </div>
      </body>
    </html>
  );
}

export default Rr;
