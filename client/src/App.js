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

/*
    *** 주의사항! ***
    
    element={Auth(페이지이름, 조건)}
    에서 Auth() 부분을 제외해버리면 자동로그인,
    쿠키 인증이 전부 해제되어버리니,
    이 부분은 절대로!!!!!! 바꿔서는 안됨.
    
    참고로 조건은
    null : 아무나 접근가능한 페이지
    false : 로그인해서 쿠키가 발급되지 않은 사람만 접근 가능
    true : 로그인해서 쿠키가 발급된 사람만 접근 가능.
    
    따라서, LandingPage를 Main.js 라는 메인 페이지로 사용하려면,
    
    먼저, import 부분, 6번째 줄을 지우고,
    import Main from './components/views/Main/Main.js'; 처럼 위치 설정해주고,
    
    45번째줄,
    <Route path="/" element={Auth(LandingPage, null)} /> 부분을
    => <Route path="/" element={Auth(Main, true)} /> 로 변경해야함.
    
    이래도 실행이 안된다면 어딘가 잘못 만진 부분이 있는거고,
    그 경우에는 호출 바람.
*/

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
