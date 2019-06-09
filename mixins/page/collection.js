export default {

  data() {
    
    return {
      pagesJsonApi: null,
      isLoading: false,
      pageLimit: 20,
    }

  },

  created() {

    this.loadPages();

    this.$hiwebBase.seo.setTitle('Pages');

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

      this.$hiwebBase.api.get('pages', query).then(response => {

        this.isLoading = false;

        if (typeof response.data.data !== 'undefined') {
          this.pagesJsonApi = new this.$hiwebBase.JsonApi(response.data);
        }

        // Dispatch global event
        window.dispatchEvent(new CustomEvent('view-page-collection', {detail: this.pagesJsonApi }));

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