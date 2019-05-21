class Currency {

  symbol() {
    return '$';
  }

  convert(amount) {
    return Math.round(amount*100)/100;
  }

  formatted(amount) {
    return this.symbol() + this.convert(amount);
  }

}

export default new Currency();