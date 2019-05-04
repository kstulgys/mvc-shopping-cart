;(function(window) {
  const StoreView = class StoreView {
    constructor(wrapper, pubSub) {
      this.wrapper = wrapper
      this.pubSub = pubSub
      this.cache = {}
      this.init()
    }

    init() {
      this.cache.productList = document.querySelector('.products-center')
      this.cache.cartBtnOpen = document.querySelector('.cart-btn')
      this.cache.cartBtnClose = document.querySelector('.close-cart')
      this.cache.cartItemsLength = document.querySelector('.cart-items')
      this.cache.cartOverlay = document.querySelector('.cart-overlay')
      this.cache.cart = document.querySelector('.cart')
      this.cache.cartContent = document.querySelector('.cart-content')
      this.cache.clearCart = document.querySelector('.clear-cart')

      this.pubSub.on('storeProductsReady', this.initialRender.bind(this))
      this.pubSub.on('addToCart', this.addToCart.bind(this))
      this.pubSub.on('removeCartItem', this.removeCartItem.bind(this))
    }

    initialRender({ products, cartItems }) {
      this.displayProducts(products)
      this.displayCartItems(cartItems)
    }

    displayProducts(products) {
      this.cache.productList.textContent = ''
      products.map(product => {
        this.wrapper.insertAdjacentHTML(
          'beforeend',
          this.renderProduct(product)
        )
      })
    }

    displayCartItems(cartItems) {
      this.cache.cartItemsLength.textContent = cartItems.length
      this.cache.cartContent.textContent = ''
      cartItems.forEach(item => {
        this.cache.cartContent.insertAdjacentHTML(
          'beforeend',
          this.renderCartItem(item)
        )
      })
    }

    addToCart({ item, cartLength }) {
      let btn = document.querySelector(`[data-id="${item.id}"]`)
      const text = document.createTextNode('in cart')
      btn.replaceChild(text, btn.childNodes[2])
      btn.disabled = true
      this.cache.cartItemsLength.textContent = cartLength
      this.cache.cartOverlay.classList.add('overlayActive')
      this.cache.cart.classList.add('cartActive')
      this.cache.cartContent.insertAdjacentHTML(
        'beforeend',
        this.renderCartItem(item)
      )
    }
    removeCartItem(id) {
      let item = document.querySelector(`.cart-item[data-id="${id}"]`)
      item.parentElement.removeChild(item)
      let btn = document.querySelector(`[data-id="${id}"]`)
      const text = document.createTextNode('add to cart')
      btn.replaceChild(text, btn.childNodes[2])
      btn.disabled = false
    }

    closeCart() {
      this.cache.cartOverlay.classList.remove('overlayActive')
      this.cache.cart.classList.remove('cartActive')
    }
    openCart() {
      this.cache.cartOverlay.classList.add('overlayActive')
      this.cache.cart.classList.add('cartActive')
    }

    renderProduct({ image, id, title, price, inCart }) {
      return `
            <article class="product">
              <div class="img-container">
                <img
                src=${image}
                alt="product"
                class="product-img"
                />
                <button class="bag-btn" data-id="${id}" ${inCart && 'disabled'}>
                <i class="fas fa-shopping-cart"></i>
                ${inCart ? 'In Cart' : 'Add to Cart'}
                </button>
              </div>
              <h3>${title}</h3>
              <h4>${price}</h4>
            </article>
            `
    }

    renderCartItem({ title, image, price, id }) {
      return `
            <div class="cart-item" data-id="${id}">
              <img src=${image} alt="product" />
              <div>
                <h4>${title}</h4>
                <h5>${price}</h5>
                <span class="remove-item">
                  remove
                </span>
              </div>
              <div>
                <i class="fas fa-chevron-up"></i>
                <p class="item-amount">6</p>
                <i class="fas fa-chevron-down"></i>
              </div>
            </div>
          `
    }
  }
  window.CLASSES.StoreView = StoreView
})(window)
