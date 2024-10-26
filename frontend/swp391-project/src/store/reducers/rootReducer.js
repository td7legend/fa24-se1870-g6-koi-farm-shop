import authReducer from "./authReducer";
import { cartReducer } from "./cartReducer"; // Import cartReducer
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";

const commonConfig = {
  storage,
  stateReconciler: autoMergeLevel2,
};

const authConfig = {
  ...commonConfig,
  key: "auth",
  whitelist: ["isLoggedIn", "token", "role"],
};

const cartConfig = {
  ...commonConfig,
  key: "cart",
  whitelist: ["cartItemsRedux"], // Chỉ định các thuộc tính cần lưu trữ
};

const rootReducer = combineReducers({
  auth: persistReducer(authConfig, authReducer),
  cart: persistReducer(cartConfig, cartReducer), // Thêm cartReducer vào rootReducer
});

export default rootReducer;
