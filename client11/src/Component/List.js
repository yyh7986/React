import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/List.css";

function List(props) {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    // 멤버를 조회해서 members 변수에 저장하고 아래 return 에서 전송받은 데이터를 화면에 출력
    axios
      .post("/api/getMember")
      .then((res) => {
        console.log("res.data : ", res.data);
        setMembers([...res.data]);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  return (
    <div className="container">
      {/* props로 전달된 배열을 출력 */}
      {members.map((list, idx) => {
        // return (<div>{JSON.stringify(list)}</div>)
        return (
        <div className="user-info">
          <ul className="info-ul">
            <li>{list.userid}</li>
            <li>{list.name}</li>
          </ul>
        </div>);
      })}
    </div>
  );
}

export default List;
