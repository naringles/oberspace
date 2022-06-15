import React, { useContext, useState, useEffect } from "react";
import HighlightIcon from "@material-ui/icons/Highlight";
import classNames from "classnames";
import { LoginContext } from "./LoginContext";
import { DarkContext } from "./SearchContext";

import HomeIcon from "@material-ui/icons/Home";
import NavComponent from "./NavComponent";
import logo from "../oneStorage.png";
import { Navbar, Nav, Form, Button, NavDropdown } from "react-bootstrap";
function Header() {
  const [loggedIn, setLoggedIn] = useContext(LoginContext);

  const navBranImgClass = classNames("d-inline-block", "align-top");
  const customSwitchClass = classNames(
    "custom-control",
    "custom-switch",
    "darkMode"
  );
  const homeRoute = "/";
  const { darkMode, setDarkMode } = useContext(DarkContext);

  const changeMode = () => {
    setDarkMode(!darkMode);
  };
  useEffect(() => {
    if (darkMode) {
      var elements = document.querySelectorAll("body,.card,.list-group-item");
      elements.forEach((element) => {
        element.style.backgroundColor = "#000";
        element.style.color = "#fff";
      });
    } else {
      var elements = document.querySelectorAll("body,.card,.list-group-item");
      elements.forEach((element) => {
        element.style.backgroundColor = "#fff";
        element.style.color = "#000";
      });
    }
  }, [darkMode]);

  const clearSession = () => {
    setLoggedIn({ username: "", status: false });
    sessionStorage.clear();
  };

  return (
    <header>
      {loggedIn.status ? (
        <NavComponent clearSession={clearSession} />
      ) : (
        <Navbar variant="dark" sticky="top">
          <Navbar.Brand href={homeRoute}>
          </Navbar.Brand>
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
        </Navbar>
      )}
    </header>
  );
}

export default Header;
