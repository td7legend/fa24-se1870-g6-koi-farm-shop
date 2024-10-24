import { ADD_TO_CART, SET_CART } from "../actions/cartActions";

const initialState = {
  cartItems: [],
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const existingItem = state.cartItems.find(
        (item) => item.fishId === action.payload.fishId
      );
      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item.fishId === action.payload.fishId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return {
        ...state,
        cartItems: [...state.cartItems, action.payload],
      };

    case SET_CART:
      return {
        ...state,
        cartItems: action.payload,
      };

    default:
      return state;
  }
};
