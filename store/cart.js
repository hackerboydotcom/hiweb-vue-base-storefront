export default {

  state: {
    cart: null,
    cartJsonApi: null,

    loadingCart: false,
  },

  mutations: {

    cart(state, cart) {
      state.cart = cart;
      state.cartJsonApi = new JsonApi(cart);
    },

    loadingCart(state, status) {
      state.loadingCart = status;
    }

  }

}