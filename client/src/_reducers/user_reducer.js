import { LOGIN_USER, REGISTER_USER, AUTH_USER } from "../_actions/types";

export default function (state = {}, action) {
  // 여러 타입들에 따른 선택지를 위한 switch 문법
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, loginSuccess: action.payload };
      break;
    case REGISTER_USER:
      return { ...state, registerSuccess: action.payload };
      break;
    case AUTH_USER:
      return { ...state, userData: action.payload };
      break;
    default:
      return state;
  }
}