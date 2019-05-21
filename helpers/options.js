class Options {

  constructor(options) {
    this.options = options;
  }

  getOptions() {
    return typeof window.options !== 'undefined' ? window.options : this.options;
  }

  getPageData(page) {
    return (this.getOptions() && this.getOptions().pages) ? this.getOptions().pages[page] : null;
  }

  getPageSections(page) {
    return this.getPageData(page) ? this.getPageData(page).sections : null;
  }

  getSectionData(page, section) {
    return this.getPageSections(page) ? this.getPageSections(page)[section] : null;
  }

  getSectionComponents(page, section) {
    return (this.getSectionData(page, section) && this.getSectionData(page, section).components) ? this.getSectionData(page, section).components : null;
  }

}

export default new Options();