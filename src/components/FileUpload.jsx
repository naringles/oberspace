import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { LoginContext } from "./LoginContext";

import { FilesContext } from "./FilesRepo";
import Progress from "./UploadProgressBar";
import { Modal } from "react-bootstrap";
function FileUpload(props) {
  console.log("props.show is :", props.show);
  const [loggedIn, setLoggedIn] = useContext(LoginContext);
  const { files, setFiles } = useContext(FilesContext);
  const [upFiles, setUpFiles] = useState([]);
  const [fileNames, setFileNames] = useState(["Choose Files(s)"]);
  const [uploadPct, setUploadPct] = useState(0);
  const [show, setShow] = useState(props.show);
  const [messages, setMessage] = useState(["Note:"]);
  const handleClose = () => {
    setShow(false);
    props.handleClose();
    setMessage(["Note: "]);
    setFileNames(["Choose Files(s)"]);
    setUpFiles([]);
  };
  const handleChange = (e) => {
    setMessage(["Note: "]);
    setUpFiles(e.target.files);
    setFileNames([...e.target.files].map((file) => file.name));
  };
  useEffect(() => {
    fileNames.map((fname) => {
      files.map((file) => {
        if (file.fileName === fname) {
          setMessage((prevMsg) => [
            ...new Set([
              ...prevMsg,
              `A file with ${fname} already exists, do you want upload this again?`,
            ]),
          ]);
        }
      });
    });
  }, [fileNames]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("files: ", upFiles);
    console.log("file names: ", fileNames);

    const formData = new FormData();
    for (var i = 0; i < upFiles.length; i++) {
      let upFile = upFiles.item(i);
      formData.append("file", upFile);
    }
    // formData.append('uploadFiles', files);
    // });
    console.log("formData: ", formData);

    try {
      const res = await axios.post("/action/upload/multiple", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          setUploadPct(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );
          setTimeout(() => setUploadPct(0), 10000);
        },
      });

      // const { fileName, filePath } = res.data;

      // setUploadedFile({ fileName, filePath });

      console.log("File Uploaded : ", res.data);
      setFileNames(["Choose Files(s)"]);
      setUpFiles([]);
      setMessage(["Note: "]);
    } catch (err) {
      // if (err.response.status === 500) {
      console.log("There was a problem with the server");
      // } else {
      console.log(err.response.data.msg);
      // }
    }
  };
  useEffect(() => {
    setShow(props.show);
  }, [props.show]);

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>업로드할 파일을 선택해 주세요.</Modal.Title>
      </Modal.Header>

      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="custom-file mb-4">
            <input
              type="file"
              className="custom-file-input"
              id="customFile"
              onChange={handleChange}
              multiple
            />
            <label
              style={{ overflowY: "hidden" }}
              className="custom-file-label"
              htmlFor="customFile"
            >
              {fileNames.map((fName, index) => (
                <span key={index}>{fName} </span>
              ))}
            </label>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {messages.length > 1 ? (
            <div
              style={{
                backgroundColor: "#440c05",
                color: "#fff",
                padding: "2%",
              }}
            >
              {messages.map((msg, index) => (
                <p key={index}>{msg}</p>
              ))}
            </div>
          ) : null}
          <Progress percentage={uploadPct} />
          <input
            type="submit"
            value="Upload"
            className="btn btn-primary btn-block mt-4"
          />
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default FileUpload;
