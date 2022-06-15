import React, { useContext } from "react";
import { LoginContext } from "./LoginContext";
import {
  Container,
  Navbar,
  Nav,
  Form,
  Button,
  NavDropdown,
} from "react-bootstrap";
function Footer() {
  const year = new Date().getFullYear();
  const [loggedIn, setLoggedIn] = useContext(LoginContext);
  const homeRoute = "/user/home/" + loggedIn.username;
  return (
    <Navbar
      style={{
        background: "none",
        height: "5vh",
        margin: "5% 0 0 0",
        padding: "1.5% 0 0.5% 0",
      }}
      expand="lg"
      sticky="bottom"
    >
      <Nav className="ml-auto mr-auto">
        <Navbar.Brand href={homeRoute}>
          <p style={{ fontSize: "medium" }} className="footerComp">
            Copyright ⓒ {year}
          </p>
        </Navbar.Brand>
      </Nav>
    </Navbar>
  );
}

export default Footer;
