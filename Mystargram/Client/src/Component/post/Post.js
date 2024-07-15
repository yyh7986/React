import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../style/posts.css";


function Post(props) {
  const settings = {
    dot:false,
    arrows:false,
    infinite:false,
    speed:500,
    slidesToShow:1,
    slidesToScroll:1
  }

  const [loginUser, setLoginUser] = useState("");
  const [postid, setPostid] = useState("");
  const [images, setImages] = useState([]);
  const [likeList, setLikeList] = useState([]);
  const [replyList, setReplyList] = useState([]);
  
  const navigate = useNavigate();

  useEffect(()=>{
    axios.get("/api/member/getLoginUser")
    .then(res=>{
      if(!res.data.loginUser){
        alert("로그인이 필요합니다");
        navigate("/");
      }
      setLoginUser(res.data.loginUser);
    })
    .catch(err=>{console.error(err)});
    

    axios.get(`/api/post/getImages/${props.post.id}`)
    .then(res=>{
      setImages(res.data)
      console.log("images : ", images);
    })
    .catch(err=>{console.error(err)});

    axios.get(`/api/post/getLikes/${props.post.id}`)
    .then(res=>{setLikeList(res.data)})
    .catch(err=>{console.error(err)});
  },[])
  
  async function onLike(){
    try {
      // 현재 로그인 유저의 닉네임과 현재 포스트의 id로 like 작업을 하고
      // 현재 로그인 유저의 닉네임과 현재 포스트의 id를 서버에 보내서 내역이 있으면 삭제, 없으면 추가
      await axios.post("/api/post/addLike", {postid:props.post.id, likenick:loginUser.nickname})
      // 현재 포스트의 라이크를 재조회하고 likeList를 갱신
      const result = await axios.get(`/api/post/getLikes/${props.post.id}`)
      setLikeList(result.data);
    } catch (error) {
      console.error(error);      
    }
  }
  
  return (
    <div className="post" style={{width:"700px"}}>
      <div className="writer" style={{display:"flex"}}>
        <div>{props.post.id}&nbsp;</div>
        <div>{props.post.writer}&nbsp;</div>
        <button>FOLLOW</button>
      </div>
      <div className="imgs">
        {<Slider {...settings}>
        {
          (
            images
          ) ? (
            images.map((img, idx)=>{
              return(
                <img src={"/api/upimg/"+img.savefilename} key={idx}/>
              )
            })
          ) : (
            null
          )
        }
        </Slider>}
      </div>

      <div className="like">
        {
          (
            likeList
          ) ? (
            likeList.some(
              (like)=>(loginUser.nickname ==like.likenick)
            )?(
              <img src="/api/images/delike.png" onClick={()=>{
                onLike()
              }}/>
            ):(
              <img src="/api/images/like.png" onClick={()=>{
                onLike()
              }}/>
            )
          ) : (
            <img src="/api/images/like.png" onClick={()=>{
              onLike()
            }}/>
          )
        }
        &nbsp;&nbsp;
        <img src={"/api/images/reply.png"}/>
      </div>
      <div className="like">아직 "좋아요"가 없어요</div>
      <div className="content">{props.post.content}</div>
      <div className="reply">댓글 영역</div>
    </div>
  );
}

export default Post;
