export const ADD_TO_CART = "ADD_TO_CART";
export const SET_CART = "SET_CART";
export const UPDATE_CART_ITEM = "UPDATE_CART_ITEM";
export const REMOVE_FROM_CART = "REMOVE_FROM_CART";
export const UPDATE_CART = "UPDATE_CART";
export const FETCH_CART = "FETCH_CART";
export const CLEAR_CART = "CLEAR_CART";

export const addToCart = (cartItem) => ({
  type: ADD_TO_CART,
  payload: cartItem,
});

export const setCart = (cartItems, token) => ({
  type: SET_CART,
  payload: cartItems,
});

export const updateCartItem = (fishId, quantity) => ({
  type: UPDATE_CART_ITEM,
  payload: { fishId, quantity },
});

export const removeFromCart = (fishId) => ({
  type: REMOVE_FROM_CART,
  payload: fishId,
});

export const clearCart = () => ({
  type: CLEAR_CART,
});
