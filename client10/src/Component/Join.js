import React from "react";
import "../css/join.css";
import { useState } from "react";

function Join(props) {
  const [userid, setuserid] = useState("");
  const [pwd, setPwd] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const onSubmit = () => {
    let data = {};
    data.userid = userid;
    data.pwd = pwd;
    data.name = name;
    data.phone = phone;
    let arr = [...props.contentList];
    arr.push(data);
    props.setContentList([...arr]);

    setuserid("");
    setPwd("");
    setName("");
    setPhone("");
  }
  return (
    <div className="container">
      <div className="field">
        <label>아이디</label>
        <input type="text" value={userid} onChange={(e)=>{
          setuserid(e.currentTarget.value);
        }}/>
      </div>
      <div className="field">
        <label>비밀번호</label>
        <input type="password" value={pwd} onChange={(e)=>{
          setPwd(e.currentTarget.value);
        }}/>
      </div>
      <div className="field">
        <label>이름</label>
        <input type="text" value={name} onChange={(e)=>{
          setName(e.currentTarget.value);
        }}/>
      </div>
      <div className="field">
        <label>전화번호</label>
        <input type="text" value={phone} onChange={(e)=>{
          setPhone(e.currentTarget.value);
        }}/>
      </div>
      <div className="btns" style={{ display: "flex", width: "100%" }}>
        <button style={{ flex: "1", height: "50px" }} onClick={() => {
          onSubmit();
        }}>
          제출
        </button>
      </div>
    </div>
  );
}

export default Join;
