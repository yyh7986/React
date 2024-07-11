import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./Component/Login";
import Main from "./Component/Main";
import JoinForm from "./Component/member/JoinForm";
import MemberUpdate from "./Component/member/MemberUpdate";
import BoardView from "./Component/board/BoardView";
import WriteBoard from "./Component/board/WriteBoard";
import UpdateBoard from "./Component/board/UpdateBoard";

function App() {
  const [member, setMember] = useState([]);

  return (
    <Routes>
      <Route
        path="/"
        element={<Login member={member} setMember={setMember} />}
      ></Route>
      <Route path="/main" element={<Main />}></Route>
      <Route path="/joinForm" element={<JoinForm />}></Route>
      <Route path="/memberUpdate" element={<MemberUpdate />}></Route>
      <Route path="/boardView/:num" element={<BoardView />}></Route>
      <Route path="/writeBoard" element={<WriteBoard />}></Route>
      <Route path="/updateBoard/:num" element={<UpdateBoard />}></Route>
    </Routes>
  );
}

export default App;
