import React, { useState, useEffect } from "react";
import "../../style/MyPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MainMenu from "../MainMenu";
import MyPost from "../post/MyPost";
import { useSelector } from "react-redux";

function MyPage(props) {
  const [imgSrc, setImgSrc] = useState("http://localhost:5000/images/user.png");
  const [followers, setFollowers] = useState([]); // 나를 follow 하는 사람들
  const [followings, setFollowings] = useState([]); // 내가 following 하는 사람들

  const [postList, setPostList] = useState([]); // 로그인 유저가 작성한 포스트들
  const [imgList, setImgList] = useState([]); // 하단에 포스트를 대변할 수 있는 이미지들

  const [loginUser, setLoginUser] = useState({});
  const lUser = useSelector(state => state.user);
  const [word, setWord] = useState("n");
  const navigate = useNavigate();

  
  
  useEffect(() => {
    // axios
    //   .get("/api/member/getLoginUser")
    //   .then((res) => {
    //     setLoginUser(res.data.loginUser);
    //     setFollowers(res.data.followers);
    //     setFollowings(res.data.followings);
    //     if (res.data.loginUser.profileimg) {
    //       setImgSrc(res.data.loginUser.profileimg);
    //     }
    //   })
    //   .catch((err) => console.error(err));

    axios
      .get("/api/post/getMyPost")
      .then((res) => {
        setPostList(res.data.postList);
        setImgList(res.data.imgList);
        console.log("res.postList : ", res.data.postList);
        console.log("res.imgList : ", res.data.imgList);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="mypage">
      <MainMenu loginUser={lUser} setWord={setWord} />
      <div className="userinfo">
        <div className="img">
          <img src={imgSrc} />
        </div>
        <div className="profile">
          <div className="field">
            <label>E-mail</label>
            <div>{lUser.email}</div>
          </div>
          <div className="field">
            <label>Nick Name</label>
            <div>{lUser.nickname}</div>
          </div>
          <div className="field">
            <label>Followers</label>
            <div>{lUser.followers ? lUser.followers.length : 0}</div>
          </div>
          <div className="field">
            <label>Followings</label>
            <div>{lUser.followings ? lUser.followings.length : 0}</div>
          </div>
          <div className="field">
            <label>intro</label>
            <div>{lUser.profilemsg}</div>
          </div>
        </div>
      </div>
      <div className="btns">
        <button>Edit Profile</button>
        <button>Post Write</button>
      </div>
      <div className="userpost">
        {imgList.length > 0
          ? imgList.map((img, idx) => {
              return(
                <div key={idx} onClick={()=>{
                  navigate(`/postone/${postList[idx].id}`)
                }}>
                  <img src={`/api/upimg/${img}`}/>
                  {/* <MyPost  img={img}></MyPost> */}
                </div>
              ) 
                
            })
          : null}
      </div>
    </div>
  );
}

export default MyPage;
