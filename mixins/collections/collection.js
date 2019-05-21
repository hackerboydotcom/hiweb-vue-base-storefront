import api from '@/helpers/api';
import JsonApi from '@/helpers/JsonApi';
import imageHelper from '@/helpers/image';

export default {

  data() {

    return {
      collectionsJsonApi: null,
      imageHelper
    };

  },

  created() {

    // Load collections
    api.get('collections').then(response => {
      this.collectionsJsonApi = new JsonApi(response.data);
    });

  },

  methods: {

    findCollectionImage(collection) {
      return this.collectionsJsonApi.findRelationshipResource(collection, 'image');
    }

  }

}