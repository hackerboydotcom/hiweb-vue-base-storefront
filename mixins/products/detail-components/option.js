import api from '@/helpers/api';

export default {

  props: ['option', 'showAllOptions', 'optionValues', 'activeVariant'],

  data() {

    return {

      optionType: null,

      supportedColors: {
        black: '#111111',
        white: '#ffffff',
        chocolate: '#381d1b',
        grey: '#595959',
        purple: '#4A397F',
        ash: '#CCCCCC',
        navy: '#0A2245',
        blue: '#054ae8',
        'light blue': '#8bb8e8',
        orange: '#FF6600',
        yellow: '#FFaa02',
        gold: '#FFaa02',
        'dark green': '#154734',
        green: '#00984F',
        pink: '#FB4788',
        red: '#b1202d',

      },
      optionValueColorMap: {}

    };

  },

  methods: {

    getOptionType() {

      if (this.optionType) {
        return this.optionType;
      }

      if (this.option.attributes.option_type === 'color' || this.option.attributes.name.search(/color/i) > -1) {

        // Check option values in list supported color
        for (let i = 0; i < this.optionValues.length; i++) {

          let isColor = false;
          let optionValue = this.optionValues[i];

          for (let key in this.supportedColors) {

            let search = new RegExp(key, 'i');

            if (optionValue.attributes.value.search(search) > -1) {
              isColor = true;
              this.optionValueColorMap[optionValue.attributes.value] = this.supportedColors[key];
              break;
            }
          }

          if (!isColor) {
            this.optionType = 'normal';
            return this.optionType;
          }

        }

        this.optionType = 'color';
        return this.optionType;

      }

      this.optionType = 'normal';
      return this.optionType;

    },

    checkActive(optionValueId) {

      if (!this.activeVariant) {
        return false;
      }

      for (let i = 0; i < this.activeVariant.relationships.option_values.data.length; i++) {
        if (optionValueId === this.activeVariant.relationships.option_values.data[i].id) {
          return true;
        }
      }

      return false;

    },

    show(optionValueId) {
      
      if (this.showAllOptions) {
        return true;
      }

      return this.checkAvailable(optionValueId);

    },

    // Check if an option value is available
    checkAvailable(optionValueId) {

      let unavailableVariants = this.$parent.unavailableVariants;

      let compareDataMaker = variant => {

        let ids = [];

        for (let k = 0; k < variant.relationships.option_values.data.length; k++) {

          if (this.optionValueIds.indexOf(variant.relationships.option_values.data[k].id) === -1) {
            ids.push(variant.relationships.option_values.data[k].id);
          }

        }

        ids.sort();

        return JSON.stringify(ids);

      };

      // Find in unavailable variants
      for (let i = 0; i < unavailableVariants.length; i++) {

        let found = false;

        // Find in option_values
        for (let k = 0; k < unavailableVariants[i].relationships.option_values.data.length; k++) {

          if (unavailableVariants[i].relationships.option_values.data[k].id === optionValueId) {

            // Found this unavailable
            found = unavailableVariants[i];
          }

        }

        if (!found) {
          continue;
        }

        // Compare with active variant to see if this option is unavailable
        if (compareDataMaker(this.activeVariant) === compareDataMaker(found)) {

          // Match - so this option is unavailable
          return false;

        }

      }

      return true;
    },

    changeOptionValue(id) {
      this.$parent.$emit('change-option-value', {
        activeId: id, // New active id
        currentId: this.activeOptionValueId // Current active ID
      });
    },

    getOptionGuide() {

      return new Promise((resolve, reject) => {

        if (!this.option.attributes.option_guide_id) {
          return resolve(null)
        }

        api.get('option_guides/' + this.option.attributes.option_guide_id).then(response => {
          return resolve(response.data.data);
        }).catch(error => {
          return reject(error);
        });

      });

    }

  },

  computed: {

    optionValueIds: function() {

      let ids = [];

      for (let i = 0; i < this.optionValues.length; i++) {
        ids.push(this.optionValues[i].id);
      }

      return ids;

    },

    activeOptionValueId: function() {

      if (!this.activeVariant) {
        return null;
      }

      for (let i = 0; i < this.activeVariant.relationships.option_values.data.length; i++) {

        for (let k = 0; k < this.optionValues.length; k++) {

          if (this.optionValues[k].id === this.activeVariant.relationships.option_values.data[i].id) {
            return this.optionValues[k].id;
          }

        }

      }

      return null;

    },

    activeOptionValue: function() {

      let id = this.activeOptionValueId;

      if (!id) {
        return null;
      }

      for (let i = 0; i < this.optionValues.length; i++) {
        if (id === this.optionValues[i].id) {
          return this.optionValues[i];
        }
      }

      return null;

    }

  }

}