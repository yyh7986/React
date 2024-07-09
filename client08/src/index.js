import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import A from "./Component/A";
import B from "./Component/B";
import C from "./Component/C";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
  {/* 컴포넌트가 BrowserRouter 안에서 route로 바인딩되지 않고 태그로 사용이 되었다면 항상 화면에 표시하겠다는 뜻이다. 그리고 아래 라우트들에 의해 선택된 컴포넌트가 아래쪽에 선택 표시된다. */}
    <App/>
    {/* <Routes>
      <Route path="/A" element={<A />}></Route>
      <Route path="/B" element={<B />}></Route>
      <Route path="/C" element={<C />}></Route>
    </Routes> */}
    {/* 
    <Routes>
      <Route path="/" element={<App />}/>
      <Route path="/A" element={<A />}></Route>
      <Route path="/B" element={<B />}></Route>
      <Route path="/C" element={<C />}></Route>
    </Routes> */}
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
