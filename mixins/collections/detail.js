import api from '@/helpers/api';

import JsonApi from '@/helpers/JsonApi';
import seoHelper from '@/helpers/seo';

export default {

  props: ['slug'],

  data() {
    return {
      collectionJsonApi: null,
      
      productsJsonApi: null,
      isLoadingProducts: false,

      productLimit: 20,
      sortingMode: '',
      error: null
    }
  },

  created() {

    // Load collection
    this.loadCollection();
  },

  methods: {

    loadCollection() {

      this.collection = null;

      api.get('collections', {
        slug: this.slug
      }).then(response => {

        if (typeof response.data.data !== 'undefined') {
          this.collectionJsonApi = new JsonApi(response.data);
        }

        // SEO
        seoHelper.setTitle(this.collectionJsonApi.document.data[0].attributes.title);
        seoHelper.setDescription(this.collectionJsonApi.document.data[0].attributes.description);

        // Load products
        this.loadProducts();

      }).catch(error => {

        this.error = typeof error.response !== 'undefined' ? error.response.data.errors[0].title : error.message;

      });

    },

    loadProducts() {

      this.productsJsonApi = null;

      let query = {
        collection_id: this.collectionJsonApi.document.data[0].id,
        limit: this.productLimit,
        page: this.page,
        exclude_fields: 'content'
      };

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

      this.isLoadingProducts = true;
      api.get('products', query).then(response => {

        if (typeof response.data.data !== 'undefined' && response.data.data.length) {
          this.productsJsonApi = new JsonApi(response.data);
        } else {
          this.productsJsonApi = null;
        }

        this.isLoadingProducts = false;

      }).catch(error => {
        this.productsJsonApi = null;
        this.isLoadingProducts = false;
      });
    }

  },

  watch: {

    slug: function() {
      this.loadCollection();
    },

    sortingMode: function() {
      this.loadProducts();
    }

  },

  computed: {

    page: function() {

      if (typeof this.$route.query.page !== 'undefined') {
        return 1;
      }

      return this.$route.query.page;

    }

  }

}