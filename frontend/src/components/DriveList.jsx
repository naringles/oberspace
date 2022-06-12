import React, { useState, useEffect,useContext } from "react";
import axios from "axios";
import {useHistory} from "react-router-dom";
import {LoginContext} from "./LoginContext";
import {DrivesContext,DriveDeleteContext} from "./DrivesRepo";
import {FilesContext} from "./FilesRepo";
import FolderChoices from "./FolderChoices";
import {SearchContext} from "./SearchContext";
import Progress from "./UploadProgressBar";
import _ from 'lodash';
import {ProgressBar, Card}  from 'react-bootstrap';
import {FaGoogleDrive,FaDropbox} from "react-icons/fa";
import {GrOnedrive} from "react-icons/gr";
import DeleteIcon from '@material-ui/icons/Delete';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

function DriveList({ match }) {
  let history = useHistory();
  const [loggedIn, setLoggedIn] = useContext(LoginContext);
  const {drives, setDrives} = useContext(DrivesContext);
  const {driveDeleted,setDriveDeleted} = useContext(DriveDeleteContext);
  const [driveUsage, setDriveUsage] = useState({});
  const [driveUsagePct, setDriveUsagePct] = useState();
  const [driveTypes, setDriveTypes] = useState({googleDrive:"",oneDrive:"",dropbox:""});
  const [driveExpand, setDriveExpand] = useState("");
  useEffect(() => {
    if(drives.length>0){
    setDriveUsage(drives.map(drive=>  ({usage:parseFloat(drive.storageUsage),limit:parseFloat(drive.storageLimit)})).reduce((x,y)=>({usage:x.usage+y.usage,limit:x.limit+y.limit})));    
    setDriveTypes({googleDrive:drives.filter(drive => drive.storageType==="googleDrive").length,
    oneDrive:drives.filter(drive => drive.storageType==="oneDrive").length,
    dropbox:drives.filter(drive => drive.storageType==="dropbox").length});
    }

  },[drives])

useEffect(() => {
  setDriveUsagePct((driveUsage.usage/driveUsage.limit)*100);    
  },[driveUsage])
  
const handleSelect =(event)=>{
  if(driveExpand.length===0)  
  setDriveExpand(event.target.attributes.getNamedItem("name").value);
  else
  setDriveExpand("");
}

const handleDelSubmit = (driveIdDelete) => {
  confirmAlert({
    title: 'Confirm to Delete',
    message: 'Are you sure to delete this drive.',
    buttons: [
      {
        label: 'Yes',
        onClick: () => handleDelete(driveIdDelete)
      },
      {
        label: 'No',
        onClick: () => null
      }
    ]
  });
};

const handleDelete = (driveId,driveType,event)=>{ 
      
       console.log("id to delete: ",driveId);
  
  axios
  .post('/action/drive/delete', {driveIdDelete:driveId})
  .then((resp)=>
  {
      if(resp.data.success)
      {
        setDrives(drives.filter(drive=>drive.id !==driveId));
        window.location.reload();
      }
      setDriveDeleted({status:resp.data.success,message:resp.data.message});
      setTimeout(()=> setDriveDeleted({status:false,message:""}),10000);
  })
  .catch(err => {
    console.error(err);
  });
  
  
  
}
  return (
    <div>
    <div className="row">
    <div className="col"  style={{padding:"0% 0% 1% 2%",margin:"0% 2% 1% 5%"}}>
    <FolderChoices/>
    </div>
    </div>
    <div className="row">
    <div className="col" style={{padding:"0% 0% 1% 2%",margin:"0% 2% 1% 5%"}}>
    <Card>
    <div className="cardHeader"><Card.Header>Storage Info</Card.Header></div>
    <Card.Body style={{padding:"2% 1% 0% 2%"}}>
    <Card.Title>
    {driveUsagePct >= 90 ? <ProgressBar now={driveUsagePct} variant="danger"  label={`${((driveUsage.usage/driveUsage.limit)*100).toFixed(2)}%`}/>:
     driveUsagePct >= 75 ? <ProgressBar now={driveUsagePct} variant="warning"  label={`${((driveUsage.usage/driveUsage.limit)*100).toFixed(2)}%`}/>:
     <ProgressBar style={{width:"15vw"}} now={driveUsagePct} variant="success"  label={`${((driveUsage.usage/driveUsage.limit)*100).toFixed(2)}%`}/>} 
    </Card.Title>      
      <p>Total Limit : {(driveUsage.limit/(1024*1024*1024)).toFixed(2)} GB</p>
      <p>Total Usage : {(driveUsage.usage/(1024*1024*1024)).toFixed(2)} GB</p>    
      </Card.Body>     
    </Card>
    </div>
    </div>


    <div className="row">
    <div className="col"  style={{padding:"0% 0% 1% 2%",margin:"0% 2% 1% 5%"}}>
    <Card>
    <div className="cardHeader"><Card.Header>Drives Info</Card.Header></div>
    <Card.Body style={{padding:"0% 1% 0% 2%"}}>
    <div className="list-group">
     <ul>
    
      <li onClick={handleSelect} className="list-group-item" name="googleDrive"> <FaGoogleDrive/> : {driveTypes.googleDrive} drives added </li>
      <li onClick={handleSelect} className="list-group-item" name="oneDrive"> <GrOnedrive/> : {driveTypes.oneDrive} drive{parseInt(driveTypes.oneDrive)>1 && "s"} added </li>     
      <li onClick={handleSelect} className="list-group-item" name="dropbox"> <FaDropbox/> : {driveTypes.dropbox} drive{parseInt(driveTypes.dropbox)>1 && "s"} added </li>
      {driveExpand.length>0 ? 
      <div className="driveList" style={{marginTop:"5%"}}>
      <h5>{driveExpand}(s)</h5>
        {drives.filter(drive=>drive.storageType===driveExpand).map((drive)=>(
          <ol key={drive.id} style={{fontSize:"smaller"}}>
          <li style={{padding:"0",margin:"0"}} className="list-group-item">  {drive.email}<br/> 
          <Progress percentage={(Math.round(parseInt(drive.storageUsage)/parseFloat(drive.storageLimit)*10000)/100)} />          
          <button className="fileDelete" onClick={(e)=>handleDelSubmit(drive.id,e)}> <DeleteIcon/></button>
          </li>
          </ol>
          
        ))}
      
      </div>
      :null
      }
     </ul>
     </div>

    </Card.Body>     
    </Card>
    </div>

    </div>
    </div>

  );
}

export default DriveList;
