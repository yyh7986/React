import { configureStore } from "@reduxjs/toolkit";
import userSlice from './userSlice'

import storage from 'redux-persist/lib/storage'
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";

const reducers = combineReducers({
  user : userSlice.reducer,
})
const persistConfig = {
  key:'root',
  storage,
  whitelist:['user']
}
const persistedReducer = persistReducer(persistConfig, reducers);

// 스토어에 configureStore를 이용해서 userSlice 를 등록
export default configureStore({
  reducer:persistedReducer,
  middleware:getDefaultMiddleware => getDefaultMiddleware({serializableCheck:false})
})
