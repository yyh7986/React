import "./App.css";
import React, { useState } from "react";

// state 변수를 만들어서 그 변수 값(true/false)에 따라 <h2>App.js 컴포넌트</h2> 가 보이게 또는 안보이게 되는 버튼을 생성
function App() {
  const [temp, setTemp] = useState(true);
  return (
    <div className="App">
      {/* return() 안에서 if else 가 사용이 불가능하다. 그 대신 삼항연산자를 사용한다. */}
      <button
        onClick={() => {
          setTemp(!temp);
        }}
        >
        {temp?"숨기기":"보이기"}
      </button>
        {temp ? <h2>App.js 컴포넌트임</h2> : null}
    </div>
  );
}

export default App;