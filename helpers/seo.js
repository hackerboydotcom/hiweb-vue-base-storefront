import $ from 'jquery';

class Seo {

  constructor() {
    this.siteName = (process.env.NODE_ENV === 'production') ? window.shop.name : 'Development';
  }

  setTitle(title) {
    $('title').html(title + ' - ' + this.siteName);
  }

  setDescription(description) {
    $('meta[name=description]').attr('content', description);
  }

}

export default new Seo();