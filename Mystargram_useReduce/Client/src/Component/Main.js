// Main.js
import React, {useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import MainMenu from "./MainMenu";
import "../style/posts.css";
import Post from './post/Post';

import { useSelector, useDispatch } from "react-redux";

function Main() {
    const [loginUser, setLoginUser] = useState({});
    const lUser = useSelector(state => state.user);
    const [postList, setPostList] = useState([]);
    const [paging, setPaging] = useState({});
    const [word, setWord] = useState("n");
    const navigate = useNavigate();

    useEffect(()=>{
        window.addEventListener("scroll", handleScroll);

        return () =>{
            window.removeEventListener("scroll", handleScroll);
        }
    })

    const handleScroll = () => {
        // 스크롤이 가능한 크기
        const scrollHeight = document.documentElement.scrollHeight - 50;
        // 현재 위치
        const scrollTop = document.documentElement.scrollTop;
        // 내용물의 크기
        const clientHeight = document.documentElement.clientHeight;

        if(scrollTop + clientHeight >= scrollHeight){
            onPageMove(Number(paging.page) + 1);
        }

    }
    
    async function onPageMove(page){
        const result = await axios.get(`/api/post/getPostList/${page}/${word}`);
        setPaging(result.data.paging);
        let posts = [];
        posts = [...postList];
        posts = [...posts, ...result.data.postList];
        setPostList([...posts]);
    }

    useEffect(
        ()=>{
            if(!lUser.email){
                alert('로그인이 필요합니다');
                navigate('/');
            }
           console.log("lUser : ", lUser);

            axios.get(`/api/post/getPostList/1/${word}`)
            .then(res=>{
                setPostList(res.data.postList);
                setPaging(res.data.paging);
            })
            .catch(err=>{
                console.error(err);
            })
        },[word]
    )
    return (
        <div style={{display:'flex', flexDirection:"column", alignItems:"center"}}>
            <MainMenu setWord={setWord}></MainMenu>

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
