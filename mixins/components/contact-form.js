export default {

  props: ['title', 'hidePhone', 'successMessage'],


  data() {

    return {
      name: '',
      phone: '',
      email: '',
      message: '',

      isSending: false,
      isSuccess: false,
      errors: [],

    };

  },

  methods: {

    send() {

      // Send contact request
      this.isSuccess = false;
      this.isSending = true;
      this.errors = [];

      this.$hiwebBase.api.post('contacts', {
        data: {
          type: 'contacts',
          attributes: {
            shop_id: typeof window.shop !== 'undefined' ? window.shop.id : null,
            name: this.name,
            phone: this.phone,
            email: this.email,
            message: this.message
          }
        }
      }).then(response => {
        this.isSuccess = true;
        this.isSending = false;
      }).catch(error => {

        try {

          let errors = JSON.parse(error.responseText).errors;
          this.errors = errors;

        } catch (e) {

          this.errors.push({ title: 'Failed to send contact message' });

        };
  
        this.isSending = false;

      });

    }

  }

}