import "./App.css";
import { Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Heading from "./Component/Heading";
import Join from "./Component/Join";
import List from "./Component/List";

function App() {
  const [contentList, setContentList] = useState([]);

  return (
    <div className="App">
      <Heading></Heading>
      <Routes>
        <Route
          path="/join"
          element={
            <Join contentList={contentList} setContentList={setContentList} />
          }
        ></Route>
        <Route
          path="/list"
          element={
            <List contentList={contentList} setContentList={setContentList} />
          }
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
