import { AiOutlineDown } from "react-icons/ai";
import { BiMenu } from "react-icons/bi";
import { AiOutlineCloud } from "react-icons/ai";
import { AiOutlineSearch } from "react-icons/ai";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { BsListUl } from "react-icons/bs";
import { BsGrid } from "react-icons/bs";
import { AiFillPicture } from "react-icons/ai";
import { AiOutlineFileText } from "react-icons/ai";
import Cat1 from "../cat1.jpeg";
import { Link } from "react-router-dom";

import style from "styled-components";
import Drive from "../drive";
import { AiOutlineVideoCamera } from "react-icons/ai";
import { BsMusicNoteBeamed } from "react-icons/bs";

import React, { Component } from "react";
import "./Main.css";
import { AiOutlineUser } from "react-icons/ai";
import { AiOutlineFolder } from "react-icons/ai";
import { AiOutlineSwap } from "react-icons/ai";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { DropdownButton } from "react-bootstrap";


// import LogoImage from '../LogoImage.jpeg';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      one: true,
      two: true,
      three: true,
    };
  }

  GoogleDriveChange = () => {
    this.props.GoogleDriveChange();
  };

  childFunction = () => {
    this.props.parentFunction("AB");
  };

  render() {
    return (
        <html>
            <body>
                <div className="Main">
                    <div className='MenuList'>
                        <Link to ="/a">
                        <div className='Logo'>
                            <img
                                className='L'
                                src={require('../LogoImage.jpeg')}
                                 />
                        </div>
                        </Link>
                        <div className='LogoHr'>
                        </div>
                        
                        <Link to ="/a">
                        <div className='MenuUserIcon'>
                            <AiOutlineUser size="40" color='gray' className='AB' />
                        </div>
                        </Link>

                        <div className='MenuBiIcon'>
                            <BiMenu size="40" color='gray' />
                        </div>

                        <AiOutlineFolder size="40" color='gray' />

                        <Link to ="/Compare">
                          <AiOutlineExclamationCircle size="40" color='gray' />
                        </Link>

                    </div>
                    <div className='LeftMain'>
                        <div className="AllStorage">
                            <div className='AllStorage_CloudBox'>

                                <div className='CloudBoxUp'>
                                    <AiOutlineCloud size='30' />
                                    <div className='CloudBoxUpText'>
                                        <span className='GoogleDriveText'>전체 저장공간</span>
                                    </div>


                                </div>

                                <div className='ProgressDiv'>
                                    <progress value="50" max="80" className='ProgressA' />
                                </div>

                                <span className='StorageVolume'>150GB / 240GB</span>

                            </div>


                        </div>
                        <div className='MainStorageMenu'>
                            <div className='Picture'>
                                <AiFillPicture size={30}/>
                                <span>사진</span>
                            </div>
                            <div className='Document'>
                                <AiOutlineFileText size={30}/>
                                <span>문서</span>
                            </div>
                            <div className='Video'>
                                <AiOutlineVideoCamera size={30}/>
                                <span>비디오</span>
                            </div>
                            <div className='Music'>
                                <BsMusicNoteBeamed size={30}/>
                                <span>음악</span>
                            </div>
                            
                        </div>
                    </div>

                    <div className="RightMain">
                        <div className='RightTop'>

                            <div className='RightTop_Top'>
                                <div className='InputDiv'>
                                    <input type="search" placeholder="검색"
                                        className='Search'>
                                    </input>
                                    <AiOutlineSearch size={20} color='gray'
                                        className='SearchIcon' />
                                </div>

                                <div className='UpLoadFile'>
                                    <AiOutlineCloudUpload size={25} />
                                    <span className='UpLoadFileText'>파일 올리기</span>
                                </div>

                            </div>
                            <div className='RightTop_Bottom'>
                                <div className='RightTop_Bottom_Menu'>
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
                                <BsListUl size={25} />
                                <BsGrid size={22} />
                                </div>
                            </div>

                        </div>

                        <div className='RightBottom'>
                <Drive />
              </div>
            </div>
          </div>
        </body>
      </html>
    );
  }
}

export default Main;
