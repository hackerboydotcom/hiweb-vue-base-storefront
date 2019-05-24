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

    image: {
      description: 'Product thumbnail',
      default: function() {

        return '/images/default-products/' + Math.floor((Math.random() * 8) + 1) + '.jpg';

      }
    }

  }

}