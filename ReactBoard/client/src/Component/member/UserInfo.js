import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../style/board.css";

function UserInfo() {
  const [loginUser, setLoginUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/members/getLoginUser")
      .then((res) => {
        if (!res.data) {
          alert("로그인이 필요한 서비스 입니다");
          navigate("/");
        } else {
          console.log("loginUser(res.data) : ", res.data);
          setLoginUser(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
        navigate("/");
      });
  }, []);

  const onLogout = () => {
    axios
      .get("/api/members/logout")
      .then((res) => {
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="loginuser">
      {loginUser ? (
        <h3>
          {loginUser.userid}({loginUser.name})님 로그인
        </h3>
      ) : null}

      <button
        onClick={() => {
          navigate("/memberUpdate");
        }}
      >
        회원정보수정
      </button>
      <button
        onClick={() => {
          onLogout();
        }}
      >
        로그아웃
      </button>
      <button
        onClick={() => {
          navigate("/writeBoard");
        }}
      >
        게시글쓰기
      </button>
    </div>
  );
}

export default UserInfo;
