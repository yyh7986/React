import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function BoardView() {
  const navigate = useNavigate();
  const [board, setBoard] = useState({});
  const [replyList, setReplyList] = useState([]);

  const { num } = useParams();

  useEffect(() => {
    axios
      .get("/api/boards/getBoard/" + num)
      .then((res) => {
        setBoard(res.data.board);
        setReplyList([...res.data.replyList]);
        console.log("replyList : ", replyList);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const deleteBoard = (num) => {};

  return (
    <div className="boardView">
      <h2>Board View</h2>
      <div className="field">
        <label>작성자</label>
        <div>{board.userid}</div>
      </div>
      <div className="field">
        <label>이메일</label>
        <div>{board.email}</div>
      </div>
      <div className="field">
        <label>제목</label>
        <div>{board.title}</div>
      </div>
      <div className="field">
        <label>내용</label>
        <div>
          <pre>{board.content}</pre>
        </div>
      </div>
      <div className="field">
        <label>이미지</label>
        <div>
          <img
            src={`http://localhost:5000/img/${board.savefilename}`}
            style={{ width: "300px" }}
          />
          {board.savefilename}
        </div>
      </div>
      <div className="btns">
        <input
          type="button"
          value="수정"
          onClick={() => {
            navigate(`/updateBoard/${board.num}`);
          }}
        />
        <input
          type="button"
          value="삭제"
          onClick={() => {
            deleteBoard(board.num);
          }}
        />
        <input
          type="button"
          value="돌아가기"
          onClick={() => {
            navigate("/main");
          }}
        />
      </div>
      <div className="head-row">
        <div className="head-col">작성일시</div>
        <div className="head-col">작성자</div>
        <div className="head-col">내용</div>
        <div className="head-col">&nbsp;</div>
      </div>
      {
      replyList.map((reply, idx) => {
        <div className="new-reply-row" key={idx}>
          <div className="new-reply-col">
            {reply.writedate.substring(0, 10)}
          </div>
          <div className="new-reply-col">{reply.userid}</div>
          <div className="new-reply-col">{reply.content}</div>
          <div className="new-reply-col">
            <button>삭제</button>
          </div>
        </div>
      })}
    </div>
  );
}

export default BoardView;
