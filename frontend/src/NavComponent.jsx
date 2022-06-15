import React, { useContext, useState, useEffect } from "react";
import HighlightIcon from "@material-ui/icons/Highlight";
import classNames from "classnames";
import ExitToAppTwoToneIcon from "@material-ui/icons/ExitToAppTwoTone";
import { LoginContext } from "./LoginContext";
import { FilesContext } from "./FilesRepo";
import { SearchContext, DarkContext } from "./SearchContext";
import HomeIcon from "@material-ui/icons/Home";
import {
  Container,
  Navbar,
  Nav,
  Form,
  Button,
  NavDropdown,
} from "react-bootstrap";
import logo from "../oneStorage.png";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

const NavComponent = (props) => {
  const [loggedIn, setLoggedIn] = useContext(LoginContext);
  const { searchVal, setSearchVal } = useContext(SearchContext);
  const { files, setFiles } = useContext(FilesContext);
  const navBranImgClass = classNames("d-inline-block", "align-top");
  const customSwitchClass = classNames(
    "custom-control",
    "custom-switch",
    "darkMode"
  );
  const homeRoute = "/user/home/" + loggedIn.username;
  // const userDetailsRoute="/"+loggedIn.type+"/userDetails";
  // const merchantDetailsRoute="/"+loggedIn.type+"/merchantDetails";
  const headerPadding = {
    paddingLeft: "10rem",
  };

  // console.log("userDetailsRoute: ",userDetailsRoute);

  const [value, setValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const { darkMode, setDarkMode } = useContext(DarkContext);
  const changeMode = () => {
    setDarkMode(!darkMode);
  };
  useEffect(() => {
    console.log("dark mode: ", darkMode);
    if (darkMode) {
      var elements = document.querySelectorAll(
        "body,.card,.list-group-item,.tooltiptext"
      );
      elements.forEach((element) => {
        element.style.backgroundColor = "#000";
        element.style.color = "#fff";
      });
      document.querySelector(".footerComp").style.color = "#fff";
    } else {
      var elements = document.querySelectorAll(
        "body,.card,.list-group-item,.tooltiptext"
      );
      elements.forEach((element) => {
        element.style.backgroundColor = "#fff";
        element.style.color = "#000";
        document.querySelector(".footerComp").style.color = "#000";
      });
    }
  }, [darkMode]);

  // console.log("body color:", );

  return (
    <Navbar variant="dark" expand="lg" sticky="top">
      <Navbar.Brand href={homeRoute}>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <div className={customSwitchClass}>
            <input
              type="checkbox"
              onChange={changeMode}
              className="custom-control-input"
              id="customSwitch1"
            />
            <label className="custom-control-label" htmlFor="customSwitch1">
              {darkMode ? <span>다크 모드</span> : <span>라이트 모드</span>}
            </label>
          </div>
        </Nav>

        <Nav className="ml-auto">
          <Autocomplete
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
              setSearchVal(newValue);
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            id="free-solo-demo"
            clearOnEscape
            clearOnBlur
            freeSolo
            label="Search"
            options={files.map((file) => file.fileName)}
            style={{ width: "100%", height: "10%" }}
            renderInput={(params) => (
              <TextField
                {...params}
                style={{ background: "white", width: "40vw" }}
                variant="outlined"
                placeholder="Search Files"
              />
            )}
          />
        </Nav>

        <Nav className="ml-auto" >
          <Nav.Link href="/user/auth/logout" onClick={props.clearSession}>
            Logout <ExitToAppTwoToneIcon style={{ fill: "white" }} />
          </Nav.Link>
         
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavComponent;
