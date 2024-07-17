import { createSlice } from "@reduxjs/toolkit";
// slice를 만들어 store에 담고 reducer(action)로 store(slice)의 상태를 업데이트 한다
// 하나의 slice에 여러 자료를 객체형식으로 담고, reducer로 값을 관리한다
// reducer안에는 여러가지 동작의 함수들이 담겨서 사용될 수 있다

const initialState = {
  email: "",
  nickname: "",
  provider: "",
  snsid: "",
  profileimg: "",
  profilemsg: "",
  followers: [],
  followings: [],
};

const userSlice = createSlice({
  name: "user", // userSlice 안에 저장되는 저장객체의 이름
  initialState,
  reducers: {
    // state(user의 상태값) 값들을 변경할 수 있는 함수들
    loginAction: (state, action) => {
      // 외부에서 전달되는 객체를 내부의 "user"객체에 저장하는데
      // 외부에서 전달되는 객체를 이안에서는 action이라고 부르고
      // "user"객체는 state라고 부른다
      state.email = action.payload.email;
      state.nickname = action.payload.nickname;
      state.provider = action.payload.provider;
      state.snsid = action.payload.snsid;
      state.profileimg = action.payload.profileimg;
      state.profilemsg = action.payload.profilemsg;
      state.pwd = action.payload.pwd;
      state.phone = action.payload.phone;
    },
    logoutAction: (state) => {
      state.email = "";
      state.nickname = "";
      state.provider = "";
      state.snsid = "";
      state.profileimg = "";
      state.profilemsg = "";
      state.pwd = "";
      state.phone = "";
    },
    setFollowings : (state, action) =>{
      state.followings = action.payload;
    },
    setFollowers : (state, action) => {
      state.followers = action.payload;
    },
  },
});

export const { loginAction, logoutAction, setFollowings, setFollowers } = userSlice.actions;
export default userSlice;