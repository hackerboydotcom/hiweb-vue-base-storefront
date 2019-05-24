export default {

  props: ['tagIds', 'excludeIds'],

  data() {

    return {
      isLoading: true,
      relatedProductsJsonApi: null
    };

  },

  created() {

    if (!this.tagIds || !this.tagIds.length || !this.excludeIds || !this.excludeIds.length) {
      return;
    }

    // Load related products
    this.$hiwebBase.api.get('products', {
      tag_ids: this.tagIds.join(),
      exclude_ids: this.excludeIds.join(),
      limit: 8
    }).then(response => {

      this.isLoading = false;

      this.relatedProductsJsonApi = new this.$hiwebBase.JsonApi(response.data);

    }).catch(error => {
      this.isLoading = false;
    })

  },

}