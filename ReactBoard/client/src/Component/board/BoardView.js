import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function BoardView() {
  const navigate = useNavigate();
  const [board, setBoard] = useState({});
  const [replyList, setReplyList] = useState([]);
  const [loginUser, setLoginUser] = useState([]);
  const [curDateTime, setCurDateTime] = useState("");
  const [rContent, setRContent] = useState("");

  const { num } = useParams();

  useEffect(() => {
    // 게시물 조회
    axios
      .get("/api/boards/getBoard/" + num)
      .then((res) => {
        setBoard(res.data.board);
      })
      .catch((err) => {
        console.error(err);
      });

    // 조회수 증가

    // 댓글 조회
    axios
      .get("/api/boards/getReply/" + num)
      .then((res) => {
        setReplyList([...res.data.replyList]);
      })
      .catch((err) => {
        console.error(err);
      });

    // 로그인유저 조회
    axios
      .get("/api/members/getLoginUser")
      .then((res) => {
        setLoginUser(res.data);
      })
      .catch((err) => {
        console.error(err);
      });

    const date = new Date();
    const months = String(date.getMonth() + 1).padStart(2, "0");
    const days = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    setCurDateTime(`${months}/${days} ${hours}:${minutes}`);
  }, []);

  const deleteBoard = (num) => {
    const pass = window.prompt("삭제 비밀번호 입력");
    if (board.pass != pass) {
      return alert("비밀번호 틀림");
    }
    axios
      .delete(`/api/boards/deleteBoard/${board.num}`)
      .then(() => {
        navigate("/main");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const deleteReply = async (replynum) => {
    if (window.confirm("삭제할?")) {
      try {
        await axios.delete("/api/boards/deleteReply/" + replynum);
        const result = await axios.get("/api/boards/getReply/" + num);
        setReplyList([...result.data.replyList]);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const addReply = async () => {
    try {
      await axios.post("/api/boards/addReply", {
        num,
        userid: loginUser.userid,
        rContent,
      });

      const result = await axios.get("/api/boards/getReply/" + num);
      setReplyList([...result.data.replyList]);
    } catch (error) {
      console.error(error);
    }

    setRContent("");
  };

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

      <div className="new-reply-row">
        <div className="new-reply-col">{curDateTime}</div>
        <div className="new-reply-col">{loginUser.userid}</div>
        <div className="new-reply-col">
          <input
            type="text"
            value={rContent}
            onChange={(e) => {
              setRContent(e.currentTarget.value);
            }}
          />
        </div>
        <div className="new-reply-col">
          <button
            onClick={() => {
              addReply();
            }}
          >
            댓글작성
          </button>
        </div>
      </div>

      {replyList
        ? replyList.map((reply, idx) => {
            return (
              <div className="new-reply-row" key={idx}>
                <div className="new-reply-col">
                  {reply.writedate.substring(0, 10)}
                </div>
                <div className="new-reply-col">{reply.userid}</div>
                <div className="new-reply-col">{reply.content}</div>
                <div className="new-reply-col">
                  {loginUser.userid == reply.userid ? (
                    <button
                      onClick={() => {
                        deleteReply(reply.replynum);
                      }}
                    >
                      삭제
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })
        : null}
    </div>
  );
}

export default BoardView;
