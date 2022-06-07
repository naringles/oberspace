import React, {useState,Component} from 'react';
import './Compare.css';
import { AiFillLock,AiOutlineUser} from "react-icons/ai";
import {Route, Link} from 'react-router-dom';
import { BiMenu } from "react-icons/bi";
import { AiOutlineFolder } from "react-icons/ai";
import { AiOutlineExclamationCircle } from "react-icons/ai";

import styled from "styled-components";

const MenuUserIcon = styled.div`
  margin-top: 15vh;
  background-color: #eeeeee;
  border-radius: 15px;
`;

class Compare extends Component {
render() {
  return (
    <div className="MenuList">
    <div className="Logo">
      <img className="L5" src={require("../LogoImage.jpeg")} />
    </div>
    <Link to ="/a">
      <div className='MenuUserIcon'>
        <AiOutlineUser size="40" color='gray' className='AB' />
      </div>
    </Link>

    <Link to="/">
      <BiMenu size="40" color="gray" />
    </Link>

    <AiOutlineFolder size="40" color="gray" />

    <div className='MenuExclam'>
      <AiOutlineExclamationCircle size="40" color='gray' className='AB' />
    </div>

    <span
      onClick={() => {
        console.log(this.props.ShowGoogleDrive);
      }}
    >
      {" "}
    </span>
  </div>
  );
};
}
export default Compare;
