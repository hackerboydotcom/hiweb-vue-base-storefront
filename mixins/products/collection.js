import JsonApi from '@/helpers/JsonApi';
import currencyHelper from '@/helpers/currency';
import cartHelper from '@/helpers/cart';
import seoHelper from '@/helpers/seo';

import api from '@/helpers/api';

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
    api.get('collections').then(response => {
      this.collectionsJsonApi = new JsonApi(response.data);
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

      api.get('products', query).then(response => {

        this.isLoading = false;

        if (typeof response.data.data !== 'undefined') {
          this.productsJsonApi = new JsonApi(response.data);
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