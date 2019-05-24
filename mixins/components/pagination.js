export default {

  props: ['numberOfResults', 'resultsPerPage'],

  computed: {

    page() {
      let page = this.$route.query.page ? parseInt(this.$route.query.page) : 1;
      return isNaN(page) ? 1 : page;
    }

  },

  methods: {

    previous() {

      if (this.page === 1) {
        return;
      }

      // Replace route
      let query = Object.assign({}, this.$route.query);
      query.page = this.page - 1;
      this.$router.push({ query: query});

    },

    next() {

      // Replace route
      let query = Object.assign({}, this.$route.query);
      query.page = this.page + 1;
      this.$router.push({ query: query});

    }

  }

}