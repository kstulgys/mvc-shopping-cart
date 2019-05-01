import items from './products'

export default class Store {
  constructor(pubSub) {
    this.pubSub = pubSub
    this.allProducts = []
    this.cartItems = []
    this.init()
  }

  async init() {
    await this.getStoreProducts()
    await this.getCartItemsFromStorage()
  }

  addToCart(id) {
    const item = this.allProducts.find(el => el.id === id)
    this.cartItems.push(item)
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems))
    this.pubSub.emit('addToCart', id)
  }

  async getStoreProducts() {
    // const { items = [] } = await fetch('products.json').then(res => res.json())
    const products = items().map(item => {
      const { title, price } = item.fields
      const { id } = item.sys
      const image = item.fields.image.fields.file.url
      return { title, price, id, image }
    })
    this.allProducts = products
    console.log(this.allProducts)
    this.pubSub.emit('storeProductsReady', this.allProducts)
    // const data = await fetch('https://randomuser.me/api/').then(res =>
    //   res.json()
    // )
    // console.log(data)
  }

  async getCartItemsFromStorage() {
    this.cartItems = await JSON.parse(localStorage.getItem('cartItems'))
    this.pubSub.emit('cartItemsReady', this.allProducts)
  }
}
