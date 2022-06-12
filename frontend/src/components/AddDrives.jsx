import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { LoginContext } from "./LoginContext";
import { DrivesContext } from "./DrivesRepo";
import { FilesContext } from "./FilesRepo";
import { SearchContext } from "./SearchContext";
import _ from "lodash";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import { Card } from "react-bootstrap";
import { FaGoogleDrive, FaDropbox } from "react-icons/fa";
import { GrOnedrive } from "react-icons/gr";
function AddDrives({ match }) {
  const [loggedIn, setLoggedIn] = useContext(LoginContext);
  return (
    <Card>
      <div className="cardHeader">
        <Card.Header>Add Drives</Card.Header>
      </div>

      <div className="addDrive">
        <Card.Body>
          <ul>
            <li style={{ borderRight: "1px solid rgb(68, 67, 67)" }}>
              {" "}
              <a title="Google Drive" href="/user/add/google">
                <FaGoogleDrive />
              </a>
            </li>
            <li style={{ borderRight: "1px solid rgb(68, 67, 67)" }}>
              {" "}
              <a title="One Drive" href="/user/add/ms">
                <GrOnedrive />
              </a>
            </li>
            <li>
              {" "}
              <a title="Dropbox" href="/user/add/db">
                <FaDropbox />
              </a>
            </li>
          </ul>
        </Card.Body>
      </div>
    </Card>
  );
}

export default AddDrives;
