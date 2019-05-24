export default {

  data() {

    return {

      error: null,
      productsJsonApi: null

    };

  },

  created() {
    this.loadProducts();

    // Dispatch global event
    window.dispatchEvent(new CustomEvent('view-home-index'));

  },

  mounted() {
    this.$hiwebBase.seo.setTitle(process.env.NODE_ENV === 'production' ? window.shop.title : '');
    this.$hiwebBase.seo.setDescription(process.env.NODE_ENV === 'production' ? window.shop.description : '');
  },

  methods: {

    async loadProducts() {

      this.error = null;
      let errorOccurred = false;
      let products = await this.$hiwebBase.api.get('products', { exclude_fields: 'content' }).catch(e => {

        errorOccurred = true;

        this.error = typeof e.response === 'undefined' ? e.message : e.response.data.errors[0].title;

      });

      if (errorOccurred) {
        return;
      }

      this.productsJsonApi = new this.$hiwebBase.JsonApi(products.data);

    }

  }

}