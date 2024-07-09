import React, { useState, useEffect } from 'react'
import axios from "axios";

function List(props) {
  const [members, setMembers] = useState([]);

  useEffect(()=>{
    // 멤버를 조회해서 members 변수에 저장하고 아래 return 에서 전송받은 데이터를 화면에 출력
    axios.post("/api/getMember")
    .then((res)=>{
      console.log("res.data : ", res.data);
      setMembers([...res.data]);
    })
    .catch((err)=>{
      console.error(err);
    });
  })
  return (
    <div>
      {/* props로 전달된 배열을 출력 */}
      {
        members.map((list, idx)=>{
          // return (<div>{JSON.stringify(list)}</div>)
          return (<div>{JSON.stringify(list)}</div>)
        })
      }
    </div>
  )
}

export default List
