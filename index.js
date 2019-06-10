import api from './helpers/api';
import cache from './helpers/cache';
import Cart from './helpers/Cart';
import cookie from './helpers/cookie';
import currency from './helpers/currency';
import image from './helpers/image';
import JsonApi from './helpers/JsonApi';
import Options from './helpers/Options';
import seo from './helpers/seo';

import cartStore from './store/cart';

import routes from './routes';

// Mixins
import breadcrumbMixin from './mixins/components/breadcrumb';
import paginationMixin from './mixins/components/pagination';
import cartItemsMixin from './mixins/components/cart-items';
import navbarMixin from './mixins/components/navbar';
import productBoxMixin from './mixins/components/product-box';
import relatedProductsMixin from './mixins/components/related-products';

import appMixin from './mixins/app';

import cartMixin from './mixins/cart/index';

import collectionsCollectionMixin from './mixins/collection/collection';
import collectionsDetailMixin from './mixins/collection/detail';

import HomeMixin from './mixins/home/index';

import PagesCollectionMixin from './mixins/page/collection';
import PagesDetailMixin from './mixins/page/detail';

import ProductsCollectionMixin from './mixins/product/collection';
import ProductsDetailMixin from './mixins/product/detail';
import ProductsDetailImagesMixin from './mixins/product/detail-components/images';
import ProductsDetailOptionMixin from './mixins/product/detail-components/option';

const mixins = {

  app: appMixin,

  components: {
    breadcrumb: breadcrumbMixin,
    pagination: paginationMixin,
    cartItems: cartItemsMixin,
    navbar: navbarMixin,
    productBox: productBoxMixin,
    relatedProducts: relatedProductsMixin
  },

  cart: {
    index: cartMixin
  },

  collection: {
    collection: collectionsCollectionMixin,
    detail: collectionsDetailMixin
  },

  home: {
    index: HomeMixin
  },

  page: {
    collection: PagesCollectionMixin,
    detail: PagesDetailMixin
  },

  product: {
    collection: ProductsCollectionMixin,
    detail: ProductsDetailMixin,
    components: {
      images: ProductsDetailImagesMixin,
      option: ProductsDetailOptionMixin
    }
  }

};

const base = {
	api, cache, cookie, currency, image, JsonApi, seo
}

export default {

  routes, mixins,

  install(Vue, { store, options }) {

    // Add store to base
    base.store = store;

    // Register vuex module
    store.registerModule('cart', cartStore);

    // Inject store to cart
    const cart = new Cart(store);
    base.cart = cart;

    // Inject options to options
    const optionsObject = new Options(options);
    base.options = optionsObject;

    // Export vue to global
    base.Vue = Vue;

    // Inject mixin global event
    Vue.mixin({

      created() {

        // If event listener not added for theme options update
        if (typeof window.optionsUpdatedEventRegistered === 'undefined') {

          // Event registered
          window.optionsUpdatedEventRegistered = true;

          window.addEventListener('message', data => {
            
            let options = data.data;

            if (typeof options === 'object' && (typeof options.components !== 'undefined' || typeof options.pages !== 'undefined')) {
              
              window.options = options;
              
              // Dispatch event
              window.dispatchEvent(new CustomEvent('options-updated', { detail: options }));

            } 

          });

        }

        // Force update on options change
        window.addEventListener('options-updated', () => {
          this.$forceUpdate();
        });

      },

      // Cart data in global
      computed: {

        isLoadingCart: function() {
          return this.$store.state.cart.isLoadingCart;
        },

        cart: function() {
          return this.$store.state.cart.cart;
        },

        cartJsonApi: function() {
          return this.$store.state.cart.cartJsonApi;
        }

      }

    });

    // Load cart
    base.cart.get();

    Vue.prototype.$hiwebBase = base;

    // Attach to window global variable for global code usages
    window.$hiwebBase = base;

  }

}