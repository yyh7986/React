import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../style/board.css";

function JoinForm() {
  const [userid, setUserid] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwd_chk, setPwd_chk] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const onSubmit = () => {
    if (!userid || !pwd || !name || !email || !phone) {
      return alert("입력 안한곳 있음");
    }
    if (pwd != pwd_chk) {
      return alert("비번 확인 불일치");
    }

    axios
      .post("/api/members/join", { userid, pwd, name, email, phone })
      .then(res => {
        if (res.data.msg) {
          alert("회원가입 성공. 로그인 하세요");
        } else {
          alert("회원가입 실패");
        }
        navigate("/");
      })
      .catch(err=>{
        console.error(err);
      });
  };

  return (
    <div className="login">
      <form id="login-form">
        <h2>Join</h2>
        <div className="field">
          <label>USER ID</label>
          <input
            type="text"
            value={userid}
            onChange={(e) => {
              setUserid(e.currentTarget.value);
            }}
          />
        </div>
        <div className="field">
          <label>PASSWORD</label>
          <input
            type="password"
            value={pwd}
            onChange={(e) => {
              setPwd(e.currentTarget.value);
            }}
          />
        </div>
        <div className="field">
          <label>RETYPE PASS</label>
          <input
            type="password"
            value={pwd_chk}
            onChange={(e) => {
              setPwd_chk(e.currentTarget.value);
            }}
          />
        </div>
        <div className="field">
          <label>NAME</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.currentTarget.value);
            }}
          />
        </div>
        <div className="field">
          <label>EMAIL</label>
          <input
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.currentTarget.value);
            }}
          />
        </div>
        <div className="field">
          <label>PHONE</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => {
              setPhone(e.currentTarget.value);
            }}
          />
        </div>
        <div className="btns">
          <input
            type="button"
            value="회원가입"
            onClick={() => {
              onSubmit();
            }}
          />
          <input
            type="button"
            value="돌아가기"
            onClick={() => {
              navigate("/");
            }}
          />
        </div>
      </form>
    </div>
  );
}

export default JoinForm;
