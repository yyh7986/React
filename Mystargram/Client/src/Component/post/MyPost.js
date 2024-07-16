import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";

function MyPost(props) {
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState("");

  useEffect(()=>{
    setImgSrc("/api/upimg/" + props.img);
  },[])
  
  return (
    <div>
      <img src={imgSrc} alt="" onClick={()=>{navigate("/postView")}}/>
    </div>
  )
}

export default MyPost
