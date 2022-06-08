import React, { useEffect } from 'react';
import axios from 'axios';
import Auth from '../../../hoc/auth'

//landingpage들어오자마자 실행
function LandingPage() {
  useEffect(() => {
    // axios.get은 ('')의 값과 함께 요청을 보내는것.
    axios.get('/api/hello') //엔드 포인트
    // 서버에서 반응이 있다면, 그 값을 출력.
    .then(response => console.log(response.data))
  }, [])
  return <div>
    LandingPage
  </div>;
}

export default LandingPage;