class Router {

  routeTo(resource, relatedResource) {

    if (typeof resource !== 'object' || typeof resource.type === 'undefined' || typeof resource.attributes === 'undefined') {
      return '/';
    }

    if (resource.type === 'products') {
      
      return {
        name: 'product.detail',
        params: {
          slug: resource.attributes.slug
        }
      };

    }

    if (resource.type === 'collections') {

      return {
        name: 'collection.detail',
        params: {
          slug: resource.attributes.slug
        }
      };

    }

    if (resource.type === 'pages') {

      return {
        name: 'page.detail',
        params: {
          slug: resource.attributes.slug
        }
      };

    }

    if (resource.type === 'menu_links') {

      switch (resource.attributes.link_type) {

        case 'all-products':
        return '/products';
        break;

        case 'all-collections':
        return '/collections';
        break;

        case 'all-pages':
        return '/pages';
        break;

        case 'home':
        return '/';
        break;

        default:
        return '/'
        break;

      }

    }

    return '/';

  }

}

export default new Router();