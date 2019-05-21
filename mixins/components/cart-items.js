import cartHelper from '@/helpers/cart';
import imageHelper from '@/helpers/image';
import currencyHelper from '@/helpers/currency';

export default {

  data() {

    return {
      imageHelper, currencyHelper
    };

  },

  methods: {

    findVariant(cartItem) {
      return this.cartJsonApi.findRelationshipResource(cartItem, 'variant');
    },

    findProduct(cartItem) {
      return this.cartJsonApi.findRelationshipResource(this.findVariant(cartItem), 'product');
    },

    findImage(cartItem) {
      return this.cartJsonApi.findRelationshipResource(this.findProduct(cartItem), 'image');
    },

    updateQty(variantId, qty) {

      if (qty < 1) {
        return;
      }

      cartHelper.add(variantId, qty);
    },

    deleteCartItem(cartItemId) {
      return cartHelper.delete(cartItemId);
    }
  },

  computed: {

    cart: function() {
      return this.$store.state.cart;
    },

    cartJsonApi: function() {
      return this.$store.state.cartJsonApi;
    },

    totalPrice: function() {

      let total = 0;

      if (!this.cartJsonApi || !this.cart) {
        return total;
      }

      let cartItems = this.cartJsonApi.findRelationshipResources(this.cart.data, 'cart_items');

      if (!cartItems || !cartItems.length) {
        return total;
      }

      for (let i = 0; i < cartItems.length; i++) {
        total += this.findVariant(cartItems[i]).attributes.price * cartItems[i].attributes.quantity;
      }

      return total;

    }

  }

};