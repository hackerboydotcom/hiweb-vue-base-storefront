export default {

  data() {

    return {

      productsJsonApi: null,
      collectionsJsonApi: null,

      isLoading: false,

      searchTitle: '',
      searchTagName: '',
      searchCollectionId: '',
      sortingMode: 'latest',
      productLimit: 20,
    }

  },

  created() {

    // Import searchTitle from url query
    if (typeof this.$route.query.title !== 'undefined') {
      this.searchTitle = this.$route.query.title;
    }

    // Load collections
    this.$hiwebBase.api.get('collections').then(response => {
      this.collectionsJsonApi = new this.$hiwebBase.JsonApi(response.data);

      // Dispatch global event
      window.dispatchEvent(new CustomEvent('view-product-collection', { detail: this.collectionsJsonApi }));

    });

    this.loadProducts();

  },

  methods: {

    loadProducts(page) {

      this.isLoading = true;
        
      let query = {
        title: this.searchTitle,
        tag_name: this.searchTagName,
        collection_id: this.searchCollectionId,
        limit: this.productLimit,
        exclude_fields: 'content'
      };

      if (page) {
        query.page = page;
      } else {
        query.page = this.page;
      }

      switch (this.sortingMode) {

        case 'best-seller':
          query.order_by = 'paid_order_count';
          query.order_type = 'desc';
        break;

        case 'price-high-to-low':
          query.order_by = 'max_price';
          query.order_type = 'desc';
        break;

        case 'price-low-to-high':
          query.order_by = 'min_price';
          query.order_type = 'asc';
        break;

        default:
          query.order_by = 'created_at';
          query.order_type = 'desc';
        break;

      }

      this.$hiwebBase.api.get('products', query).then(response => {

        this.isLoading = false;

        if (typeof response.data.data !== 'undefined') {
          this.productsJsonApi = new this.$hiwebBase.JsonApi(response.data);
        }

      }).catch(error => {

        this.isLoading = false;

      });

    }

  },

  computed: {

    page: function() {

      if (typeof this.$route.query.page !== 'undefined') {
        return 1;
      }

      return this.$route.query.page;

    }

  },

  watch: {

    '$route': function() {
      this.loadProducts();
    }

  }

}