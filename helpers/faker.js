class Faker {

  data(method, path, params) {

    return new Promise(async resolve => {

      // Fake data for get
      if (method === 'get') {

        // Get products
        if (path === 'products') {
          let data = await import('../fake-data/products.js');
          return resolve(data.default);
        }

        // Get single product
        if (path.includes('products/')) {
          let data = await import('../fake-data/product-' + (Math.random() < 0.5 ? 1 : 2) + '.js');
          return resolve(data.default);
        } 

        // Get collections
        if (path === 'collections') {
          let data = await import('../fake-data/collections.js');
          return resolve(data.default);
        }

        // Get cart
        if (path.includes('carts')) {
          let data = await import('../fake-data/carts.js');
          return resolve(data.default);
        }

        // Get pages
        if (path === 'pages') {
          let data = await import('../fake-data/pages.js');
          return resolve(data.default);
        }

        // Get page
        if (path.includes('pages/')) {
          let data = await import('../fake-data/page.js');
          return resolve(data.default);
        }

        // Get coupon
        if (path.includes('coupons/')) {
          let data = await import('../fake-data/coupon.js');
          return resolve(data.default);
        }

      }

      // Fake data for post
      if (method === 'post') {

        // Create cart
        if (path.includes('carts')) {
          let data = await import('../fake-data/carts.js');
          return resolve(data.default);
        }

        // Cart item
        if (path === 'cart_items') {
          let data = await import('../fake-data/post-cart-items.js');
          return resolve(data.default);
        }

      }

      // Fake data for path
      if (method === 'patch') {

        // Update cart item
        if (path.includes('cart_items/')) {
          let data = await import('../fake-data/post-cart-items.js');
          return resolve(data.default);
        }

      }

      // Fake data for delete
      if (method === 'delete') {

        // Delete cart item
        // Update cart item
        if (path.includes('cart_items')) {
          let data = await import('../fake-data/post-cart-items.js');
          return resolve(data.default);
        }

      }

    });

  }

}

export default new Faker();