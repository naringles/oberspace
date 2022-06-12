import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "./LoginContext";
function LoginTab() {
  const { register, watch, errors, handleSubmit } = useForm();
  let history = useHistory();
  const [loginFail, setLoginFail] = useState(false);
  const [loggedIn, setLoggedIn] = useContext(LoginContext);
  console.log("login tab");

  const onSubmit = (data, e) => {
    axios
      .post("/user/auth/login/", data)
      .then((response) => {
        if (response.data.authenticate) {
          console.log("response: ", response.data);
          setLoggedIn({
            username: response.data.username,
            status: response.data.authenticate,
          });

          history.push(`/user/home/${response.data.username}`);
        } else {
          setLoginFail(true);
        }
      })
      .catch((err) => {
        console.error(err);
      });

    e.preventDefault();
    e.target.reset();
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            name="email"
            ref={register}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            className="form-control"
            name="password"
            ref={register}
            required
          />
        </div>
        <button type="submit" className="btn signUp">
          Login
        </button>
        {loginFail && <p>로그인에 실패했습니다. 다시 시도해주세요.</p>}
      </form>
    </div>
  );
}

export default LoginTab;
