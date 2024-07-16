import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../style/posts.css";


function Post(props) {
  
  // Slider 옵션
  const settings = {
    dot:false,
    arrows:false,
    infinite:false,
    speed:500,
    slidesToShow:1,
    slidesToScroll:1
  }

  // state 변수
  const [loginUser, setLoginUser] = useState("");
  const [postid, setPostid] = useState("");
  const [images, setImages] = useState([]);
  const [likeList, setLikeList] = useState([]);
  const [replyList, setReplyList] = useState([]);
  const [viewVal, setViewVal] = useState(false);
  const [replyStyle, setReplyStyle] = useState({display:"none"});
  const [replyContent, setReplyContent] = useState("");
  const [followings, setFollowings] = useState([]);
  const navigate = useNavigate();

  // useEffect
  useEffect(()=>{
    axios.get("/api/member/getLoginUser")
    .then(res=>{
      // if(!res.data.loginUser){
      //   alert("로그인이 필요합니다");
      //   navigate("/");
      // }
      setLoginUser(res.data.loginUser);
      setFollowings(res.data.followings);
    })
    .catch(err=>{console.error(err)});    

    axios.get(`/api/post/getImages/${props.post.id}`)
    .then(res=>{
      setImages(res.data)
    })
    .catch(err=>{console.error(err)});

    axios.get(`/api/post/getLikes/${props.post.id}`)
    .then(res=>{setLikeList(res.data)})
    .catch(err=>{console.error(err)});

    axios.get(`/api/post/getReplys/${props.post.id}`)
    .then(res=>{setReplyList(res.data)})
    .catch(err=>{console.error(err)});
  },[])
  
  // useEffect [viewVal]
  useEffect(()=>{
    if(!viewVal){
      setReplyStyle({display:"none"})
    }else{
      setReplyStyle({display:"flex", margin:"5px 5px"});
    }
  },[viewVal]);

  // 좋아요 기능
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
  
  function viewOrNot(){
    setViewVal(!viewVal);
  }
  
  async function addReply(){
    // 댓글을 추가하고 댓글 리스트를 재조회 및 갱신
    try {
      await axios.post("/api/post/addReply", {writer:loginUser.nickname, content:replyContent, postid:props.post.id})
  
      const result = await axios.get(`/api/post/getReplys/${props.post.id}`);
      setReplyList(result.data);
    } catch (error) {
      console.error(error);
    }
    setReplyContent("");
  }

  async function deleteReply(replyId){
    // 댓글을 삭제하고 댓글 리스트를 재조회 및 갱신
    await axios.delete(`/api/post/deleteReply/${replyId}`)
    const result = await axios.get(`/api/post/getReplys/${props.post.id}`)
    setReplyList(result.data);
  }
  
  async function onFollow(writer){
    try {
      await axios.post("/api/member/follow", {ffrom:loginUser.nickname, fto:writer});
      const result = await axios.get("/api/member/getFollowings");
      setFollowings(result.data);
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div className="post" style={{width:"700px"}}>
      <div className="writer" style={{display:"flex"}}>
        <div>{props.post.id}&nbsp;</div>
        <div>{props.post.writer}&nbsp;</div>
        {
          (
            (props.post.writer != loginUser.nickname) &&
            (!followings.includes(props.post.writer))
          ) ? (
            <button onClick={()=>{onFollow(props.post.writer)}}>FOLLOW</button>
          ) : (
            null
          )
        }
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
        <img src={"/api/images/reply.png"} onClick={()=>{
          viewOrNot();
        }}/>
        <span>{replyList.length}</span>
      </div>
      <div className="like">
        {
          (
            likeList.length
          ) ? (
            <span>{likeList.length}명이 좋아합니다</span>
          ) : (
            <span>아직 "좋아요"가 없어요</span>
          )
        }
      </div>
      <div className="content">{props.post.content}</div>
      <div className="reply">
        {
          (
            replyList.length>0
          ) ? (
            replyList.map((reply, idx)=>{
              return (
                <div key={idx} style={replyStyle}>
                  <div style={{flex:"1", fontWeight:"bold"}}>{reply.writer}&nbsp;</div>
                  <div style={{flex:"3"}}>{reply.content}</div>
                  <div style={{flex:"1", textAlign:"right"}}>
                    {
                      (
                        reply.writer == loginUser.nickname
                      ) ? (
                        <button onClick={()=>{
                          deleteReply(reply.id)
                        }} style={{width:"100%"}}>삭제</button>
                      ) : (
                        null
                      )
                    }
                  </div>
                </div>
              )
            })
          ) : (
            <div style={replyStyle}>아직 댓글이 없습니다</div>
          )
        }
        <div style={{display:"flex", margin:"3px 7px"}}>
          <input type="text" style={{flex:"5"}} value={replyContent} onChange={(e)=>{
            setReplyContent(e.currentTarget.value)
          }} />
          <button style={{flex:"1"}} onClick={()=>{addReply()}}>댓글입력</button>
        </div>
      </div>
    </div>
  );
}

export default Post;
