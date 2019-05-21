import cartHelper from '@/helpers/cart';
import imageHelper from '@/helpers/image';
import currencyHelper from '@/helpers/currency';
import api from '@/helpers/api';

export default {

  data() {

    return {
      imageHelper, currencyHelper, cartHelper,
    };

  },

  created() {

  },

  computed: {

    cart: function() {
      return this.$store.state.cart;
    },

    cartJsonApi: function() {
      return this.$store.state.cartJsonApi;
    }

  }

};