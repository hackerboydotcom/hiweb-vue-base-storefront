import JsonApi from '../helpers/JsonApi';

export default {

  namespaced: true,

  state: {
    cart: null,
    cartJsonApi: null,

    isLoadingCart: false,
  },

  mutations: {

    cart(state, cart) {
      state.cart = cart;
      state.cartJsonApi = new JsonApi(cart);
    },

    loadingCart(state, status) {
      state.isLoadingCart = status;
    }

  }

}