import cartHelper from '@/helpers/cart';

export default {

  created() {

    // Load cart
    cartHelper.get();
  }

}