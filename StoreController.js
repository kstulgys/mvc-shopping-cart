;(function(window) {
  const StoreController = class StoreController {
    constructor(store, view, pubSub) {
      this.pubSub = pubSub
      this.store = store
      this.view = view
      this.init()
    }

    init() {
      this.pubSub.on(
        'storeProductsReady',
        this.setProductBtnListener.bind(this)
      )
      this.store.getState()
    }
    setProductBtnListener() {
      this.view.displayProducts(this.store.allProducts)
      this.view.cache.productButtons.forEach(btn => {
        btn.addEventListener('click', e => {
          this.store.addToCart(e.target.dataset.id)
          this.store.getState()
        })
      })
    }
  }
  window.CLASSES.StoreController = StoreController
})(window)
