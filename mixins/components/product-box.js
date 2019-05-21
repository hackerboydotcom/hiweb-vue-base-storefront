import imageHelper from '@/helpers/image';
import currencyHelper from '@/helpers/currency';

export default {

  props: {

    product: {
      type: Object,
      description: 'Product object',
      default: function() {
        return {
          id: 'prdxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
          type: 'products',
          attributes: {
            title: 'Default product title and something here',
            description: 'Default product description',
            slug: 'default-product',
            status: 'public'
          }
        };
      }
    },

    variant: {
      type: Object,
      description: 'Default variant of this product',
      default: function() {
        return {
          id: 'variantx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
          type: 'variants',
          attributes: {
            title: null,
            price: 9.99,
            compare_at_price: 19.99,
            status: 'available'
          }
        };
      }
    },

    image: {
      description: 'Product thumbnail',
      default: function() {

        return '/images/default-products/' + Math.floor((Math.random() * 8) + 1) + '.jpg';

      }
    }

  },

  data() {

    return {
      imageHelper, currencyHelper
    };

  }

}