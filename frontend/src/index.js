import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './components/OneStorage.css';
import {LogInProvider} from "./components/LoginContext";



ReactDOM.render(<LogInProvider><App/></LogInProvider>, document.getElementById("root"));