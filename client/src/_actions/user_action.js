import { LOGIN_USER, REGISTER_USER, AUTH_USER } from './types';
import axios from 'axios';

//로그인
export function loginUser(dataTosubmit) {
  const request = axios
    .post("/api/users/login", dataTosubmit)
    .then(response => response.data);
  return {
    //
    type: LOGIN_USER,
    payload: request,
  };
}

//회원가입
export function registerUser(dataTosubmit) {
  const request = axios
    .post('/api/users/register', dataTosubmit)
    .then(response => response.data);
  return {
    type: REGISTER_USER,
    payload: request,
  };
}

//인증처리
export function auth() {
  const request = axios
    .get("/api/users/auth")
    .then(response => response.data);
  return {
    type: AUTH_USER,
    payload: request,
  };
}