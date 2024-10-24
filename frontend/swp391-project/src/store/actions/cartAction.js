export const ADD_TO_CART = "ADD_TO_CART";
export const SET_CART = "SET_CART";

export const addToCart = (cartItem) => ({
  type: ADD_TO_CART,
  payload: cartItem,
});

export const setCart = (cartItems) => ({
  type: SET_CART,
  payload: cartItems,
});
