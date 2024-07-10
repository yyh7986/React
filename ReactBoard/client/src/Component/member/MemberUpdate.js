import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MemberUpdate() {
  const [loginUser, setLoginUser] = useState("");

  const [userid, setUserid] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwd_chk, setPwd_chk] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/members/getLoginUser")
      .then((res) => {
        if (!res.data) {
          alert("로그인이 필요한 서비스 입니다");
          navigate("/");
        } else {
          setUserid(res.data.userid);
          setName(res.data.name);
          setEmail(res.data.email);
          setPhone(res.data.phone);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const onSubmit = () => {
    if (!pwd || !name || !email || !phone) {
      return alert("입력 안한곳 있음");
    }
    if (pwd != pwd_chk) {
      return alert("비번 확인 불일치");
    }

    axios
      .post("/api/members/updateMember", { userid, pwd, name, email, phone })
      .then((res) => {
        alert("회원정보 수정완료");
        navigate("/main");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div>
      <div className="login">
        <form id="login-form">
          <h2>Edit Info</h2>
          <div className="field">
            <label>USER ID</label>
            <input type="text" value={userid} readOnly />
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
              value="정보수정"
              onClick={() => {
                onSubmit();
              }}
            />
            <input
              type="button"
              value="돌아가기"
              onClick={() => {
                navigate("/main");
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default MemberUpdate;
