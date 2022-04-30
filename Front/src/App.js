import React, { Component } from 'react';
import './A.css';
import { AiOutlineUser } from "react-icons/ai";
import { AiOutlineFolder } from "react-icons/ai";

import { AiOutlineSwap } from "react-icons/ai";

import { AiOutlineExclamationCircle } from "react-icons/ai";
import { AiOutlineDown } from "react-icons/ai";

import { BiMenu } from 'react-icons/bi'
import { AiOutlineCloud } from 'react-icons/ai'


class App extends Component {
  render() {
    return (
      <html>

      <body>
        <div className="Main">

          <div className="Left">
            <div className='MenuList'>
              <div className='MenuUserIcon'>
                <AiOutlineUser size="40" color='gray' className='AB'/>
              </div>
              <BiMenu size="40" color='gray'/>
              <AiOutlineFolder size="40" color='gray'/>
              <AiOutlineSwap size="40" color='gray'/>
              <AiOutlineExclamationCircle size="40" color='gray'/>

            </div>
            <div className='LeftMain'>
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
            </div>
          </div>

          <div className='Hr'></div>

          <div className="RightMain">
            <div className='Right1'>
              <span className='LinkedAccountText'>연결된 계정</span>
              <span className='AccountCareText'>계정 관리
              <AiOutlineDown size='12'/>
              </span>
            </div>

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

          </div>
        </div>
      </body>
      </html>

    )
  }
}

export default App;
