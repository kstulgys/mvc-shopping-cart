;(function(window) {
  const StoreView = class StoreView {
    constructor(wrapper, pubSub) {
      this.wrapper = wrapper
      this.pubSub = pubSub
      this.cache = {}
      this.init()
    }

    init() {
      // cache DOM elements
      this.cache.productList = document.querySelector('.products-center')
      this.cache.cartBtnOpen = document.querySelector('.cart-btn')
      this.cache.cartBtnClose = document.querySelector('.close-cart')
      this.cache.cartItemsLength = document.querySelector('.cart-items')
      this.cache.cartOverlay = document.querySelector('.cart-overlay')
      this.cache.cart = document.querySelector('.cart')
      this.cache.cartContent = document.querySelector('.cart-content')
      this.cache.clearCart = document.querySelector('.clear-cart')
      this.cache.cartTotal = document.querySelector('.cart-total')
      // set data change listeners
      this.pubSub.on('storeProductsReady', this.initialRender.bind(this))
      this.pubSub.on('addToCart', this.addToCart.bind(this))
      this.pubSub.on('removeCartItem', this.removeCartItem.bind(this))
      this.pubSub.on('updateCartTotal', this.updateCartTotal.bind(this))
    }

    initialRender({ products, cart }) {
      this.displayProducts(products)
      this.displayCartItems(cart)
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

    displayCartItems(cart) {
      this.cache.cartItemsLength.textContent = cart.items.length
      this.cache.cartContent.textContent = ''
      cart.items.forEach(item => {
        this.cache.cartContent.insertAdjacentHTML(
          'beforeend',
          this.renderCartItem(item)
        )
      })
      this.cache.cartTotal.textContent = `$${cart.total}`
    }

    addToCart({ item, cart }) {
      const {
        cartItemsLength,
        cartOverlay,
        cart: cartEl,
        cartTotal,
        cartContent
      } = this.cache
      // update cart items count
      cartItemsLength.textContent = cart.items.length
      // make cart panel visible
      cartOverlay.classList.add('overlayActive')
      cartEl.classList.add('cartActive')
      // render cart items
      cartContent.insertAdjacentHTML('beforeend', this.renderCartItem(item))
      // update cart total
      cartTotal.textContent = `$${cart.total}`
      // disable product button
      let btn = document.querySelector(`[data-id="${item.id}"]`)
      const text = document.createTextNode('in cart')
      btn.replaceChild(text, btn.childNodes[2])
      btn.disabled = true
    }

    removeCartItem({ id, cart }) {
      const { cartItemsLength, cartTotal } = this.cache
      // update cart items count
      cartItemsLength.textContent = cart.items.length
      // update cart total
      cartTotal.textContent = `$${cart.total}`
      // remove item
      let item = document.querySelector(`.cart-item[data-id="${id}"]`)
      if (item) {
        item.parentElement.removeChild(item)
      }
      // enable product button
      let btn = document.querySelector(`.bag-btn[data-id="${id}"]`)
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

    updateCartTotal({ id, count, total }) {
      let item = document.querySelector(`.cart-item[data-id="${id}"]`)
      if (item) {
        // update item count
        let countNode = item.childNodes[5].childNodes[3]
        countNode.textContent = count
      }
      // update cart total
      this.cache.cartTotal.textContent = `$${total}`
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

    renderCartItem({ title, image, price, id, count }) {
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
                <p class="item-amount">${count}</p>
                <i class="fas fa-chevron-down"></i>
              </div>
            </div>
          `
    }
  }
  window.CLASSES.StoreView = StoreView
})(window)
