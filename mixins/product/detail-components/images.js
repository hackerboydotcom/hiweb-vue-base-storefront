export default {

  props: {

    images: {
      type: Array,
      description: 'Image data',
      default() {
        return [
          {
            id: 'image-1',
            type: 'images',
            attributes: {
              path: '/images/default.jpg'
            }
          },
          {
            id: 'image-2',
            type: 'images',
            attributes: {
              path: '/images/default.png'
            }
          }
        ];
      }
    }

  },

  data() {

    return {
      activeImageId: null,
    };

  },

  methods: {

    setActiveImageId(id) {
      this.activeImageId = id;
    }

  },

  computed: {

    activeImage: function() {

      // The first image will be the active one by default
      if (!this.activeImageId) {
        this.activeImageId = this.images[0].id;
        return this.images[0];
      }

      // Find active image by activeImageId
      for (let i = 0; i < this.images.length; i++) {

        if (this.images[i].id === this.activeImageId) {
          return this.images[i];
        }

      }

      return this.images[0];

    }

  }

}