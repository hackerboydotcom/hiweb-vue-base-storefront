import api from '@/helpers/api';
import JsonApi from '@/helpers/JsonApi';
import seoHelper from '@/helpers/seo';

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

      api.get('pages/' + this.slug).then(response => {

        // Json api data
        this.pageJsonApi = new JsonApi(response.data);

        // SEO Helper
        seoHelper.setTitle(response.data.data.attributes.title);
        seoHelper.setDescription(response.data.data.attributes.description);

        this.isLoading = false;

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