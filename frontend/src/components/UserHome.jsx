import React, { useState, useEffect, useContext, Component } from "react";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { LoginContext } from "./LoginContext";
import { DrivesContext, DriveDeleteContext } from "./DrivesRepo";
import { DarkContext } from "./SearchContext";
import { FilesContext } from "./FilesRepo";
import FileList from "./FileList";
import DriveList from "./DriveList";
import AddDrives from "./AddDrives";
import FileUpload from "./FileUpload";
import classNames from "classnames";
import _ from "lodash";
import sockIO from "socket.io-client";

function Home({ match }) {
  const backEndPort = "http://localhost:3000";
  // let backEndPort;
  // if (process.env.NODE_ENV === "production") {
  //   backEndPort = "https://desolate-bastion-47247.herokuapp.com/";
  // } else {
  //   backEndPort = "http://localhost:3000";
  // }

  const customSwitchClass = classNames("custom-control", "custom-switch");
  const mimeSuffixName = [
    "octet-stream",
    "vnd.google-apps.spreadsheet",
    "vnd.google-apps.document",
    "vnd.google-apps.presentation",
    "pdf",
  ];
  const mimeSuffixValue = [
    "Plain",
    "Spreadsheet",
    "WordDocument",
    "PowerPoint",
    "PDF",
  ];
  const mimeSuffixMappings = new Object();

  useEffect(() => {
    mimeSuffixName.forEach((item, index) => {
      mimeSuffixMappings[item] = mimeSuffixValue[index];
    });
  }, []);

  useEffect(() => {
    let socketIO;
    console.log("environment :", process.env.NODE_ENV);
    // if (process.env.NODE_ENV === "production") {
    //   socketIO = sockIO.connect();
    // } else {
    //   socketIO = sockIO.connect(backEndPort);
    // }
    socketIO = sockIO.connect(backEndPort);
    console.log("socket is :", socketIO);
    socketIO.on("oneDriveFiles", function (data) {
      console.log(
        "Incoming onedriveFiles:",
        data.files.filter(
          (file) =>
            new Date(file.createdAt) >=
            new Date(JSON.parse(sessionStorage.lastFetchDt))
        )
      );
      // console.log("lastFetchedDt",JSON.parse(sessionStorage.getItem("lastFetchDt")));
      setFiles((oldFiles) =>
        _.unionBy(
          data.files.filter(
            (file) =>
              new Date(file.createdAt) >=
              new Date(JSON.parse(sessionStorage.lastFetchDt))
          ),
          oldFiles,
          "fileId"
        )
      );
    });
    socketIO.on("dbxFiles", function (data) {
      console.log(
        "Incoming dbxFiles:",
        data.files.filter(
          (file) =>
            new Date(file.createdAt) >=
            new Date(JSON.parse(sessionStorage.lastFetchDt))
        )
      );
      // console.log("last fetch dt",JSON.parse(sessionStorage.lastFetchDt));
      setFiles((oldFiles) =>
        _.unionBy(
          data.files.filter(
            (file) =>
              new Date(file.createdAt) >=
              new Date(JSON.parse(sessionStorage.lastFetchDt))
          ),
          oldFiles,
          "fileId"
        )
      );
    });
    socketIO.on("googleFiles", function (data) {
      console.log(
        "Incoming googleFiles:",
        data.files.filter(
          (file) =>
            new Date(file.createdAt) >=
            new Date(JSON.parse(sessionStorage.lastFetchDt))
        )
      );
      setFiles((oldFiles) =>
        _.unionBy(
          data.files.filter(
            (file) =>
              new Date(file.createdAt) >=
              new Date(JSON.parse(sessionStorage.lastFetchDt))
          ),
          oldFiles,
          "fileId"
        )
      );
    });
  }, []);

  let history = useHistory();
  // if (window.location.hash === "#_=_") {
  //   history.replaceState
  //     ? history.replaceState(null, null, window.location.href.split("#")[0])
  //     : (window.location.hash = "");
  // }

  const [driveAdded, setDriveAdded] = useState({
    status: false,
    type: "",
    email: "",
    message: "",
  });
  const { driveDeleted, setDriveDeleted } = useContext(DriveDeleteContext);
  const { darkMode, setDarkMode } = useContext(DarkContext);

  useEffect(() => {
    const queryString = window.location.search;
    console.log("queryString:", queryString);
    if (typeof queryString !== undefined && queryString !== "") {
      const urlParams = new URLSearchParams(queryString);
      if (urlParams.get("success") === "true") {
        console.log("status is: ", urlParams.get("success"));
        console.log("attempt is: ", urlParams.get("attempt"));
        console.log("message : ", urlParams.get("message"));

        if (urlParams.get("attempt").includes("add")) {
          console.log("new Drive is: ", urlParams.get("newDrive"));
          console.log("new Drive type is: ", urlParams.get("newDriveType"));
          setDriveAdded({
            status: true,
            type: urlParams.get("newDriveType"),
            email: urlParams.get("newDrive"),
            message: urlParams.get("message"),
          });
        }
      } else {
        console.log("status is: ", urlParams.get("success"));
        console.log("status is: ", urlParams.get("attempt"));
        console.log("message : ", urlParams.get("message"));
        if (urlParams.get("attempt").includes("add")) {
          setDriveAdded({
            status: false,
            type: "NA",
            email: "NA",
            message: urlParams.get("message"),
          });
        }
      }
      setTimeout(
        () =>
          setDriveAdded({ status: false, type: "", email: "", message: "" }),
        10000
      );
      window.history.replaceState({}, null, window.location.href.split("?")[0]);
    }
    console.log("dark mode: ", darkMode);
    if (darkMode) {
      var elements = document.querySelectorAll(
        "body,.card,.list-group-item,.tooltiptext"
      );
      elements.forEach((element) => {
        element.style.backgroundColor = "#000";
        element.style.color = "#fff";
      });
    } else {
      var elements = document.querySelectorAll(
        "body,.card,.list-group-item,.tooltiptext"
      );
      elements.forEach((element) => {
        element.style.backgroundColor = "#fff";
        element.style.color = "#000";
      });
    }

    console.log("dark mode: ", darkMode);
    if (darkMode) {
      var elements = document.querySelectorAll(
        "body,.card,.list-group-item,.tooltiptext"
      );
      elements.forEach((element) => {
        element.style.backgroundColor = "#000";
        element.style.color = "#fff";
      });
    } else {
      var elements = document.querySelectorAll(
        "body,.card,.list-group-item,.tooltiptext"
      );
      elements.forEach((element) => {
        element.style.backgroundColor = "#fff";
        element.style.color = "#000";
      });
    }
  }, []);

  const { drives, setDrives } = useContext(DrivesContext);

  const { files, setFiles } = useContext(FilesContext);

  const [loggedIn, setLoggedIn] = useContext(LoginContext);
  const [showUpload, setShow] = useState(false);
  console.log(" user home page");
  // const { params: { userName } = {} } = match;
  useEffect(() => {
    axios
      .get("/user/data/read", { withCredentials: true })
      .then(async (response) => {
        sessionStorage.setItem("lastFetchDt", JSON.stringify(new Date()));
        if (response.data.success) {
          console.log("response: ", response.data);
          if (response.data.drives.length > 0) {
            setDrives(response.data.drives);
            // console.log("files received:",response.data.drives.map(({ files }) => files).flat());
            setFiles(
              response.data.drives
                .map(({ files }) => files)
                .flat()
                .sort(function (a, b) {
                  return new Date(b.createdAt) - new Date(a.createdAt);
                })
                .map((file) => {
                  if (file.fileFolderType.includes("undefined")) {
                    let mimeSuffArr = file.mimeType.split("/");
                    let mimeSuff = mimeSuffArr[
                      mimeSuffArr.length - 1
                    ].toLowerCase();

                    if (typeof mimeSuffixMappings[mimeSuff] !== "undefined") {
                      file.fileFolderType = mimeSuffixMappings[mimeSuff];
                    } else {
                      file.fileFolderType = "Others";
                    }
                  }
                  return file;
                })
            );
          } else {
            setDrives([]);
          }
        } else {
          history.push("/");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const triggerUpload = () => {
    setShow(true);
  };
  const handleUploadModalClose = () => {
    setShow(false);
  };
  return (
    <div>
      <Header />

      {loggedIn.status && (
        <div className="container-fluid">
          <div className="row" style={{ paddingTop: "2%" }}>
            <div className="col-sm-2" style={{ padding: "0" }}>
              <DriveList />
            </div>
            <div className="col-sm-8">
              <FileList />
              <br />
              {driveAdded.status ? (
                <p
                  style={{
                    backgroundColor: "green",
                    color: "#fff",
                    fontSize: "medium",
                    margin: "2%",
                    padding: "2%",
                  }}
                >
                  {" "}
                  {driveAdded.type} drive ({driveAdded.email}) added
                  successfully
                </p>
              ) : driveAdded.message.length > 0 ? (
                <p
                  style={{
                    backgroundColor: "red",
                    color: "#fff",
                    fontSize: "medium",
                    margin: "2%",
                    padding: "2%",
                  }}
                >
                  {" "}
                  {driveAdded.message}
                </p>
              ) : null}
              <br />
              {driveDeleted.status ? (
                <p
                  style={{
                    backgroundColor: "green",
                    color: "#fff",
                    fontSize: "medium",
                    margin: "2%",
                    padding: "2%",
                  }}
                >
                  {" "}
                  Drive removed successfully
                </p>
              ) : driveDeleted.message.length > 0 ? (
                <p
                  style={{
                    backgroundColor: "red",
                    color: "#fff",
                    fontSize: "medium",
                    margin: "2%",
                    padding: "2%",
                  }}
                >
                  {" "}
                  {driveDeleted.message}
                </p>
              ) : null}
            </div>
            <div className="col-sm-2">
              <AddDrives />
              <div className="cardHeader" style={{ marginTop: "2%" }}>
                <button className="uploadButton" onClick={triggerUpload}>
                  {" "}
                  Upload File
                </button>
              </div>
              <FileUpload
                show={showUpload}
                handleClose={handleUploadModalClose}
              />
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Home;
