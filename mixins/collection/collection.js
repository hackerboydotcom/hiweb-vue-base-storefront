export default {

  data() {

    return {
      isLoading: false,
      collectionsJsonApi: null
    };

  },

  created() {

    // Load collections
    this.isLoading = true;
    this.$hiwebBase.api.get('collections').then(response => {
      
      this.collectionsJsonApi = new this.$hiwebBase.JsonApi(response.data);

      // Dispatch global event
      window.dispatchEvent(new CustomEvent('view-collection-collection', { detail: this.collectionsJsonApi }));

      this.isLoading = false;

    }).catch(e => {
      this.isLoading = false;
    });

  },

  methods: {

    findCollectionImage(collection) {
      return this.collectionsJsonApi.findRelationshipResource(collection, 'image');
    }

  }

}