// Main.js
import React, {useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import MainMenu from "./MainMenu";
import "../style/posts.css";
import Post from './post/Post';

function Main() {
    const [loginUser, setLoginUser] = useState({});
    const [postList, setPostList] = useState([]);
    const navigate = useNavigate();
    useEffect(
        ()=>{
            axios.get('/api/member/getLoginUser')
            .then((result)=>{
                if(!result.data.loginUser){
                    alert('로그인이 필요합니다');
                    navigate('/');
                }
                setLoginUser(result.data.loginUser);
            })

            axios.get("/api/post/getPostList")
            .then(res=>{
                setPostList(res.data.postList);
            })
            .catch(err=>{
                console.error(err);
            })
        },[]
    )
    return (
        <div style={{display:'flex', flexDirection:"column", alignItems:"center"}}>
            <MainMenu></MainMenu>
            <div className="Posts">
                {
                    (
                        postList
                    ) ? (
                        postList.map((post,idx)=>{
                            return(
                                <Post post={post} key={idx} loginUser={loginUser}/>
                            )
                        })
                    ) : (
                        null
                    )
                }
            </div>
        </div>
    )
}

export default Main
