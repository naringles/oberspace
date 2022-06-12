import React, {useState,useMemo,useEffect,createContext} from "react";

export const SearchContext=createContext();

export const SearchProvider = props => {
    
    const [searchVal, setSearchVal] = useState("");

    const value=useMemo(()=>({searchVal, setSearchVal}));

    return (
        <SearchContext.Provider value={value}>
        {props.children}
        </SearchContext.Provider>
    );
};


export const FilterContext=createContext();

export const FilterProvider = props => {
    
    const [filterVal, setFilterVal] = useState("");
    const value=useMemo(()=>({filterVal, setFilterVal}));

    return (
        <FilterContext.Provider value={value}>
        {props.children}
        </FilterContext.Provider>
    );
};


const localDarkState = JSON.parse(sessionStorage.getItem("dark"));

export const DarkContext=createContext();

export const DarkProvider = props => {
    
const localDarkState = JSON.parse(sessionStorage.getItem("dark"));
const [darkMode, setDarkMode] = useState(localDarkState||false);
 
useEffect(() => {
    sessionStorage.setItem("dark", darkMode);
}, [darkMode]);

    const value=useMemo(()=>({darkMode, setDarkMode}));

    return (
        <DarkContext.Provider value={value}>
        {props.children}
        </DarkContext.Provider>
    );
};

