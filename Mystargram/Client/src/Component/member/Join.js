import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Join() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwd_chk, setPwd_chk] = useState("");
  const [nickname, setNickname] = useState("");
  const [intro, setIntro] = useState("");
  const [imgSrc, setImgSrc] = useState("");
  const [imgStyle, setImgStyle] = useState({ display: "none" });
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [savefilename, setSavefilename] = useState("");

  const onSubmit = async () => {
    if(!email || !pwd || !pwd_chk || !nickname){
      alert("필수 입력사항 미입력");
      return;
    }else if (pwd !== pwd_chk) {
      alert("비밀번호 확인이 틀림");
      return;
    }

    // 이메일, 닉네임 중복체크
    let resultMsg = "";
    axios.get("/api/members/emailChk/" + email)
    .then(res=>{
      if(res.data.msg === "unavailable"){
        alert("중복된 이메일!!!");
        resultMsg = res.data.msg;
      }
    })
    .catch(err=>{console.error(err)});

    axios.get("/api/members/nicknameChk/" + nickname)
    .then(res=>{
      if(res.data.msg === "unavailable"){
        alert("중복된 닉네임!!!");
        resultMsg = res.data.msg;
      }
    })
    .catch(err=>{console.error(err)});

    if(resultMsg == "unavailable"){
      return;
    }

    const joinInfo = {
      email,
      pwd,
      nickname,
      profilemsg: intro,
      profileimg: imgSrc,
      phone,
    };

    axios.post("/api/members/join", joinInfo)
    .then(res=>{
      if(res.data.msg === "ok"){
        alert("회원가입 성공");
      }else{
        alert("회원가입 실패");
      }
      navigate("/")
    })
    .catch(err=>{
      console.error(err);
    })
  };

  const fileUpload = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    const result = await axios.post("/api/fileupload", formData);
    setSavefilename(result.data.savefilename);
    setImage(result.data.image);

    setImgSrc(`http://localhost:5000/upimg/${result.data.savefilename}`);
    setImgStyle({width:"300px"});
  };

  return (
    <div className="loginform">
      <div className="logo" style={{ fontSize: "2rem" }}>
        Member Join
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
        <label>비밀번호 확인</label>
        <input
          type="password"
          value={pwd_chk}
          onChange={(e) => {
            setPwd_chk(e.currentTarget.value);
          }}
        />
      </div>
      <div className="field">
        <label>닉네임</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => {
            setNickname(e.currentTarget.value);
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
        <label>소개</label>
        <input
          type="text"
          value={intro}
          onChange={(e) => {
            setIntro(e.currentTarget.value);
          }}
        />
      </div>
      <div className="field">
        <label>프로필 이미지</label>
        <input
          type="file"
          onChange={(e) => {
            fileUpload(e);
          }}
        />
      </div>
      <div className="field">
        <label>프로필 이미지 미리보기</label>
        <div>
          <img src={imgSrc} style={imgStyle} />
        </div>
      </div>
      <div className="btns">
        <button
          onClick={() => {
            onSubmit();
          }}
        >
          가입하기
        </button>
        <button
          onClick={() => {
            navigate("/");
          }}
        >
          취소
        </button>
      </div>
    </div>
  );
}

export default Join;
