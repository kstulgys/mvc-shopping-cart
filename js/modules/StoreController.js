;(function(window) {
  const StoreController = class StoreController {
    constructor(store, view, pubSub) {
      this.pubSub = pubSub
      this.store = store
      this.view = view
      this.init()
    }

    init() {
      this.setProductsListener()
    }

    setProductsListener() {
      const {
        productList,
        cartBtnClose,
        cartBtnOpen,
        clearCart,
        cartContent
      } = this.view.cache

      productList.onclick = e => {
        if (e.target.matches('.bag-btn')) {
          const id = e.target.dataset.id
          this.store.addToCart(id)
        }
      }

      cartBtnClose.onclick = () => {
        this.view.closeCart()
      }

      cartBtnOpen.onclick = () => {
        this.view.openCart()
      }

      clearCart.onclick = () => {
        this.store.clearCart()
      }

      cartContent.onclick = e => {
        const id = e.target.closest('.cart-item').dataset.id
        if (e.target.matches('.remove-item')) {
          this.store.removeCartItem(id)
        }
        if (e.target.matches('.fa-chevron-up')) {
          this.store.updateCartTotal(id, 'inc')
        }
        if (e.target.matches('.fa-chevron-down')) {
          this.store.updateCartTotal(id, 'dec')
        }
      }
    }
  }

  window.CLASSES.StoreController = StoreController
})(window)
