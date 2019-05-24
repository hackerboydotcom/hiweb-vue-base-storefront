export default {

  props: ['slug'],

  data() {

    return {
      
      productJsonApi: null,

      activeVariantId: null,
      activeVariant: null,
      
      qty: 1,

      addingToCart: false,

      error: null,

    };

  },

  created() {

    this.loadData();

    // Listen to message event
    window.addEventListener('message', data => {
      this.$forceUpdate();
    });

    // Option value change
    this.$on('change-option-value', data => {

      let variants = this.productJsonApi.findRelationshipResources(this.productJsonApi.document.data, 'variants');

      let newOptionValueData;
      if (this.activeVariant) {

        newOptionValueData = JSON.parse(JSON.stringify(this.activeVariant.relationships.option_values.data));

        for (let i = 0; i < newOptionValueData.length; i++) {

          if (newOptionValueData[i].id === data.currentId) {
            newOptionValueData[i].id = data.activeId;
            break;
          }

        }

      }
        
      // Compare data maker
      let compareDataMaker = function(optionValueData) {
        
        let compareData = [];

        for (let i = 0; i < optionValueData.length; i++) {
          compareData.push(optionValueData[i].id);
        }

        compareData.sort();

        return JSON.stringify(compareData);

      }

      // If active variant is set
      if (this.activeVariant) {
      
        // Find new active variant
        for (let i = 0; i < variants.length; i++) {

          let compareOptionValueData = JSON.parse(JSON.stringify(variants[i].relationships.option_values.data));
          compareOptionValueData.sort();

          if (compareDataMaker(newOptionValueData) === compareDataMaker(compareOptionValueData)) {

            this.activeVariantId = variants[i].id;

            // If found but unavailable
            if (this.unavailableVariantIds.indexOf(this.activeVariantId) > -1) {
              this.activeVariantId = null;
              this.activeVariant = null;
            } else {

              // Set active variant
              this.setActiveVariant();
              return;

            }

          }

        }

      }

      // If active variant is not set
      if (!this.activeVariant) { 

        for (let i = 0; i < variants.length; i++) {

          // Find a variant available with selected option
          for (let k = 0; k < variants[i].relationships.option_values.data.length; k++) {

            // Found and available
            if (variants[i].relationships.option_values.data[k].id === data.activeId && this.unavailableVariantIds.indexOf(variants[i].id) === -1) {
              this.activeVariantId = variants[i].id;
              this.setActiveVariant();
              return;
            }

          }

        }

      }

    });

  },

  methods: {

    async loadData() {
      
      this.productJsonApi = null;
      this.activeVariantId = null;
      this.activeVariant = null;
      this.error = null;

      // If cache exists
      let cacheKey = 'products/' + this.slug + JSON.stringify({ shop_id: (typeof window.shop !== 'undefined' ? window.shop.id : '') });
      let cache = this.$hiwebBase.cache.get(cacheKey);
      if (cache !== null) {
        this.productJsonApi = new this.$hiwebBase.JsonApi(cache);
      }

      // data
      let find;

      if (typeof window.productData !== 'undefined' && typeof window.productData[this.slug] !== 'undefined') {
        find = {data: window.productData[this.slug]};
      } else {

        find = await this.$hiwebBase.api.get('products/' + this.slug, {}, true).catch(error => {
          this.error = error;
        });

        // Save data
        if (!this.error && typeof window.productData !== 'undefined') {
          window.productData[this.slug] = find.data;
        }

      }

      if (this.error) {
        return;
      }

      // SEO
      this.$hiwebBase.seo.setTitle(find.data.data.attributes.title);
      this.$hiwebBase.seo.setDescription(find.data.data.attributes.description);

      // Json Api data
      this.productJsonApi = new this.$hiwebBase.JsonApi(find.data);

      // Dispatch global event
      window.dispatchEvent(new CustomEvent('view-product-detail', this.productJsonApi));

      // Set active variant
      this.setActiveVariant();

    },

    setActiveVariant: function() {

      // If all variants are not available
      if (this.unavailableVariants.length === this.productJsonApi.document.data.relationships.variants.data.length) {
        return false;
      }

      // Lowest price variant will be activated by default
      if (!this.activeVariantId) {

        let lowestPrice = 0;
          
        for (let i = 0; i < this.productJsonApi.document.data.relationships.variants.data.length; i++) {

          let variant = this.productJsonApi.findIncludedResource('variants', this.productJsonApi.document.data.relationships.variants.data[i].id);

          if (this.unavailableVariantIds.indexOf(variant.id) === -1 && (!lowestPrice || variant.attributes.price < lowestPrice)) {
            this.activeVariantId = variant.id;
            lowestPrice = variant.attributes.price;
          }

        }


      }

      let variants = this.productJsonApi.findRelationshipResources(this.productJsonApi.document.data, 'variants', { id: this.activeVariantId });

      for (let i = 0; i < variants.length; i++) {

        if (variants[i].id === this.activeVariantId) {
          return this.activeVariant = variants[i];
        }

      }
    },

    changeQty(number) {
      this.qty += number;
    },

    async addToCart() {

      // Check variant available
      if (this.unavailableVariantIds.indexOf(this.activeVariantId) > -1) {
        return alert('The option you selected (' + this.activeVariant.attributes.title + ') is not available.');
      }

      if (!this.activeVariantId) {
        return alert('Please select your option first');
      }

      this.addingToCart = true;

      let error = null;

      let cartItem = await this.$hiwebBase.cart.add(this.activeVariantId, this.qty).catch(error => {
        error = true;
      });

      this.addingToCart = false;

      if (!error) {
        // Redirect to cart page
        this.$router.push({ name: 'cart.index' });
      }

      // Dispatch event
      window.dispatchEvent(new Event('add-to-cart'));

    }

  },

  watch: {

    qty: function() {
      if (this.qty < 1) {
        this.qty = 1;
      }
    },

    slug: function() {
      this.loadData();
    }

  },

  computed: {

    unavailableVariantIds() {

      let ids = [];

      for (let i = 0; i < this.unavailableVariants.length; i++) {
        ids.push(this.unavailableVariants[i].id);
      }

      return ids;

    },

    unavailableVariants() {

      let unavailableVariants = [];
      let variants = this.productJsonApi.findRelationshipResources(this.productJsonApi.document.data, 'variants');

      for (let i = 0; i < variants.length; i++) {

        if (variants[i].attributes.status !== 'available') {
          unavailableVariants.push(variants[i]);
        }

      }

      return unavailableVariants;

    },

    images: function() {

      if (this.activeVariant) {
        let variantImages = this.productJsonApi.findRelationshipResources(this.activeVariant, 'images');

        if (variantImages && variantImages.length) {
          return variantImages;
        }
      }

      return this.productJsonApi.findRelationshipResources(this.productJsonApi.document.data, 'images');

    },

    tagIds: function() {

      let tagIds = [];
      let tags = this.productJsonApi.findRelationshipResources(this.productJsonApi.document.data, 'tags');

      if (!tags) {
        return [];
      }

      for (let i = 0; i < tags.length; i++) {
        tagIds.push(tags[i].id);
      }

      return tagIds;

    }

  }

}