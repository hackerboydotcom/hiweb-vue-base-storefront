class Routes {

  component(key) {

    if (typeof this.components[key] === 'object') {
      return this.components[key];
    }

    return () => import('./views/Default');

  }

  routes(components) {

    this.components = components;

    return [

      {
        path: '/',
        name: 'home.index',
        components: {
          default: this.component('home.index'),
        }
      },

      {
        props: true,
        path: '/products/:slug',
        name: 'product.detail',
        component: this.component('product.detail')
      },

      {
        props: true,
        path: '/products',
        name: 'product.collection',
        component: this.component('product.collection')
      },

      {
        props: true,
        path: '/collections',
        name: 'collection.collection',
        component: this.component('collection.collection')
      },

      {
        props: true,
        path: '/collections/:slug',
        name: 'collection.detail',
        component: this.component('collection.detail')
      },

      {
        props: true,
        path: '/cart',
        name: 'cart.index',
        component: this.component('cart.index')
      },

      {
        path: '/payment/successful',
        name: 'payment.successful',
        component: this.component('payment.successful')
      },

      {
        path: '/payment/cancelled',
        name: 'payment.cancelled',
        component: this.component('payment.cancelled')
      },

      {
        path: '/pages',
        name: 'page.collection',
        component: this.component('page.collection')
      },

      {
        props: true,
        path: '/pages/:slug',
        name: 'page.detail',
        component: this.component('page.detail')
      }

    ];

  }

}

export default new Routes();