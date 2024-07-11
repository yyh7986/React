import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../../style/board.css";

function UpdateBoard() {
  const [loginUser, setLoginUser] = useState({});
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pass, setPass] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [image, setImage] = useState("");
  const [savefilename, setSavefilename] = useState("");
  const [oldImgSrc, setOldImgSrc] = useState("");
  const [imgStyle, setImgStyle] = useState({ display: "none" });
  const [imgSrc, setImgSrc] = useState("http://via.placeholder.com/200x150");
  const { num } = useParams();
  
  const navigate = useNavigate();
  
  const onFileUpload = async (e) =>{
        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        const res = await axios.post('/api/boards/fileupload', formData);
        setSavefilename(res.data.savefilename);
        setImage(res.data.image);

        setImgSrc(`http://localhost:5000/img/${res.data.savefilename}`);
        setImgStyle({width:"300px"})
    }
  

  function onSubmit(){
    if(oldPass != pass){
      return alert("비밀번호 틀림")
    }
    axios.post("/api/boards/updateBoard", {title, content, image, savefilename, num})
    .then((res)=>{
      navigate(`/boardView/${num}`);
    })
    .catch(err=>{
      console.error(err);
    })
  }

  useEffect(()=>{
    // 로그인유저 조회
    axios
      .get("/api/members/getLoginUser")
      .then((res) => {
        setLoginUser(res.data);
      })
      .catch((err) => {
        console.error(err);
      });

    axios
      .get("/api/boards/getBoard/" + num)
      .then((res) => {
        console.log("res.data : ", res.data)
        setTitle(res.data.board.title);
        setContent(res.data.board.content);
        setImage(res.data.board.image);
        setSavefilename(res.data.board.savefilename);
        setOldPass(res.data.board.pass);
        setOldImgSrc(`http://localhost:5000/img/${res.data.board.savefilename}`)
      })
      .catch((err) => {
        console.error(err);
      });

  },[])

  return (

    <div>
      <div className="writeBoard">
        <h2>게시물 수정</h2>
        <div className="field">
          <label>작성자</label>
          <input type="text" value={loginUser.userid} readOnly />
        </div>
        <div className="field">
          <label>이메일</label>
          <input type="text" value={loginUser.email} readOnly />
        </div>
        <div className="field">
          <label>비밀번호</label>
          <input
            type="password"
            value={pass}
            onChange={(e) => {
              setPass(e.currentTarget.value);
            }}
          />
        </div>
        <div className="field">
          <label>제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.currentTarget.value);
            }}
          />
        </div>
        <div className="field">
          <label>내용</label>
          <textarea
            rows="10"
            value={content}
            onChange={(e) => {
              setContent(e.currentTarget.value);
            }}
          ></textarea>
        </div>
        <div className="field">
          <label>기존 이미지</label>
          <div>
            <img src={oldImgSrc} style={{ width: "150px" }} />
          </div>
        </div>
        <div className="field">
          <label>변경할 이미지</label>
          <input
            type="file"
            onChange={(e) => {
              onFileUpload(e);
            }}
          />
          {/* e 를 전달인수로 전달해야 해당함수에서 방금 선택한 이미지를 인식할 수 있습니다. */}
        </div>
        <div className="field">
          <label>이미지 미리보기</label>
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
            수정완료
          </button>
          <button
            onClick={() => {
              navigate("/main");
            }}
          >
            돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateBoard;