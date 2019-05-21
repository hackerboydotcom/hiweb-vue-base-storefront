import api from '@/helpers/api';
import JsonApi from '@/helpers/JsonApi';
import imageHelper from '@/helpers/image';
import seoHelper from '@/helpers/seo';

export default {

  data() {
    
    return {
      pagesJsonApi: null,
      isLoading: false,
      pageLimit: 20,
      imageHelper
    }

  },

  created() {

    this.loadPages();

    seoHelper.setTitle('Pages');

  },

  methods: {

    loadPages(page) {

      this.isLoading = true;

      let query = {
        limit: this.pageLimit
      };

      if (page) {
        query.page = page;
      } else {
        query.page = this.page;
      }

      api.get('pages', query).then(response => {

        this.isLoading = false;

        if (typeof response.data.data !== 'undefined') {
          this.pagesJsonApi = new JsonApi(response.data);
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
      this.loadPages();
    }

  }

}