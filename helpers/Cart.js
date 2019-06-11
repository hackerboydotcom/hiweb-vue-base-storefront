import cookie from './cookie';
import api from './api';

import JsonApi from './JsonApi';

class Cart {

  constructor(store) {
    this.store = store;
    this.cart = {};
  }

  id() {
    return process.env.NODE_ENV === 'development' ? 'fe221020-2dae-418f-a0b8-84b17bbe8dea' : cookie.getCookie('cart-id');
  }

  get() {

    return new Promise(async (resolve, reject) => {

      // Loading cart
      this.store.commit('cart/loadingCart', true);

      let cartId = this.id();

      if (!cartId) {
        this.store.commit('cart/loadingCart', false);
        return resolve(null);
      }

      // Load cart
      let error = false;
      let cart = await api.get('carts/' + cartId, {}, true).catch(e => {
        error = true;
      });

      if (error) {

        // Remove cart id
        cookie.setCookie('cart-id', '', -1);

        this.store.commit('cart/loadingCart', false);
        return resolve(false);
      }

      // Save to store
      this.store.commit('cart/cart', cart.data);
      this.cart = cart.data;

      // Trigger global event
      window.dispatchEvent(new CustomEvent('cart-loaded', { detail: this.cart }));

      this.store.commit('cart/loadingCart', false);
      return resolve(cart.data);

    });


  }

  /**
  * Add item to cart
  */
  async add(variantId, qty) {

    return new Promise(async (resolve, reject) => {

      // Loading cart
      this.store.commit('cart/loadingCart', true);

      // If doesn't have cart
      let cart;
      let cartJsonApi
      if (!this.id()) {

        // Cart
        cart = await this.create();
        cartJsonApi = new JsonApi(cart);

      } else if (!this.store.state.cart.cart) {

        let loadCart = await this.get();

        if (!loadCart) {
          return this.add(variantId, qty);
        }

        cart = this.store.state.cart.cart;
        cartJsonApi = this.store.state.cart.cartJsonApi;

      } else {
        cart = this.store.state.cart.cart;
        cartJsonApi = this.store.state.cart.cartJsonApi;
      }



      // Find in current cart to see if already existed
      let cartItems = cartJsonApi.findRelationshipResources(cart.data, 'cart_items');

      if (cartItems && cartItems.length) {

        for (let i = 0; i < cartItems.length; i++) {

          if (variantId === cartItems[i].attributes.variant_id) {

            // Do a patch request
            let cartItem = await api.patch('cart_items/' + cartItems[i].id, {
              data: {
                type: 'cart_items',
                attributes: {
                  quantity: qty
                }
              }
            }).catch(error => {

              let response = error.statusText;

              if (typeof response === 'string') {
                response = JSON.parse(response);
              }

              alert(typeof response.errors === 'undefined' ? error.message : response.errors[0].title);
              return reject(null);
            });

            // Reload cart
            this.get();

            return resolve(cartItem.data);
          }

        }

      }

      // Create new item
      let cartItem = await api.post('cart_items', {
        data: {
          type: 'cart_items',
          attributes: {
            cart_id: cart.data.id,
            variant_id: variantId,
            quantity: qty
          }
        }
      }).catch(error => {
        alert(typeof error.response === 'undefined' ? error.message : error.response.data.errors[0].title);
        return resolve(null);
      });;

      // Reload cart
      this.get();

      return resolve(cartItem.data);

    });

  }

  /**
  * Create cart
  */
  create() {

    return new Promise(async (resolve, reject) => {

      let cart = await api.post('carts').catch(e => {
        return reject(e);
      });

      // Set cookie
      cookie.setCookie('cart-id', cart.data.data.id);

      return resolve(cart.data);

    });

  }

  /**
  * Update cart
  */
  update(data) {

    return new Promise(async (resolve, reject) => {

      // Loading cart
      this.store.commit('cart/loadingCart', true);

      if (!cookie.getCookie('cart-id')) {
        await this.create();
      }

      let cart = await api.patch('carts/' + cookie.getCookie('cart-id'), {
        data: {
          type: 'carts',
          id: cookie.getCookie('cart-id'),
          attributes: data
        }
      }).catch(e => {

        // Stop loading cart
        this.store.commit('cart/loadingCart', false);

        return reject(e);
      });

      // Reload cart
      this.get();

      return resolve(cart.data);

    });

  }

  async delete(removeId) {

    // Cart loading
    this.store.commit('loadingCart', true);

    await api.delete('cart_items/' + removeId);

    // Reload cart
    this.get();

    return true;
  }

  applyCoupon(code) {

    // Find coupon
    return new Promise(async (resolve, reject) => {

      // Find coupon
      let coupon = await api.get('coupons/' + code).catch(e => {
        return reject(e);
      });

      // Apply coupon
      this.update({
        coupon_id: coupon.data.data.id
      }).then(response => {
        return resolve(response);
      }).catch(e => {
        return reject(e);
      });

    });

  }

  getCoupon() {

    if (this.store.state.cart.cartJsonApi) {
      return this.store.state.cart.cartJsonApi.findRelationshipResource(this.cart.data, 'coupon');
    }

    return null;

  }

  subTotalPrice() {
    return this.cart.data ? this.cart.data.attributes.subtotal : 0;
  }

  totalPrice() {
    return this.cart.data ? this.cart.data.attributes.total : 0;
  }

}

export default Cart;
