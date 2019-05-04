// import items from './products'

;(function(window) {
  const Store = class Store {
    constructor(pubSub) {
      this.pubSub = pubSub
      this.allProducts = []
      this.cartItems = []
      this.init()
    }

    async init() {
      await this.getCartItems()
      await this.getStoreProducts()
      this.pubSub.emit('storeProductsReady', {
        products: this.allProducts,
        cartItems: this.cartItems
      })
      this.getState()
    }

    addToCart(id) {
      const product = this.allProducts.find(item => item.id === id)
      if (!this.isInCart(id)) {
        this.cartItems.push(product)
        this.allProducts.find(item => item.id === id).inCart = true
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems))
        this.pubSub.emit('addToCart', {
          item: product,
          cartLength: this.cartItems.length
        })
      }
      this.getState()
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
      this.allProducts = products
    }

    async getCartItems() {
      const cartItems = await JSON.parse(localStorage.getItem('cartItems'))
      this.cartItems = cartItems || []
    }

    isInCart(id) {
      return this.cartItems.findIndex(item => item.id === id) > -1
    }

    getState() {
      console.log('allProducts', this.allProducts)
      console.log('cartItems', this.cartItems)
    }

    removeCartItem(id) {
      this.cartItems = this.cartItems.filter(item => item.id !== id)
      localStorage.setItem('cartItems', JSON.stringify(this.cartItems))
      this.pubSub.emit('removeCartItem', id)
      this.getState()
    }

    clearCart() {
      localStorage.removeItem('cartItems')
      this.cartItems = []
      this.getState()
      this.init()
    }
  }
  window.CLASSES.Store = Store
})(window)
