import React, {useState,createContext,useMemo,useEffect} from "react";

export const DrivesContext=createContext();

export const DrivesProvider = props => {
    const localState = JSON.parse(sessionStorage.getItem("drives"));

    const [drives, setDrives] = useState(localState || []);
    
    useEffect(() => {
        sessionStorage.setItem("drives", JSON.stringify(drives));
    }, [drives]);

    const value=useMemo(()=>({drives, setDrives}));

    return (
        <DrivesContext.Provider value={value}>
        {props.children}
        </DrivesContext.Provider>
    );
};


export const DriveDeleteContext=createContext();

export const DriveDeleteProvider = props => {
    
    const [driveDeleted,setDriveDeleted] = useState({status:false,message:""});
    const value=useMemo(()=>({driveDeleted,setDriveDeleted}));

    return (
        <DriveDeleteContext.Provider value={value}>
        {props.children}
        </DriveDeleteContext.Provider>
    );
};
