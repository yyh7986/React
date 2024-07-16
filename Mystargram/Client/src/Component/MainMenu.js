import React, { useState, useEffect } from "react";
import axios from "axios";
import { redirect, useNavigate } from "react-router-dom";
import "../style/mainMenu.css";

function MainMenu(props) {
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState("http://localhost:5000/images/user.png");
  const [loginUser, setLoginUser] = useState({});
  const [searchTag, setSearchTag] = useState("")
  const [viewOrNot, setViewOrNot] = useState(false);
  const [inputStyle, setInputStyle] = useState({display:"none"});

  useEffect(() => {
    axios.get("/api/member/getLoginUser").then((res) => {
      if (res.data.loginUser) {
        setLoginUser(res.data.loginUser);
        if (res.data.loginUser.profileimg) {
          setImgSrc(res.data.loginUser.profileimg);
        }
      }
    });
  }, []);

  useEffect(()=>{
    if(viewOrNot){
      setInputStyle({display:"flex", marginBottom:"10px"});
    }else{
      setInputStyle({display:"none"});
      props.setWord("n");
      setSearchTag("");
    }
  },[viewOrNot])

  const onLogout = () => {
    axios
      .get("/api/member/logout")
      .then(() => {
        navigate("/"); // routes 안에서만 이동
        // window.location.href="http://localhost:3000/";  // 페이지 전체 이동
      })
      .catch((err) => {
        console.error(err);
      });
  };

  function onSearch(){
    props.setWord(searchTag);
  }
  
  return (
    <div>
      <div className="topmenu">
        <img
          src="http://localhost:5000/images/home.png"
          onClick={() => {
            navigate("/main");
          }}
        />
        <img
          src="http://localhost:5000/images/write.png"
          onClick={() => {
            navigate("/writePost");
          }}
        />
        <img src="http://localhost:5000/images/search.png" onClick={()=>{
          setViewOrNot(!viewOrNot);
        }}/>
        <img src={imgSrc} onClick={()=>{navigate("/myPage")}}/>
        <img
          src="http://localhost:5000/images/logout.png"
          onClick={() => {
            onLogout();
          }}
        />
      </div>

      <div className="search" style={inputStyle}>
        <input
          type="text"
          value={searchTag}
          style={{ flex: "4", padding: "3px" }}
          onChange={(e) => setSearchTag(e.currentTarget.value)}
        />
        <button
          style={{ flex: "1", padding: "3px" }}
          onClick={() => {
            onSearch();
          }}
        >
          해시태그 검색
        </button>
      </div>
    </div>
  );
}

export default MainMenu;
