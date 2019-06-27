export default {

  props: ['option', 'index'],

  data() {

    return {
      selectedOptionValue: null
    };

  },

  methods: {

    /**
    * Check option value is active
    */
    checkOptionValueActive(value) {

      if (!this.$parent.activeVariant) {
        return false;
      }

      return this.$parent.activeVariant.attributes['option' + (index+1)] === value;

    },

    getOptionGuide() {

      return new Promise((resolve, reject) => {

        if (!this.option.option_guide_id) {
          return resolve(null)
        }

        this.$hiwebBase.api.get('option_guides/' + this.option.option_guide_id).then(response => {
          return resolve(response.data.data);
        }).catch(error => {
          return reject(error);
        });

      });

    }

  },

  watch: {

    selectedOptionValue: function(value) {
      this.$parent.selectedOptions['option' + (this.index+1)] = value;
    }

  },

  computed: {

    activeVariant: {

      get: function() {
        return this.$parent.activeVariant;
      },

      set: function(value) {
        this.$parent.activeVariant = value;
      }

    }

  }

}