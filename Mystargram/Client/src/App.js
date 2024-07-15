import { Routes, Route } from 'react-router-dom'

import Login from './Component/Login';
import Main from './Component/Main';
import Join from './Component/member/Join';
import WritePost from './Component/post/WritePost';

function App() {
  
  return (
    <div className="App" style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/join' element={<Join/>}></Route>
        <Route path='/main' element={<Main/>}></Route>
        <Route path='/writePost' element={<WritePost/>}></Route>
      </Routes>
    </div>
  );
}

export default App;