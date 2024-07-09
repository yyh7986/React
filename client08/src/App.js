import "./App.css";
import A from "./Component/A";
import B from "./Component/B";
import C from "./Component/C";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      {/* <h1>App 컴포넌트임</h1> */}
      <a href="/A">A로 이동</a>&nbsp;&nbsp;
      <a href="/B">B로 이동</a>&nbsp;&nbsp;
      <a href="/C">C로 이동</a>&nbsp;&nbsp;
      <Routes>
        <Route path="/A" element={<A />}></Route>
        <Route path="/B" element={<B />}></Route>
        <Route path="/C" element={<C />}></Route>
      </Routes>
    </div>
  );
}

export default App;
