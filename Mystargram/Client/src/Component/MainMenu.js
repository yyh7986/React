import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/mainMenu.css";

function MainMenu(props) {
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState("http://localhost:5000/images/user.png");
  const [loginUser, setLoginUser] = useState({});

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
  return (
    <div>
      <div className="topmenu">
        <img
          src="http://localhost:5000/images/home.png"
          onClick={()=>{navigate("/main")}}
        />
        <img
          src="http://localhost:5000/images/write.png"
          onClick={() => {
            navigate("/writePost");
          }}
        />
        <img src="http://localhost:5000/images/search.png" />
        <img src={imgSrc} />
        <img
          src="http://localhost:5000/images/logout.png"
          onClick={() => {
            onLogout();
          }}
        />
      </div>
    </div>
  );
}

export default MainMenu;
