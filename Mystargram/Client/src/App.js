import { Routes, Route } from 'react-router-dom'
import Login from './Component/Login';
import Join from './Component/member/Join';
import Main from './Component/Main';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/join' element={<Join/>}></Route>
        <Route path='/main' element={<Main/>}></Route>
      </Routes>
    </div>
  );
}

export default App;