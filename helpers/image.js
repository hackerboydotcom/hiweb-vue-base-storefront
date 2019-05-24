class Image {

  url(image, baseUrl) {

    let path;

    baseUrl = baseUrl ? baseUrl : 'https://storage.hiweb.io/';

    if (typeof image === 'string') {
        path = baseUrl + image;
    } else if (image && typeof image === 'object' && typeof image.id !== 'undefined') {
        path = baseUrl + image.attributes.path;
    } else {
        path = '/assets/default.png';
    }

    return path;
  }

  resize(image, size, crop) {

    let resizeUrl = 'https://resize.hiweb.io/';

    size = size > 0 ? size : 300;
    crop = crop ? 1 : false;

    return this.url(image, resizeUrl) + '?size=' + size + '&crop=' + crop;

  }

}

export default new Image();
