import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../../style/board.css";

function BoardList() {
  const [boardList, setBoardList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/boards/getBoardList")
      .then((res) => {
        setBoardList([...res.data.boardList]);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const onBoardView = (num) => {
    navigate("/boardView/" + num);
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
    </div>
  );
}

export default BoardList;
