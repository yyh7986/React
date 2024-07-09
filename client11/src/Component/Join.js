import React, { useState } from "react";
import "../css/join.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Join(props) {
  const [userid, setuserid] = useState("");
  const [pwd, setPwd] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  // location.href 와 비슷한 기능의 함수를 생성
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({});

  const onSubmit = () => {
    setUserInfo({ userid, pwd, name, phone, email });
    props.contentList.push(userInfo);
    axios
      .post("/api/join", { userid, pwd, name, phone, email })
      .then(() => {
        alert("회원가입이 완료되었습니다.");
      })
      .catch((err) => {
        console.error(err);
      });

    setuserid("");
    setPwd("");
    setName("");
    setPhone("");
    setEmail("");
  };
  return (
    <div className="container">
      <div className="field">
        <label>아이디</label>
        <input
          type="text"
          value={userid}
          onChange={(e) => {
            setuserid(e.currentTarget.value);
          }}
        />
      </div>
      <div className="field">
        <label>비밀번호</label>
        <input
          type="password"
          value={pwd}
          onChange={(e) => {
            setPwd(e.currentTarget.value);
          }}
        />
      </div>
      <div className="field">
        <label>이름</label>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.currentTarget.value);
          }}
        />
      </div>
      <div className="field">
        <label>전화번호</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => {
            setPhone(e.currentTarget.value);
          }}
        />
      </div>
      <div className="field">
        <label>이메일</label>
        <input
          type="text"
          value={email}
          onChange={(e) => {
            setEmail(e.currentTarget.value);
          }}
        />
      </div>
      <div className="btns" style={{ display: "flex", width: "100%" }}>
        <button
          style={{ flex: "1", height: "50px" }}
          onClick={() => {
            onSubmit();
          }}
        >
          제출
        </button>
      </div>
    </div>
  );
}

export default Join;
