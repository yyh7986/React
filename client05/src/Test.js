import React, { useState, useEffect } from "react";
import "./Test.css";

function Test() {
  const [temp, setTemp] = useState("Test");
  // state 변수에는 어떤 형태의 자료형도 초기화될 수 있다
  // 아래와 같이 배열로도 초기화가 가능하다
  // const [tempArr, setTempArr] = useState([1,2,3]);

  // 반드시 값이 존재하는 배열이 아니어도 된다.
  // const [tempObj, setTempObj] = useState({});
  const [tempArr, setTempArr] = useState([]);
  const [number, setNumber] = useState(0);

  useEffect(() => {
    // tempArr.push(number);
    let arr = [];
    arr = [...tempArr];
    arr.push(number);
    setTempArr([...arr]);
  }, [number]);

  
  return (
    <div>
      <h2>
        {temp} Component 입니다. {number}
      </h2>
      <h2>{tempArr}</h2>
      <button
        onClick={() => {
          setNumber(number + 1);
          // tempArr.push(number);
        }}
      >
        배열 요소 추가하기
      </button>
      {/* setNumber 와 같은 스테이트 변수 변경함수는 대표적인 비동기함수이다 */}
    </div>
  );
}

export default Test;
