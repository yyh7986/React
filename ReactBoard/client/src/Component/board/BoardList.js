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
        setPaging(res.data.paging);

        const pageArr = [];
        const { beginPage, endPage } = res.data.paging;
        for (let i = beginPage; i <= endPage; i++) {
          pageArr.push(i);
        }
        setBeginToEnd([...pageArr]);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const onBoardView = (num) => {
    navigate("/boardView/" + num);
  };

  const onPageMove = (page) =>{
    axios.get(`/api/boards/getBoardList/${page}`)
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
    .catch(err=>{});
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

      <div id="paging">
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
      </div>
    </div>
  );
}

export default BoardList;
