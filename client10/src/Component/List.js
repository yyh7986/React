import React from 'react'

function List(props) {
  return (
    <div>
      {/* props로 전달된 배열을 출력 */}
      {
        props.contentList.map((list, idx)=>{
          // return (<div>{JSON.stringify(list)}</div>)
          return (<div>{JSON.stringify(list)}</div>)
        })
      }
    </div>
  )
}

export default List
