import cartHelper from '@/helpers/cart';
import currencyHelper from '@/helpers/currency';

export default {

  data() {

    return {
      cartHelper, currencyHelper
    }

  },

  created() {

  },

  methods: {

    findVariant(cartItem) {
      return this.cartJsonApi.findRelationshipResource(cartItem, 'variant');
    },

    findProduct(cartItem) {
      return this.cartJsonApi.findRelationshipResource(this.findVariant(cartItem), 'product');
    },

  },

  computed: {

    cart: function() {
      return this.$store.state.cart;
    },

    cartJsonApi: function() {
      return this.$store.state.cartJsonApi;
    },

    relatedIds: function() {

      let cartItems = this.cartJsonApi.findRelationshipResources(this.cart.data, 'cart_items');

      if (!cartItems) {
        return {
          tag_ids: [],
          exclude_ids: []
        };
      }

      let tagIds = [];
      let excludeIds = [];

      for (let i = 0; i < cartItems.length; i++) {

        let product = this.findProduct(cartItems[i]);

        if (excludeIds.indexOf(product.id) < 0) {
          excludeIds.push(product.id);
        }

        if (product.relationships.tags.data.length) {

          for (let k = 0; k < product.relationships.tags.data.length; k++) {

            if (tagIds.indexOf(product.relationships.tags.data[k].id) < 0) {
              tagIds.push(product.relationships.tags.data[k].id);
            }

          }

        }

      }

      return {
        tag_ids: tagIds,
        exclude_ids: excludeIds
      };

    }

  }

}