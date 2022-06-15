import React,{useContext} from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import UserHome from "./components/UserHome";
import SignUp  from "./components/SignUp";
import {DrivesProvider,DriveDeleteProvider} from "./components/DrivesRepo";
import {FilesProvider} from "./components/FilesRepo";
import {SearchProvider,FilterProvider,DarkProvider} from "./components/SearchContext";
import {LoginContext} from "./components/LoginContext";
import Compare from "./components/Compare";
import Personal from "./components/Personal";

function App() {
  const [loggedIn, setLoggedIn] = useContext(LoginContext);
  return (
    <div>
    <DrivesProvider>
    <DriveDeleteProvider>
    <FilesProvider>
    <SearchProvider>
    <DarkProvider>
    <FilterProvider>
    <Router>
     {loggedIn.status? <Route path="/" exact component={UserHome} />: <Route path="/" exact component={SignUp} />}     
     {loggedIn.status? <Route path="/user/home/:userName" exact component={UserHome} />:<Route path="/user/home/:userName" exact component={SignUp} />}    
     <Route path="/compare" exact component ={Compare} />  
     <Route path="/personal" exact component ={Personal} /> 
    </Router>

    </FilterProvider>
    </DarkProvider>
    </SearchProvider>
    </FilesProvider>
    </DriveDeleteProvider>
    </DrivesProvider>
    </div>
  );
}

export default App;
