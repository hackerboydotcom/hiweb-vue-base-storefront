export default {

  created() {

    // Dispatch global event
    window.dispatchEvent(new CustomEvent('app-created'));

  }

}