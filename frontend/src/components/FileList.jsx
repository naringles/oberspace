import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { LoginContext } from "./LoginContext";
import { DrivesContext } from "./DrivesRepo";
import { FilesContext } from "./FilesRepo";
import { SearchContext, FilterContext } from "./SearchContext";
import _ from "lodash";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import ClearIcon from "@material-ui/icons/Clear";
import { Card } from "react-bootstrap";
import classNames from "classnames";
import DeleteIcon from "@material-ui/icons/Delete";

function FileList({ match }) {
  const { searchVal, setSearchVal } = useContext(SearchContext);
  const { filterVal, setFilterVal } = useContext(FilterContext);
  let history = useHistory();
  if (window.location.hash === "#_=_") {
    history.replaceState
      ? history.replaceState(null, null, window.location.href.split("#")[0])
      : (window.location.hash = "");
  }
  const { drives, setDrives } = useContext(DrivesContext);
  const { files, setFiles } = useContext(FilesContext);
  const [fileList, setFileList] = useState(files);
  const [loggedIn, setLoggedIn] = useContext(LoginContext);
  const [markers, setMarkers] = useState({ start: 0, end: 10 });
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
  const toolTipClasses = classNames("");

  const [visibleArray, setVisibleArray] = useState(
    fileList.slice(markers.start, markers.end)
  );
  useEffect(() => {
    console.log("visible array refresh due to marker");
    setVisibleArray(fileList.slice(markers.start, markers.end));
  }, [markers]);

  useEffect(() => {
    console.log("marker refresh on new files arrival");
    setMarkers({ start: 0, end: 10 });
  }, [fileList]);

  useEffect(() => {
    if (searchVal !== null) {
      console.log("search val : ", searchVal);
      setVisibleArray(fileList.filter((file) => file.fileName === searchVal));
    } else {
      console.log("search val is null");
      setVisibleArray(fileList.slice(markers.start, markers.end));
    }
  }, [searchVal]);

  useEffect(() => {
    if (filterVal !== "") {
      setFileList(files.filter((file) => file.fileFolderType === filterVal));
    } else {
      setFileList(files);
    }
  }, [filterVal, files]);

  const clearFilter = () => {
    setFilterVal("");
  };

  const goPrev = () => {
    if (markers.start >= 10) {
      setMarkers({ start: markers.start - 10, end: markers.end - 10 });
    }
  };
  const goNext = () => {
    if (markers.end <= fileList.length - 10) {
      setMarkers({ start: markers.start + 10, end: markers.end + 10 });
    }
  };
  const [delFileConf, setDelFileConf] = useState(-1);
  const handleDelete = (fId, fName, folderType, event) => {
    axios
      .post("/action/file/delete", {
        id: fId,
        folderType: folderType,
        name: fName,
      })
      .then((resp) => {
        console.log("Resp data: ", resp.data);
        if (resp.data.success) {
          setFiles(files.filter((file) => file.fileId !== fId));
        }
      })
      .then(() => {
        setDelFileConf(-1);
      })

      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <Card>
      <div className="cardHeader">
        <Card.Header>
          
          <div style={{right: "4%", top: "2%", float: "right" }}>
            <button className="prevIconB" onClick={goPrev}>
              <SkipPreviousIcon />
            </button>{" "}
            <button className="nextIconB" onClick={goNext}>
              <SkipNextIcon />
            </button>
          </div>
          Files
          {filterVal !== "" ? (
            <div style={{left: "15%", top: "4%"}}>
              <span>
                File Type : {filterVal}{" "}
                <button
                  className="fileFilter"
                  title="clear"
                  onClick={clearFilter}
                >
                  <ClearIcon />
                </button>
              </span>
            </div>
          ) : null}
        </Card.Header>
      </div>
      <Card.Body className="fileList">
        <div className="list-group">
          <ul>
            {visibleArray.map((file, index) => (
              <div key={file.fileId} className="fileRow">
                <div className="row">
                  <div className="col-md-10">
                    <a href={file.webViewLink}>
                      {file.fileName}
                      {file.size !== undefined ? (
                        <span className="tooltiptext">
                          {(file.size / (1024 * 1024)).toFixed(3)} MB{" "}
                        </span>
                      ) : null}
                    </a>
                  </div>
                  <div className="col-md-2">
                    {delFileConf === index ? (
                      <div>
                        <button
                          className="btn btn-danger"
                          onClick={(e) =>
                            handleDelete(
                              file.fileId,
                              file.fileName,
                              file.fileFolderType,
                              e
                            )
                          }
                        >
                          {" "}
                          확인
                        </button>{" "}
                        <br /> <br />{" "}
                        <button
                          className="btn btn-success"
                          onClick={() => setDelFileConf(-1)}
                        >
                          {" "}
                          취소
                        </button>
                      </div>
                    ) : (
                      <button
                        className="fileDelete"
                        onClick={() => setDelFileConf(index)}
                      >
                        {" "}
                        <DeleteIcon />
                      </button>
                    )}
                  </div>
                  {/* </li> */}
                </div>
              </div>
            ))}
          </ul>
          <div
            className="row"
            style={{ position: "absolute", right: "1%", bottom: "-5%" }}
          ></div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default FileList;
