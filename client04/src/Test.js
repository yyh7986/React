import React, { useState, useEffect } from "react";
// 리액트에는 다른 프레임과 달리 특별한 변수가 있다
// 그 변수를 state 변수라고 부르며, 이를 사용하기위해서 위에처럼 useState 함수를 import 해서 설정을 거쳐야 사용 가능하다
// state 변수는 페이지내에서 사용할 수 있는 전역변수 정도로 일단 이해한다. 변수의 값이 변할때마다 자동으로 페이지가 재 rendering이 되는 변수이다

function Test() {
  // 함수 안에서 이 페이지에 사용할 state 변수를 생성 및 초기화
  const [temp, setTemp] = useState(20);
  // temp : 변수이름
  // setTemp : temp 변수의 값을 바꿀 수 있는 setter 함수
  // useState(0) : temp 변수에 0으로 초기화하면서 temp 변수와  setTemp 함수를 생성한다

  // useEffect는 useState와 같이 중요하고 특별한 역할을 하는 함수이다.
  // 누가 호출하지 않아도 페이지가 처음 로딩될 때 자체적으로 호출 실행됨
  // 실행조건을 달아두면 그 조건에 따라 추가로 호출됨
  // 사용자가 임의로 호출하는 함수는 아님
  useEffect(
    ()=>{
      console.log("temp 변경됨", temp);
    }, [temp]
  );

  let str = "Test Component";
  console.log(`${str} 가 rendering됩니다`);
  return (
    <div>
      <h1 className="test">Test Component입니다</h1>
      <h2>temp 변수 값 : {temp} &nbsp;</h2>
      {/* 리턴 HTML 안에서 스크립트 영역의 변수의 값을 같이 출력하거나 스크립트 연산을 하고 싶다면 위와 같이 중괄호를 써서 표시한다 */}
      <button
        onClick={() => {
          // temp += 1; // 에러
          setTemp(temp*1.1);
        }}
      >
        temp 변수값 1 증가
      </button>
    </div>
  );
}

export default Test;


// state 변수의 값은 return 내부에서 제한없이 사용 가능하다
// 다만 값의 변경은 반드시 setTemp를 이용해야 한다
// return 내에서 JSX(자바스크립트 문법)을 사용하려면 { } 안에서 사용한다
// temp 변수값 표현 : {temp}
// onclick에 JSX 명령을 연결하려면 onclick="함수이름()" 을 사용하지 않고
// onclick={( )=>{ }} 형식을 사용한다.
// return문 외부에 별도의 함수를 정의해놓고 그 함수를 호출하기도 한다
// onclick={ 함수이름();}