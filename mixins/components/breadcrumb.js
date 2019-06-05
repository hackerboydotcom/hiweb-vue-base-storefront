export default {

  props: ['jsonapi'],

  data() {

    return {
      links: []
    };

  },

  created() {

    this.generateLinks();

  },

  methods: {

    generateLinks() {

      if (!this.jsonapi) {
        return;
      }

      // Generate links
      switch (this.jsonapi.document.data.type) {

        case 'products':
        this.generateProductLinks();
        break;

        case 'collections':
        this.generateCollectionLinks();
        break;

      }

    },

    async generateProductLinks() {

      const links = [{ text: 'Home', to: { name: 'home.index' }}];

      try {

        // Load collections
        const getCollections = await this.$hiwebBase.api.get('collections').catch(e => {
          throw e.message;
        });

        const collections = getCollections.data.data;

        // Find primary collection
        let primaryCollection = null;

        // collection_product relationships data
        const collectionProducts = this.jsonapi.findRelationshipResources(this.jsonapi.document.data, 'collection_product');

        if (!collectionProducts.length) {
          throw 'product has no collection relationships';
        }

        // Scan collections to find primary
        for (let i = 0; i < collections.length; i++) {

          let foundPrimary = false;
          const collection = collections[i];

          // Scan collection_product relationships to find primary one
          for (let k = 0; k < collectionProducts.length; k++) {

            // Has relationship with this collection
            if (collectionProducts[k].attributes.collection_id === collection.id) {

              primaryCollection = collection;
              
              // If this is primary
              if (collectionProducts[k].attributes.primary) {
                foundPrimary = true;
                break;
              }
                
            }

          }

          if (foundPrimary) {
            break;
          }

        }

        let collectionLinks = [];

        let makeCollectionLinks = collection => {

          collectionLinks.push({
            text: collection.attributes.title,
            to: { name: 'collections.detail', params: { slug: collection.attributes.slug } }
          });

          // Find parent
          if (collection.attributes.parent_id) {

            for (let i = 0; i < collections.length; i++) {

              if (collections[i].id === collection.attributes.parent_id) {
                makeCollectionLinks(collections[i]);
              }

            }

          }

        };

        makeCollectionLinks(primaryCollection);

        collectionLinks.reverse();

        links = links.concat(collectionLinks);

      } catch (e) {
        console.log('Breadcrumb error: ' + e.message);
      }

      links.push({
        text: this.jsonapi.document.data.attributes.title
      });

      return this.links = links;

    },

    generateCollectionLinks() {

    }

  },

  watch: {

    jsonapi: function() {
      this.generateLinks();
    }

  }

}