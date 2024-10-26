import {
  UPDATE_CART_ITEM,
  REMOVE_FROM_CART,
  SET_CART,
  ADD_TO_CART,
} from "../actions/cartAction";

const initialState = {
  cartItemsRedux: [],
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CART:
      return {
        ...state,
        cartItemsRedux: action.payload,
      };
    case UPDATE_CART_ITEM:
    case ADD_TO_CART:
      const existingItemIndex = state.cartItemsRedux.findIndex(
        (item) => item.fishId === action.payload.fishId
      );
      if (existingItemIndex !== -1) {
        // Nếu item đã tồn tại, cập nhật số lượng
        return {
          ...state,
          cartItemsRedux: state.cartItemsRedux.map((item) =>
            item.fishId === action.payload.fishId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      } else {
        // Nếu item chưa tồn tại, thêm mới
        return {
          ...state,
          cartItemsRedux: [...state.cartItemsRedux, action.payload],
        };
      }
    case REMOVE_FROM_CART:
      return {
        ...state,
        cartItemsRedux: state.cartItemsRedux.filter(
          (item) => item.fishId !== action.payload
        ),
      };
    default:
      return state;
  }
};
