;(function(window) {
  const StoreController = class StoreController {
    constructor(store, view, pubSub) {
      this.pubSub = pubSub
      this.store = store
      this.view = view
      this.init()
    }

    init() {
      // fire products listener when products in the store
      // this.pubSub.on('storeProductsReady', this.setProductsListener.bind(this))
      this.setProductsListener()
    }

    setProductsListener() {
      this.view.cache.productList.onclick = e => {
        if (e.target.matches('.bag-btn')) {
          const id = e.target.dataset.id
          // add to store cart (store)
          this.store.addToCart(id)
        }
      }
      this.view.cache.cartBtnClose.onclick = () => {
        this.view.closeCart()
      }
      this.view.cache.cartBtnOpen.onclick = () => {
        this.view.openCart()
      }
      this.view.cache.clearCart.onclick = () => {
        this.store.clearCart()
      }
      this.view.cache.cartContent.onclick = e => {
        const id = e.target.closest('.cart-item').dataset.id
        // console.log(id)
        if (e.target.matches('.remove-item')) {
          this.store.removeCartItem(id)
        }
      }
    }
  }

  window.CLASSES.StoreController = StoreController
})(window)
