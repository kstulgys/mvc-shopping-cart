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
      this.pubSub.emit('storeProductsReady', this.allProducts)
      this.getState()
    }

    addToCart(id) {
      this.allProducts.find(el => el.id === id).inCart = true
      const findProduct = this.allProducts.find(el => el.id === id)
      this.cartItems.push(findProduct)
      localStorage.setItem('cartItems', JSON.stringify(this.cartItems))
      this.pubSub.emit('addToCart', id)
    }

    async getStoreProducts() {
      const { items = [] } = await fetch('products.json').then(res =>
        res.json()
      )

      const products = items.map(item => {
        const { title, price } = item.fields
        const { id } = item.sys
        const image = item.fields.image.fields.file.url
        const inCart = this.cartItems.findIndex(item => item.id === id) > -1
        return { title, price, id, image, inCart }
      })
      this.allProducts = products
    }

    async getCartItems() {
      const cartItems = await JSON.parse(localStorage.getItem('cartItems'))
      this.cartItems = cartItems || []
    }

    getState() {
      console.log('allProducts', this.allProducts)
    }
  }
  window.CLASSES.Store = Store
})(window)
