export default {

  props: ['slug'],

  data() {

    return {
      pageJsonApi: null,
      isLoading: false,
    };

  },

  created() {
    this.loadPage();
  },

  methods: {

    loadPage() {

      this.isLoading = true;

      this.$hiwebBase.api.get('pages/' + this.slug).then(response => {

        // Json api data
        this.pageJsonApi = new this.$hiwebBase.JsonApi(response.data);

        // SEO Helper
        this.$hiwebBase.seo.setTitle(response.data.data.attributes.title);
        this.$hiwebBase.seo.setDescription(response.data.data.attributes.description);

        this.isLoading = false;

        // Dispatch global event
        window.dispatchEvent(new CustomEvent('view-page-detail', { detail: this.pageJsonApi }));

      }).catch(error => {
        this.isLoading = false;
      });

    }

  },

  watch: {

    slug: function() {
      this.loadPage();
    }

  }
  
}