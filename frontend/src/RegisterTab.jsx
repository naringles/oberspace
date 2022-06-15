import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "./LoginContext";
import swal from "sweetalert"

function Register() {
  const { register, watch, errors, handleSubmit } = useForm();
  let history = useHistory();
  const [nameTaken, setNameTaken] = useState(false);
  const [loggedIn, setLoggedIn] = useContext(LoginContext);
  console.log("register");

  const onSubmit = (data, e) => {
    axios
      .post("/user/auth/register", data)
      .then((response) => {
        if (response.data.status) {
          console.log("successful signup");
          setLoggedIn({
            username: response.data.username,
            status: response.data.status,
          });
          history.push(`/user/home/${response.data.username}`);
        } else {
          setNameTaken(true);
        }
      })
      .catch((err) => {
        console.error(err);
      });

    console.log(data);
    e.preventDefault();
    e.target.reset();
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="User Name"
            name="username"
            ref={register}
            required
          />
        </div>

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
            ref={register({
              pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
            })}
            required
          />
          {errors.password && (
            <p>
              적어도 8자 이상, 적어도 하나씩의 문자,숫자,특수문자가 필요합니다.
            </p>
          )}
        </div>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            name="cnfPassword"
            ref={register({ validate: (value) => value === watch("password") })}
            placeholder="Confirm Password"
            required
          />
          {errors.cnfPassword && <p>비밀번호가 일치하지 않습니다.</p>}
        </div>

        <button type="submit" className="btn signUp"
        onClick = {() =>{
          {nameTaken ?
            swal("회원가입 실패!", "입력 창을 확인하세요!", "warning")
            :
            swal("회원가입 성공", "환영합니다!", "success")
            }
        }}>
          회원가입
          
        </button>
        {nameTaken && <p> 이메일이 이미 존재합니다.</p>}
      </form>
    </div>
  );
}

export default Register;
