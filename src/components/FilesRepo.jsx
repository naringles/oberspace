import React, {useState,createContext,useMemo,useEffect} from "react";

export const FilesContext=createContext();

export const FilesProvider = props => {
    const localState = JSON.parse(localStorage.getItem("files"));
    
    const [files, setFiles] = useState(localState || []);
    
    useEffect(() => {
        localStorage.setItem("files", JSON.stringify(files));

    }, [files]);

    const value=useMemo(()=>({files, setFiles}));

    return (
        <FilesContext.Provider value={value}>
        {props.children}
        </FilesContext.Provider>
    );
};