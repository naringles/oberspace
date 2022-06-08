import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import LandingPage from './components/views/LandingPage/LandingPage';
import Login from './components/views/Login/Login';
import SignUp from './components/views/SignUp/SignUp';
import Auth from './hoc/auth'

function App() {


  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={Auth(LandingPage, null)} />
          <Route path="/login" element={Auth(Login, false)} />
          <Route path="/sign_up" element={Auth(SignUp, false)} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;