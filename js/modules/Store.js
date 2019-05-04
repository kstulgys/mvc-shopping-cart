// import items from './products'

;(function(window) {
  const Store = class Store {
    constructor(pubSub) {
      this.pubSub = pubSub
      this.allProducts = []
      this.cart = { items: [], total: 0 }
      this.init()
    }

    async init() {
      // get store data
      await this.getCart()
      await this.getStoreProducts()
      // emit data to update UI
      this.pubSub.emit('storeProductsReady', {
        products: this.allProducts,
        cart: this.cart
      })
      this.saveToLocalStorage()
    }

    async getStoreProducts() {
      const { items = [] } = await fetch('products.json').then(res =>
        res.json()
      )
      const products = items.map(item => {
        const { title, price } = item.fields
        const { id } = item.sys
        const image = item.fields.image.fields.file.url
        return { title, price, id, image, inCart: this.isInCart(id) }
      })
      // set store data
      this.allProducts = products
    }

    async getCart() {
      // get cart data from localStorage
      const cart = await JSON.parse(localStorage.getItem('cart'))
      this.cart = cart || { items: [], total: 0 }
    }

    addToCart(id) {
      // find item
      let item = this.allProducts.find(item => item.id === id)
      if (!this.isInCart(id)) {
        // add item to cart
        item.count = 1
        this.cart.items = [...this.cart.items, item]
        // update cart total
        this.cart.total += item.price
        this.cart.total = Number(this.cart.total.toFixed(2))

        this.allProducts.find(_item => _item.id === id).inCart = true
        // emit data to update UI
        this.pubSub.emit('addToCart', {
          item,
          cart: this.cart
        })
      }
      this.saveToLocalStorage()
    }

    isInCart(id) {
      return this.cart.items.findIndex(item => item.id === id) > -1
    }

    removeCartItem(id) {
      // find cart item
      let item = this.cart.items.find(item => item.id === id)
      // remove cart item from cart
      this.cart.items = this.cart.items.filter(item => item.id !== id)
      // update cart total
      this.cart.total -= item.price
      this.cart.total = Number(this.cart.total.toFixed(2))
      // emit data to update UI
      this.pubSub.emit('removeCartItem', {
        id,
        cart: this.cart
      })
      this.saveToLocalStorage()
    }

    clearCart() {
      this.cart = { items: [], total: 0 }
      this.saveToLocalStorage()
      this.init()
    }

    updateCartTotal(id, type) {
      // find item
      let item = this.cart.items.find(item => item.id === id)

      if (item.count === 1 && type === 'dec') {
        this.removeCartItem(id)
        return
      } else {
        if (type === 'inc') {
          // update item count
          this.cart.items.find(item => item.id === id).count += 1
          // update cart total
          this.cart.total += item.price
        }

        if (type === 'dec') {
          // update item count
          this.cart.items.find(item => item.id === id).count -= 1
          // update cart total
          this.cart.total -= item.price
        }
      }

      this.cart.total = Number(this.cart.total.toFixed(2))
      // emit data to update UI
      this.pubSub.emit('updateCartTotal', {
        id,
        count: this.cart.items.find(item => item.id === id).count,
        total: this.cart.total
      })
      this.saveToLocalStorage()
    }

    saveToLocalStorage() {
      localStorage.setItem('cart', JSON.stringify(this.cart))
      console.log('allProducts', this.allProducts)
      console.log('cart', this.cart.items, this.cart.total)
      console.warn('**************************************')
    }
  }
  window.CLASSES.Store = Store
})(window)
