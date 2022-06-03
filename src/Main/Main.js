import React, { Component, useEffect, useState } from "react";
import "./Main.css";
import { AiOutlineUser } from "react-icons/ai";
import { AiOutlineFolder } from "react-icons/ai";
import { AiOutlineSwap } from "react-icons/ai";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { AiOutlineDown } from "react-icons/ai";
import { BiMenu } from "react-icons/bi";
import { AiOutlineCloud } from "react-icons/ai";
import { AiOutlineSearch } from "react-icons/ai";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { BsListUl } from "react-icons/bs";
import { BsGrid } from "react-icons/bs";
import { AiFillPicture } from "react-icons/ai";
import { AiOutlineFileText } from "react-icons/ai";

import { AiOutlineVideoCamera } from "react-icons/ai";
import { BsMusicNoteBeamed } from "react-icons/bs";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Swal from "sweetalert2";

import Cat1 from "../cat1.jpeg";
import { Link } from "react-router-dom";
import { data1 } from "../data";
import Modal from "react-modal";
import Compare from "../Compare";

import style from "styled-components";

// import LogoImage from '../LogoImage.jpeg';

function Main() {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     one: true,
  //     two: true,
  //     three: true,
  //     picture: true,
  //   };
  // }

  let one = true;
  let two = true;
  let three = true;
  const [picture, setPicture] = useState(false);
  const [line, setLine]=useState(true);

  const modalStyle = {
    overlay: {
      position: "fixed",
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
      textalign: "center",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "200px",
      height: "200px",
      borderRadius: "14px",
      outline: "none",
      zIndex: 10,
    },
  };

  const GoogleDriveChange = () => {
    // this.props.GoogleDriveChange();
  };

  const childFunction = () => {
    // this.props.parentFunction("AB");
  };

  const showPicture = () => {
    setPicture(!picture);
  };

  const [datum, setDatum] = useState(
    () => JSON.parse(window.localStorage.getItem("data")) || data1
  );

  const addDrive = (key) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: `${data1[key].value[0]}를 추가하시겠습니까?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        reverseButtons: false,
      })
      .then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire(
            `${data1[key].value[0]}가 추가되었습니다`,
            "",
            "success"
          );

          setDatum(
            datum.map((data) => ({
              ...data,
              value: data.id === key ? data1[key].value : data.value,
            }))
          );
        }
      });
  };

  useEffect(() => {
    window.localStorage.setItem("data", JSON.stringify(datum));
  }, [datum]);

  const defaultImage = Array.from({ length: 32 }, () => {
    return "";
  });

  const allSelect = (key) => {
    setDatum(
      datum.map((data) => ({
        ...data,
        allCheck: data.id === key ? !data.allCheck : data.allCheck,
      }))
    );
  };

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const modalOpen = () => {
    setModalIsOpen(true);
  };

  return (
    <html>
      <body>
        <Modal
          isOpen={modalIsOpen}
          style={modalStyle}
          onRequestClose={() => setModalIsOpen(false)}
        >
          <img
            src={Cat1}
            style={{ width: "150px", height: "150px" }}
            onRequestClose={true}
          ></img>
        </Modal>
        <div className="Main">
          <div className="MenuList">
              <div className="Logo">
                <img className="L" src={require("../LogoImage.jpeg")} />
              </div>
            <Link to="/a">
              <div className="MenuUserIcon">
                <AiOutlineUser size="40" color="gray" className="AB" />
              </div>
            </Link>
            <div className="MenuBiIcon">
              <BiMenu size="40" color="gray" />
            </div>
            <AiOutlineFolder size="40" color="gray" />
            <Link to="/Compare">
                <div className="MenuUserIcon1">
                  <AiOutlineExclamationCircle size="40" color="gray" />
                </div> 
            </Link>
          </div>
          <div className="LeftMain">
            <div className="AllStorage">
              <div className="AllStorage_CloudBox">
                <div className="CloudBoxUp">
                  <AiOutlineCloud size="30" />
                  <div className="CloudBoxUpText">
                    <span className="GoogleDriveText">전체 저장공간</span>
                  </div>
                </div>

                <div className="ProgressDiv">
                  <progress value="50" max="80" className="ProgressA" />
                </div>

                <span className="StorageVolume">150GB / 240GB</span>
              </div>
            </div>
            <div className="MainStorageMenu">
              <div className="Picture">
                <AiFillPicture size={30} />
                <span>사진</span>
              </div>
              <div className="Document">
                <AiOutlineFileText size={30} />
                <span>문서</span>
              </div>
              <div className="Video">
                <AiOutlineVideoCamera size={30} />
                <span>비디오</span>
              </div>
              <div className="Music">
                <BsMusicNoteBeamed size={30} />
                <span>음악</span>
              </div>
            </div>
          </div>

          <div className="RightMain">
            <div className="RightTop">
              <div className="RightTop_Top">
                <div className="InputDiv">
                  <input
                    type="search"
                    placeholder="검색"
                    className="Search"
                  ></input>
                  <AiOutlineSearch
                    size={20}
                    color="gray"
                    className="SearchIcon"
                  />
                </div>

                <div className="UpLoadFile">
                  <AiOutlineCloudUpload size={25} />
                  <label className="UpLoadFileText">
                    <input
                      type="file"
                      className="UpLoadFileInput"
                      onchange="addFile(this);"
                      multiple
                    />
                    파일 올리기
                  </label>
                </div>
              </div>
              <div className="RightTop_Bottom">
                <div className="RightTop_Bottom_Menu">
                <div className='Edit'>
                    <select>
                      <option value="A">편집</option>
                      <option value="B">1</option>
                    </select>
                  </div>
                  <div className="LatestOrder">
                      <select>
                       <option value="A">최신순</option>
                       <option value="B">오래된순</option>
                      </select>
                    </div>
                  
                    <div onClick={showPicture}>
                      {picture ? (
                      <BsListUl size={25} />
                      ) : (
                        <BsGrid size={22} />
                      )}
                   </div>
                </div>
              </div>
            </div>

            <div className="RightBottom">
              <>
                {datum.map((item, i) => (
                  <>
                    {item.value !== "" ? (
                      <>
                        <div className="CloudUpperBox">
                          <div className="CloudBox">
                            <div className="CloudBoxUp">
                              <div className="">
                                <AiOutlineCloud size="40" />
                              </div>

                              <div className="CloudBoxUpText">
                                <span className="GoogleDriveText">
                                  {item.value[0]}
                                </span>
                                <span>sinjjang</span>
                              </div>

                              <div className="GoogleDriveCheckBox">
                                <label>
                                <input
                                  className="chk"
                                  type="Checkbox"
                                  onChange={() => allSelect(i)}
                                />전체선택</label>
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

                          {picture ? (
                            <div className="ImageGrid">
                              {defaultImage.map(() => (
                                <div style={{ position: "relative" }}>
                                  {item.allCheck ? (
                                    <input
                                      type="checkbox"
                                      style={{
                                        position: "absolute",
                                        top: 0,
                                        left: "0",
                                      }}
                                      checked="checked"
                                    />
                                  ) : (
                                    <></>
                                  )}

                                  <>
                                    <img src={Cat1}></img>
                                    <div classname="nameTag">고양이.jpeg</div>
                                  </>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div
                              className="ImageGrid"
                              style={{ display: "block" }}
                            >
                              {defaultImage.map(() => (
                                <div style={{ position: "relative" }}>
                                  {item.allCheck ? (
                                    <input
                                      type="checkbox"
                                      style={{
                                        position: "absolute",
                                        top: "0",
                                        left: "-20px",
                                      }}
                                      checked="checked"
                                    />
                                  ) : (
                                    <></>
                                  )}

                                  <div style={{ width: "400px" }}>
                                    <a onClick={modalOpen}>
                                      고양이.jpeg 300kb 2022.0508 오전 02:41
                                      <hr/>
                                    </a>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <div>트래픽 제한 612GB</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="PlusButtonBox">
                          <div
                            className="PlusButton"
                            onClick={() => addDrive(i)}
                          >
                            <AiOutlinePlusCircle
                              size={80}
                            ></AiOutlinePlusCircle>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                ))}
              </>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

export default Main;
