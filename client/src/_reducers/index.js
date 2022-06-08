import { combineReducers } from 'redux';
import user from './user_reducer';

// state 여러개 있을 수 있어서 reducer도 나뉘어져있음
// 이 나눠진 reducer를 combineReducers이용해서 root reducer에서 하나로 합쳐줌
const rootReducer = combineReducers({
  user
  // user, 로그인, 코멘트 등등 기능 여러개 만들건데합쳐줌
})

export default rootReducer;