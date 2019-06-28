export default {

  props: ['slug'],

  data() {

    return {
      
      productJsonApi: null,

      activeVariant: null,

      selectedOptions: {
        option1: null,
        option2: null,
        option3: null
      },
      
      qty: 1,

      addingToCart: false,

      error: null,
      isLoading: false,

    };

  },

  created() {

    this.loadData();

    // Listen to message event
    window.addEventListener('options-updated', () => {
      this.$forceUpdate();
    });


  },

  methods: {

    async loadData() {
      
      this.productJsonApi = null;
      this.activeVariantId = null;
      this.activeVariant = null;
      this.error = null;
      this.isLoading = true;

      // If cache exists
      let cacheKey = 'products/' + this.slug + JSON.stringify({ shop_id: (typeof window.shop !== 'undefined' ? window.shop.id : '') });
      let cache = this.$hiwebBase.cache.get(cacheKey);
      if (cache !== null) {
        this.productJsonApi = new this.$hiwebBase.JsonApi(cache.data);
        this.isLoading = false;
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
      window.dispatchEvent(new CustomEvent('view-product-detail', { detail: this.productJsonApi }));

      // Set active variant
      this.setActiveVariant();

      this.isLoading = false;

    },

    setActiveVariant: function() {

      // If no options and has one variant
      if (this.productJsonApi.document.data.relationships.variants.length === 1) {
        this.activeVariant = this.productJsonApi.findRelationshipResource(this.productJsonApi.document.data, 'variants');
      }
      
    },

    changeQty(number) {
      this.qty += number;
    },

    async addToCart() {

      if (!this.allOptionsSelected) {
        return this.optionsReminder();
      }

      if (!this.activeVariant || this.activeVariant.attributes.status !== 'available') {
        return this.outOfStock();
      }

      this.addingToCart = true;

      let error = null;

      let cartItem = await this.$hiwebBase.cart.add(this.activeVariant.id, this.qty).catch(error => {
        error = true;
      });

      this.addingToCart = false;

      if (!error) {
        // Redirect to cart page
        this.$router.push({ name: 'cart.index' });
      }

      // Dispatch event
      window.dispatchEvent(new Event('add-to-cart'));

    },

    optionsReminder() {
      alert('Please select all options');
    },

    outOfStock() {
      alert('Sorry, this item is out of stock or not available at the moment');
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
    },

    selectedOptionsWatcher: function() {

      // Find active variant
      for (let i = 0; i < this.variants.length; i++) {

        if (this.variants[i].attributes.option1 === this.selectedOptions.option1
          && this.variants[i].attributes.option2 === this.selectedOptions.option2
          && this.variants[i].attributes.option3 === this.selectedOptions.option3
          ) {
          this.activeVariant = this.variants[i];
          return;
        }

      }

      this.activeVariant = null;

    }

  },

  computed: {

    variants: function() {
    
      let variants = this.productJsonApi.findRelationshipResources(this.productJsonApi.document.data, 'variants');
        
      return variants ? variants : [];

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

    },

    allOptionsSelected() {

      switch (this.productJsonApi.document.data.attributes.options.length) {

        case 1:
        return this.selectedOptions.option1 ? true : false;
        break;

        case 2:
        return (this.selectedOptions.option1 && this.selectedOptions.option2) ? true : false;
        break;

        case 3:
        return (this.selectedOptions.option1 && this.selectedOptions.option2 && this.selectedOptions.option3) ? true : false;
        break

      }

      return true;

    },

    selectedOptionsWatcher: function() {
      return JSON.stringify(this.selectedOptions);
    }

  }

}