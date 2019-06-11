export default {

  mounted() {

    // Wait for cart
    let waitForCart = setInterval(() => {

      // If cart is null
      if (!this.$hiwebBase.cart.id()) {
        
        clearInterval(waitForCart);

        // Dispatch global event
        window.dispatchEvent(new CustomEvent('view-cart', { detail: null }));

      } else if (!this.cart) { // Cart is loading
        return;
      }

      // Cart loaded
      clearInterval(waitForCart);

      // Return cart data
      window.dispatchEvent(new CustomEvent('view-cart', { detail: this.cart }));

    }, 100);

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