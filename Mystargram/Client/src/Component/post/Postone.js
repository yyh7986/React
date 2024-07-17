import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MainMenu from "../MainMenu";
import Post from "./Post";

function Postone() {

  const settings = {
    dot:false,
    arrows:false,
    infinite:false,
    speed:500,
    slidesToShow:1,
    slidesToScroll:1
  }
  
  const [post, setPost] = useState({});
  // const [images, setImages] = useState([]);
  // const [imgList, setImgList] = useState([]);
  // const [likeList, setLikeList] = useState([]);
  // const [replyList, setReplyList] = useState([]);
  const [loginUser, setLoginUser] = useState({});
  const [followings, setFollowings] = useState([]);
  const [word, setWord] = useState("");
  // const [viewVal, setViewVal] = useState(false);
  // const [replyStyle, setReplyStyle] = useState({display:"none"});
  // const [replyContent, setReplyContent] = useState("");

  const navigate = useNavigate();
  const {postid} = useParams();
  
  useEffect(()=>{
    // 로그인 유저 & 팔로잉 배열
    axios.get("/api/member/getLoginUser")
    .then(res=>{
      setLoginUser(res.data.loginUser);
      setFollowings(res.data.followings);
    })
    .catch(err=>{console.error(err)});    

    // 포스트
    axios.get(`/api/post/getPost/${postid}`)
    .then(res=>{setPost(res.data)})
    .catch(err=>console.error(err));

    /* // 이미지
    axios.get(`/api/post/getImages/${postid}`)
    .then(res=>{setImages(res.data)})
    .catch(err=>{console.error(err)});
    
    // 댓글
    axios.get(`/api/post/getReplys/${postid}`)
    .then(res=>{setReplyList(res.data)})
    .catch(err=>{console.error(err)});

    // 좋아요
    axios.get(`/api/post/getLikes/${postid}`)
    .then(res=>{setLikeList(res.data)})
    .catch(err=>{console.error(err)}); */
  },[])

  /* 
  async function onLike(){
    try {
      // 현재 로그인 유저의 닉네임과 현재 포스트의 id로 like 작업을 하고
      // 현재 로그인 유저의 닉네임과 현재 포스트의 id를 서버에 보내서 내역이 있으면 삭제, 없으면 추가
      await axios.post("/api/post/addLike", {postid, likenick:loginUser.nickname})
      // 현재 포스트의 라이크를 재조회하고 likeList를 갱신
      const result = await axios.get(`/api/post/getLikes/${postid}`)
      setLikeList(result.data);
    } catch (err) {
      console.error(err);
    }
  }
  
  function viewOrNot(){
    setViewVal(!viewVal);
  }
  
  async function addReply(){
    // 댓글을 추가하고 댓글 리스트를 재조회 및 갱신
    try {
      await axios.post("/api/post/addReply", {writer:loginUser.nickname, content:replyContent, postid})
  
      const result = await axios.get(`/api/post/getReplys/${postid}`);
      setReplyList(result.data);
    } catch (err) {
      console.error(err);
    }
    setReplyContent("");
  }

  async function deleteReply(replyId){
    // 댓글을 삭제하고 댓글 리스트를 재조회 및 갱신
    await axios.delete(`/api/post/deleteReply/${replyId}`)
    const result = await axios.get(`/api/post/getReplys/${postid}`)
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
  } */
  
  return (
    <div>
      <MainMenu setWord={setWord}></MainMenu>

      <Post post={post} postid={postid} loginUser={loginUser}></Post>
      
      {/* <div className="post" style={{width:"700px"}}>
      <div className="writer" style={{display:"flex"}}>
        <div>{postid}&nbsp;</div>
        <div>{post.writer}&nbsp;</div>
        {
          (
            (post.writer != loginUser.nickname) &&
            (!followings.includes(post.writer))
          ) ? (
            <button onClick={()=>{onFollow(post.writer)}}>FOLLOW</button>
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
      <div className="content">{post.content}</div>
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
    </div> */}
    </div>
  )
}

export default Postone
