import $ from 'jquery';

import faker from './faker';

import cache from './cache';
import JsonApi from './JsonApi';

class Api {

  constructor() {
    
    this.env = process.env.NODE_ENV;

    // Api 
    this.apiUrl = (this.env === 'production') ? window.apiUrl : '';
    this.shopId = (this.env === 'production') ? window.shop.id : '';

  }

  get(path, params, loadNew) {
    console.log('log 1');
    if (this.env === 'development') {
      return faker.data('get', path, params);
    }
    console.log('log 2');
    if (typeof params !== 'object') {
      params = {};
    }

    params.shop_id = this.shopId;

    return new Promise((resolve, reject) => {
      console.log('log 3');
      // Cache
      let cacheKey = path + JSON.stringify(params);
      if (!loadNew && !cache.get(cacheKey)) {
        return resolve(cache.get(cacheKey));
      }

      $.ajax({
        url: this.apiUrl + path,
        data: params,
        dataType: 'json',
        error: error => {console.log('log 4');
          return reject(error);
        },
        success: result => {console.log('log 5');

          let data = {
            data: result
          };

          // Save to cache
          cache.put(cacheKey, data);

          // If products - cache each one
          if (path === 'products') {
            this.cacheProducts(result);
          }console.log('log 6');

          return resolve(data);
        }
      });

    });

  }

  post(path, params) {

    if (this.env === 'development') {
      return faker.data('post', path, params);
    }

    if (typeof params !== 'object') {
      params = {};
    }

    return new Promise((resolve, reject) => {

      $.ajax({
        url: this.apiUrl + path,
        type: 'post',
        dataType: 'json',
        headers: {
          'shop-id': window.shop.id
        },
        data: JSON.stringify(params),

        error: error => {
          return reject(error);
        },

        success: result => {
          return resolve({
            data: result
          });
        }

      });

    });
  }

  patch(path, params) {

    if (this.env === 'development') {
      return faker.data('patch', path, params);
    }

    if (typeof params !== 'object') {
      params = {};
    }

    return new Promise((resolve, reject) => {

      $.ajax({
        url: this.apiUrl + path,
        type: 'patch',
        dataType: 'json',
        headers: {
          'shop-id': window.shop.id
        },
        data: JSON.stringify(params),
        error: error => {
          return reject(error);
        },
        success: result => {
          return resolve({
            data: result
          });
        }
      });

    });

  }

  delete(path, params) {

    if (this.env === 'development') {
      return faker.data('delete', path, params);
    }

    if (typeof params !== 'object') {
      params = {};
    }

    return new Promise((resolve, reject) => {

      $.ajax({
        url: this.apiUrl + path,
        type: 'delete',
        dataType: 'json',
        headers: {
          'shop-id': window.shop.id
        },
        data: JSON.stringify(params),
        error: error => {
          return reject(error);
        },
        success: result => {
          return resolve({
            data: result
          });
        }
      });

    });

  }

  cacheProducts(data) {

    if (!data || typeof data.data === 'undefined' || !data.data.length) {
      return;
    }

    let dataJsonApi = new JsonApi(data);

    for (let i = 0; i < data.data.length; i++) {

      let product = data.data[i];

      // Included data
      let included = [];

      // Merge options
      for (let relationshipResourceKey in product.relationships) {

        let resources = dataJsonApi.findRelationshipResources(product, relationshipResourceKey);

        if (resources) {
          included = included.concat(resources);
        }

      }
      
      // Final data
      let productJsonApi = {
        data: product,
        included: included
      };

      // Save to cache
      cache.put('products/' + product.attributes.slug + JSON.stringify({shop_id: this.shopId}), { data: productJsonApi });

    }

  }

}

export default new Api();