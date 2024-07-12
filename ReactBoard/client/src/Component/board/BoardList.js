import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../../style/board.css";

function BoardList() {
  const [boardList, setBoardList] = useState([]);
  const [paging, setPaging] = useState({});
  const [beginToEnd, setBeginToEnd] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/boards/getBoardList/1")
      .then((res) => {
        setBoardList([...res.data.boardList]);
        console.log("getBoardList의 res.data.paging :", res.data.paging);
        console.log(typeof res.data.paging.page);
        setPaging(res.data.paging);

        /* const pageArr = [];
        const { beginPage, endPage } = res.data.paging;
        for (let i = beginPage; i <= endPage; i++) {
          pageArr.push(i);
        }
        setBeginToEnd([...pageArr]); */
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    // 컴포넌트가 시작될때
    window.addEventListener("scroll", handleScroll);
    // window에 scroll 이벤트가 발생하면 handleScroll 함수를 호출하여 실행

    // 컴포넌트가 끝날때
    return () => {
      // scroll event listener 해제
      window.removeEventListener("scroll", handleScroll);
    };
  });

  const handleScroll = () => {
    // scroll 이벤트가 일어나면 실행될 함수
    // 스크롤이 가능한 크기
    const scrollHeight = document.documentElement.scrollHeight - 10;
    // 현재 위치
    const scrollTop = document.documentElement.scrollTop;
    // 내용물의 크기
    const clientHeight = document.documentElement.clientHeight;

    // 스크롤을 시도하여 이동한 현재위치 값에 내용물 크기를 더한값이 스크롤할 수 있는 크기(한계)를 넘어갔다면 ==> 화면 밑에까지 끝까지 스크롤 했다면
    if (scrollTop + clientHeight >= scrollHeight) {
      const pagenum = Number(paging.page);
      onPageMove(pagenum + 1);
    }
  };

  const onBoardView = (num) => {
    navigate("/boardView/" + num);
  };

  const onPageMove = (page) => {
    // 스크롤 표시방식
    console.log("onPageMove함수로 전달되는 page", page);
    axios
      .get(`/api/boards/getBoardList/${page}`)
      .then((res) => {
        setPaging(res.data.paging);
        /* const boards = [];
        boards = [...boardList];
        boards = [...boards, ...res.data.boardList]; */
        setBoardList([...boardList, ...res.data.boardList]);
      })
      .catch((err) => {
        console.error(err);
      });

    // 페이지 표시방식
    /* axios.get(`/api/boards/getBoardList/${page}`)
    .then(res=>{
      setBoardList([...res.data.boardList]);
        setPaging(res.data.paging);
        const pageArr = [];
        const { beginPage, endPage } = res.data.paging;
        for (let i = beginPage; i <= endPage; i++) {
          pageArr.push(i);
        }
        setBeginToEnd([...pageArr]);
    })
    .catch(err=>{}); */
  };

  return (
    <div className="boardList">
      <div className="titlerow">
        <div className="titlecol">번호</div>
        <div className="titlecol">제목</div>
        <div className="titlecol">글쓴이</div>
        <div className="titlecol">작성일</div>
        <div className="titlecol">조회수</div>
      </div>
      {boardList.map((board, idx) => {
        return (
          <div className="row" key={idx}>
            <div className="col">{board.num}</div>
            <div
              className="col"
              onClick={() => {
                onBoardView(board.num);
              }}
            >
              {board.title}
            </div>
            <div className="col">{board.userid}</div>
            <div className="col">{board.writedate.substring(0, 10)}</div>
            <div className="col">{board.readcount}</div>
          </div>
        );
      })}

      {/* <div id="paging">
        {
          (paging.prev)?(
          <span style={{cursor:"pointer"}} onClick={()=>{
            onPageMove(paging.beginPage-1)
          }}>&nbsp;◀&nbsp;</span>):
          (<span></span>)
        }
        {
          (beginToEnd)?(
            beginToEnd.map((page, idx)=>{
              return(
                <span style={{cursor:"pointer"}} key={idx} onClick={()=>{onPageMove(page)}
                }>&nbsp;{page}&nbsp;</span>
              )
            })):
          (<></>)
        }
        {
          (paging.next)?(
            <span style={{cursor:"pointer"}} onClick={()=>
              {onPageMove(paging.endPage+1)}
            }>&nbsp;▶&nbsp;</span>):
            (<></>)
        }
      </div> */}
    </div>
  );
}

export default BoardList;
