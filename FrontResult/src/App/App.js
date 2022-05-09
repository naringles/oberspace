import React, { Component, useState } from 'react';
import './A.css';
import { AiOutlineUser } from "react-icons/ai";
import { AiOutlineFolder } from "react-icons/ai";

import { AiOutlineSwap } from "react-icons/ai";

import { AiOutlineExclamationCircle } from "react-icons/ai";
import { AiOutlineDown } from "react-icons/ai";

import { BiMenu } from 'react-icons/bi'
import { AiOutlineCloud } from 'react-icons/ai'

import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';

import Main from '../Main/index';
import styled from 'styled-components'
class Rr extends Component {

  constructor(props) {
    super(props);
    this.state = {
        test: false,
        ShowGoogleDrive: true,
        ShowOneDrive: true,
        ShowMegaDrive: true
    };
}

    parentFunction = (data) => {
      console.log(data);
    }

    OneDriveShow = () => {
      this.setState({
        oneDriveShow: true
      })
    }

    OneDriveNotShow = () => {
      this.setState({
        oneDriveShow: false
      })
    }

    MegaDriveShow = () => {
      this.setState({
        MegaDriveShow: true
      })
    }

    MegaDriveNotShow = () => {
      this.setState({
        MeaDriveShow: false
      })
    }

    GoogleDriveChange = () => {
      this.setState({
        GoogleDriveShow: true
      })
      console.log('a')
      console.log(this.state.GoogleDriveShow)

    }



  testtrue = (data)=>{
    this.setState({
      test: data
    })
    console.log(data)
  }

  render(){
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Main
          test = {this.state.test} testtrue = {this.testtrue} parentFunction={this.parentFunction}
          ShowGoogleDrive ={this.state.ShowGoogleDrive}
          GoogleDriveChange ={this.GoogleDriveChange}
          ></Main>}></Route>
          <Route path="/a" element={<App
          test = {this.state.test}
          ShowGoogleDrive = {this.state.ShowGoogleDrive}
          ShowOneDrive = {this.state.ShowOneDrive}
          ShowMegaDrive = {this.state.ShowMegaDrive}
          ></App>}></Route>
      </Routes>
    
    </BrowserRouter>
  )
  }
}

const LeftMain = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
width: 45vw;
height: 100;
`

const MenuUserIcon = styled.div`
margin-top: 15vh;
background-color: #eeeeee;
border-radius: 15px;
`

class App extends Component {


  render() {
    return (
      <html>

      <body>
        <div className="Main">

          <div className="Left">
            <div className='MenuList'>
              <MenuUserIcon>
                <AiOutlineUser size="40" color='gray' className='AB'/>
              </MenuUserIcon>
              <Link to ="/">
              <BiMenu size="40" color='gray'/>
              </Link>
              <AiOutlineFolder size="40" color='gray'/>
              <AiOutlineSwap size="40" color='gray'/>
              <AiOutlineExclamationCircle size="40" color='gray'/>
              <span
              onClick={()=>{
                console.log(this.props.ShowGoogleDrive)
              }}
              > dd</span>
            </div>
            <LeftMain>
              <div className='UserIconBox'>
                <AiOutlineUser size="80" color='gray'/>
              </div>
              <span className='UserText'>USER</span>
              <div className='UserInformationBox'>
                <div>ID : kmu2022</div>
                <div>e-mail : kmu2022@naver.com</div>
              </div>

              <div className='ChangeInfor'>
                <span className='ChangeInforText'>정보 수정</span>
              </div>
              <div className='DeleteAccount'>
                <span className='DeleteAccountText'>계정 탈퇴</span>
              </div>
            </LeftMain>
          </div>

          <div className='Hr'></div>

          <div className="RightMain">
            <div className='Right1'>
              <span className='LinkedAccountText'>연결된 계정</span>
              <span className='AccountCareText'>계정 관리
              <AiOutlineDown size='12'/>
              </span>
            </div>


            {this.props.ShowGoogleDrive == true ? 
            <div className='CloudBox'>

            <div className='CloudBoxUp'>
              <div className=''>
                <AiOutlineCloud size='40'/>
              </div>

              <div className='CloudBoxUpText'>
                <span className='GoogleDriveText'>google drive</span>
                <span>string</span>
              </div>


            </div>

            <div className='ProgressDiv'>
              <progress value="50" max="80" className='Progress'/>
            </div>

            <span className='StorageVolume'>50GB / 80GB</span>

          </div>
            :
            
            null}
            

            {this.props.ShowOneDrive == true ? 
            <div className='CloudBox'>

            <div className='CloudBoxUp'>
              <div className=''>
                <AiOutlineCloud size='40'/>
              </div>

              <div className='CloudBoxUpText'>
                <span className='GoogleDriveText'>One drive</span>
                <span>string</span>
              </div>


            </div>

            <div className='ProgressDiv'>
              <progress value="50" max="80" className='OneDriveProgress'/>
            </div>

            <span className='StorageVolume'>50GB / 80GB</span>

          </div>
            : null}

          {this.props.ShowMegaDrive == true ? 
            <div className='CloudBox'>

            <div className='CloudBoxUp'>
              <div className=''>
                <AiOutlineCloud size='40'/>
              </div>

              <div className='CloudBoxUpText'>
                <span className='GoogleDriveText'>Mega drive</span>
                <span>string</span>
              </div>


            </div>

            <div className='ProgressDiv'>
              <progress value="50" max="80" className='MegaDriveProgress'/>
            </div>

            <span className='StorageVolume'>50GB / 80GB</span>

          </div>
            : null}
            

          </div>
        </div>
      </body>
      </html>

    )
  }
}

export default Rr;
