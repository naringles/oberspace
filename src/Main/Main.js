import React, { Component } from 'react';
import './Main.css';
import { AiFillFileText, AiOutlineUser } from "react-icons/ai";
import { AiOutlineFolder } from "react-icons/ai";
import { AiOutlineSwap } from "react-icons/ai";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { AiOutlineDown } from "react-icons/ai";
import { BiMenu } from 'react-icons/bi'
import { AiOutlineCloud } from 'react-icons/ai'
import { AiOutlineSearch } from "react-icons/ai";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { BsListUl } from "react-icons/bs";
import { BsGrid } from "react-icons/bs";
import { AiFillPicture } from "react-icons/ai";
import { AiOutlineFileText } from "react-icons/ai";

import { AiOutlineVideoCamera } from "react-icons/ai";
import { BsMusicNoteBeamed } from "react-icons/bs";

import { AiOutlinePlusCircle } from 'react-icons/ai'

import Cat1 from '../cat1.jpeg'
import { Link } from 'react-router-dom'

import style from 'styled-components'

const ImageGridDiv = style.div`
    display:flex;
  flex-direction: column;

`

const ImageGridName = style.div`
// margin-left:2px;
margin: 0 auto;
font-size: 14px;
margin-top:5px;
`

// import LogoImage from '../LogoImage.jpeg';

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            one: true,
            two: true,
            three: true
        };
    }

    GoogleDriveChange = () => {
        this.props.GoogleDriveChange()
    }

    childFunction = () => {
        this.props.parentFunction('AB'); 
    }


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
                            <AiOutlineSwap size="40" color='gray' />
                            <AiOutlineExclamationCircle size="40" color='gray' />

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
                                        <span>편집</span>
                                        <AiOutlineDown size={14}/>
                                    </div>
                                    <div className='LatestOrder'>
                                        <span>최신순</span>
                                        <AiOutlineDown size={14}/>
                                    </div>
                                    <BsListUl size={25} />
                                    <BsGrid size={22} />
                                    </div>
                                </div>

                            </div>

                            <div className='RightBottom'>

                                {this.state.one == true ? 
                                <div className='CloudUpperBox'>
                                <div className='CloudBox'>

                                    <div className='CloudBoxUp'>
                                        <div className=''>
                                            <AiOutlineCloud size='40' />
                                        </div>

                                        <div className='CloudBoxUpText'>
                                            <span className='GoogleDriveText'>google drive</span>
                                            <span>sinjjang</span>
                                        </div>

                                        <div className='GoogleDriveCheckBox'>
                                            <input className='' type='Checkbox'/>
                                            
                                            <span> 전체선택</span>

                                        </div>

                                    </div>

                                    <div className='ProgressDiv'>
                                        <progress value="50" max="80" className='ProgressB' />
                                    </div>

                                    <span className='StorageVolume'>50GB / 80GB</span>
                                </div>

                                <div className='ImageGrid'>
                                    <ImageGridDiv>
                                    <img src={Cat1}></img>
                                    <ImageGridName>고양이.jpeg</ImageGridName>
                                    </ImageGridDiv>
                                    <ImageGridDiv>
                                    <img src={Cat1}></img>
                                    <ImageGridName>고양이.jpeg</ImageGridName>
                                    </ImageGridDiv>
                                    <ImageGridDiv>
                                    <img src={Cat1}></img>
                                    <ImageGridName>고양이.jpeg</ImageGridName>
                                    </ImageGridDiv>
                                    <ImageGridDiv>
                                    <img src={Cat1}></img>
                                    <ImageGridName>고양이.jpeg</ImageGridName>
                                    </ImageGridDiv>
                                    <ImageGridDiv>
                                    <img src={Cat1}></img>
                                    <ImageGridName>고양이.jpeg</ImageGridName>
                                    </ImageGridDiv>
                                    <ImageGridDiv>
                                    <img src={Cat1}></img>
                                    <ImageGridName>고양이.jpeg</ImageGridName>
                                    </ImageGridDiv>
                                    <ImageGridDiv>
                                    <img src={Cat1}></img>
                                    <ImageGridName>고양이.jpeg</ImageGridName>
                                    </ImageGridDiv>
                                    <ImageGridDiv>
                                    <img src={Cat1}></img>
                                    <ImageGridName>고양이.jpeg</ImageGridName>
                                    </ImageGridDiv>
                                    <ImageGridDiv>
                                    <img src={Cat1}></img>
                                    <ImageGridName>고양이.jpeg</ImageGridName>
                                    </ImageGridDiv>
                                    <ImageGridDiv>
                                    <img src={Cat1}></img>
                                    <ImageGridName>고양이.jpeg</ImageGridName>
                                    </ImageGridDiv>
                                    <ImageGridDiv>
                                    <img src={Cat1}></img>
                                    <ImageGridName>고양이.jpeg</ImageGridName>
                                    </ImageGridDiv>
                                    <ImageGridDiv>
                                    <img src={Cat1}></img>
                                    <ImageGridName>고양이.jpeg</ImageGridName>
                                    </ImageGridDiv>
                                    <ImageGridDiv>
                                    <img src={Cat1}></img>
                                    <ImageGridName>고양이.jpeg</ImageGridName>
                                    </ImageGridDiv>
                                    <ImageGridDiv>
                                    <img src={Cat1}></img>
                                    <ImageGridName>고양이.jpeg</ImageGridName>
                                    </ImageGridDiv>
                                    <ImageGridDiv>
                                    <img src={Cat1}></img>
                                    <ImageGridName>고양이.jpeg</ImageGridName>
                                    </ImageGridDiv>
                                    <ImageGridDiv>
                                    <img src={Cat1}></img>
                                    <ImageGridName>고양이.jpeg</ImageGridName>
                                    </ImageGridDiv>
                                    <ImageGridDiv>
                                    <img src={Cat1}></img>
                                    <ImageGridName>고양이.jpeg</ImageGridName>
                                    </ImageGridDiv>
                                    
                                    

                                </div>

                                <div>트래픽 제한 612GB</div>
                            </div>
                                :
                                <div className='PlusButtonBox'>
                                <div className="PlusButton"
                                    onClick={()=>{
                                        this.setState({
                                            one:true
                                        })

                                    }}>
                                    <AiOutlinePlusCircle size={80}></AiOutlinePlusCircle>
                                </div>
                            
                            </div> }
                                
                                
                                {this.state.two == true ? 
                                 <div className='CloudUpperBox'>
                                 <div className='CloudBox'>

                                     <div className='CloudBoxUp'>
                                         <div className=''>
                                             <AiOutlineCloud size='40' />
                                         </div>

                                         <div className='CloudBoxUpText'>
                                             <span className='GoogleDriveText'>OneDrive</span>
                                             <span>sinjjang</span>
                                             
                                         </div>
                                         <div className='OnDriveCheckBox'>
                                             <input className='' type='Checkbox'/>
                                             <span> 전체선택</span>
                                         </div>


                                     </div>

                                     <div className='ProgressDiv'>
                                         <progress value="50" max="80" className='ProgressOnDrive' />
                                     </div>

                                     <span className='StorageVolume'>50GB / 80GB</span>

                                 </div>

                                 <div className='ImageGrid'>
                                 <ImageGridDiv>
                                     <img src={Cat1}></img>
                                     <ImageGridName>고양이.jpeg</ImageGridName>
                                     </ImageGridDiv>
                                     <ImageGridDiv>
                                     <img src={Cat1}></img>
                                     <ImageGridName>고양이.jpeg</ImageGridName>
                                     </ImageGridDiv>
                                     <ImageGridDiv>
                                     <img src={Cat1}></img>
                                     <ImageGridName>고양이.jpeg</ImageGridName>
                                     </ImageGridDiv>
                                     <ImageGridDiv>
                                     <img src={Cat1}></img>
                                     <ImageGridName>고양이.jpeg</ImageGridName>
                                     </ImageGridDiv>
                                     <ImageGridDiv>
                                     <img src={Cat1}></img>
                                     <ImageGridName>고양이.jpeg</ImageGridName>
                                     </ImageGridDiv>
                                     <ImageGridDiv>
                                     <img src={Cat1}></img>
                                     <ImageGridName>고양이.jpeg</ImageGridName>
                                     </ImageGridDiv>
                                     <ImageGridDiv>
                                     <img src={Cat1}></img>
                                     <ImageGridName>고양이.jpeg</ImageGridName>
                                     </ImageGridDiv>
                                     <ImageGridDiv>
                                     <img src={Cat1}></img>
                                     <ImageGridName>고양이.jpeg</ImageGridName>
                                     </ImageGridDiv>
                                     <ImageGridDiv>
                                     <img src={Cat1}></img>
                                     <ImageGridName>고양이.jpeg</ImageGridName>
                                     </ImageGridDiv>
                                     <ImageGridDiv>
                                     <img src={Cat1}></img>
                                     <ImageGridName>고양이.jpeg</ImageGridName>
                                     </ImageGridDiv>
                                     <ImageGridDiv>
                                     <img src={Cat1}></img>
                                     <ImageGridName>고양이.jpeg</ImageGridName>
                                     </ImageGridDiv>
                                     <ImageGridDiv>
                                     <img src={Cat1}></img>
                                     <ImageGridName>고양이.jpeg</ImageGridName>
                                     </ImageGridDiv>
                                     <ImageGridDiv>
                                     <img src={Cat1}></img>
                                     <ImageGridName>고양이.jpeg</ImageGridName>
                                     </ImageGridDiv>
                                     <ImageGridDiv>
                                     <img src={Cat1}></img>
                                     <ImageGridName>고양이.jpeg</ImageGridName>
                                     </ImageGridDiv>
                                     <ImageGridDiv>
                                     <img src={Cat1}></img>
                                     <ImageGridName>고양이.jpeg</ImageGridName>
                                     </ImageGridDiv>
                                     <ImageGridDiv>
                                     <img src={Cat1}></img>
                                     <ImageGridName>고양이.jpeg</ImageGridName>
                                     </ImageGridDiv>
                                     <ImageGridDiv>
                                     <img src={Cat1}></img>
                                     <ImageGridName>고양이.jpeg</ImageGridName>
                                     </ImageGridDiv>
                                     
                                     
                                     

                                 </div>
                                 <div>트래픽 제한 612GB</div>
                                     
                             </div>
                                :

                                <div className='PlusButtonBox'>
                                    <div className="PlusButton"
                                        onClick={()=>{
                                            this.setState({
                                                two: true
                                            })
                                        }}>
                                        <AiOutlinePlusCircle size={80}></AiOutlinePlusCircle>
                                    </div>
                                
                                </div>
                                
                                }
                               

                                {this.state.three == true ? 
                                <div className='CloudUpperBox'>
                                    <div className='CloudBox'>

                                        <div className='CloudBoxUp'>
                                            <div className=''>
                                                <AiOutlineCloud size='40' />
                                            </div>

                                            <div className='CloudBoxUpText'>
                                                <span className='GoogleDriveText'>Mega</span>
                                                <span>sinjjang</span>
                                            </div>
                                            <div className='MegaDriveCheckBox'>
                                                <input className='' type='Checkbox'/>
                                                <span 
                                             onClick={()=>{
                                                 this.setState({
                                                     three: false
                                                 })
                                             }}>삭제</span>
                                            </div>


                                        </div>

                                        <div className='ProgressDiv'>
                                            <progress value="50" max="80" className='ProgressMegaDrive' />
                                        </div>

                                        <span className='StorageVolume'>50GB / 80GB</span>

                                    </div>
                                    
                                    <div className='ImageGrid'>
                                    <ImageGridDiv>
                                        <img src={Cat1}></img>
                                        <ImageGridName>고양이.jpeg</ImageGridName>
                                        </ImageGridDiv>
                                        <ImageGridDiv>
                                        <img src={Cat1}></img>
                                        <ImageGridName>고양이.jpeg</ImageGridName>
                                        </ImageGridDiv>
                                        <ImageGridDiv>
                                        <img src={Cat1}></img>
                                        <ImageGridName>고양이.jpeg</ImageGridName>
                                        </ImageGridDiv>
                                        <ImageGridDiv>
                                        <img src={Cat1}></img>
                                        <ImageGridName>고양이.jpeg</ImageGridName>
                                        </ImageGridDiv>
                                        <ImageGridDiv>
                                        <img src={Cat1}></img>
                                        <ImageGridName>고양이.jpeg</ImageGridName>
                                        </ImageGridDiv>
                                        <ImageGridDiv>
                                        <img src={Cat1}></img>
                                        <ImageGridName>고양이.jpeg</ImageGridName>
                                        </ImageGridDiv>
                                        <ImageGridDiv>
                                        <img src={Cat1}></img>
                                        <ImageGridName>고양이.jpeg</ImageGridName>
                                        </ImageGridDiv>
                                        <ImageGridDiv>
                                        <img src={Cat1}></img>
                                        <ImageGridName>고양이.jpeg</ImageGridName>
                                        </ImageGridDiv>
                                        <ImageGridDiv>
                                        <img src={Cat1}></img>
                                        <ImageGridName>고양이.jpeg</ImageGridName>
                                        </ImageGridDiv>
                                        <ImageGridDiv>
                                        <img src={Cat1}></img>
                                        <ImageGridName>고양이.jpeg</ImageGridName>
                                        </ImageGridDiv>
                                        <ImageGridDiv>
                                        <img src={Cat1}></img>
                                        <ImageGridName>고양이.jpeg</ImageGridName>
                                        </ImageGridDiv>
                                        <ImageGridDiv>
                                        <img src={Cat1}></img>
                                        <ImageGridName>고양이.jpeg</ImageGridName>
                                        </ImageGridDiv>
                                        <ImageGridDiv>
                                        <img src={Cat1}></img>
                                        <ImageGridName>고양이.jpeg</ImageGridName>
                                        </ImageGridDiv>
                                        <ImageGridDiv>
                                        <img src={Cat1}></img>
                                        <ImageGridName>고양이.jpeg</ImageGridName>
                                        </ImageGridDiv>
                                        <ImageGridDiv>
                                        <img src={Cat1}></img>
                                        <ImageGridName>고양이.jpeg</ImageGridName>
                                        </ImageGridDiv>
                                        <ImageGridDiv>
                                        <img src={Cat1}></img>
                                        <ImageGridName>고양이.jpeg</ImageGridName>
                                        </ImageGridDiv>
                                        <ImageGridDiv>
                                        <img src={Cat1}></img>
                                        <ImageGridName>고양이.jpeg</ImageGridName>
                                        </ImageGridDiv>
                                        
                                        
                                        

                                    </div>
                                    <div>트래픽 제한 612GB</div>
                                </div> : 
                                <div className='PlusButtonBox'>
                                    <div className="PlusButton"
                                        onClick={()=>{
                                            this.setState({
                                                three: true
                                            })
                                        }}>
                                        <AiOutlinePlusCircle size={80}></AiOutlinePlusCircle>
                                    </div>
                                
                                </div>}

                                

                            </div>


                        </div>
                    </div>
                </body>
            </html>

        )
    }
}

export default Main;