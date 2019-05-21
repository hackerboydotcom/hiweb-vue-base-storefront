import api from '@/helpers/api';

import JsonApi from '@/helpers/JsonApi';
import seoHelper from '@/helpers/seo';

export default {

  data() {

    return {

      error: null,
      productsJsonApi: null

    };

  },

  created() {
    this.loadProducts();
  },

  mounted() {
    seoHelper.setTitle(process.env.NODE_ENV === 'production' ? window.shop.title : '');
    seoHelper.setDescription(process.env.NODE_ENV === 'production' ? window.shop.description : '');
  },

  methods: {

    async loadProducts() {

      this.error = null;
      let errorOccurred = false;
      let products = await api.get('products', { exclude_fields: 'content' }).catch(e => {

        errorOccurred = true;

        this.error = typeof e.response === 'undefined' ? e.message : e.response.data.errors[0].title;

      });

      if (errorOccurred) {
        return;
      }

      this.productsJsonApi = new JsonApi(products.data);

    }

  }

}