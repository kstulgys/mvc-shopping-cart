import PubSub from './PubSub'

class Store {
  constructor(pubSub) {
    this.pubSub = pubSub
    this.allProducts = []
    this.cartItems = []
    this.init()
  }

  async init() {
    this.getStoreProducts()
    this.getCartItemsFromStorage()
  }

  addToCart(id) {
    const item = this.allProducts.find(el => el.id === id)
    this.cartItems.push(item)
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems))
    this.pubSub.emit('addToCart', id)
  }

  getStoreProducts(){
    const { items = [] } = await fetch('products.json').then(res => res.json())
    const products = items.map(item => {
      const { title, price } = item.fields
      const { id } = item.sys
      const image = item.fields.image.fields.file.url
      return { title, price, id, image }
    })
    this.allProducts = products
    this.pubSub.emit('storeProductsReady', this.allProducts)
  }

  getCartItemsFromStorage() {
    this.cartItems = JSON.parse(localStorage.getItem('cartItems'))
    this.pubSub.emit('cartItemsReady', this.allProducts)
  }

}

class StoreView {
  constructor(wrapper, pubSub) {
    this.wrapper = wrapper
    this.pubSub = pubSub
    this.cache = {}
    this.init()
  }

  init() {
    wrapper.insertAdjacentHTML('afterbegin', this.render())
    this.cache.list = document.querySelector('.list')
    this.cache.productBtns = [...document.querySelectorAll('.btn')]
    this.pubSub.on('storeProductsReady', this.logItems.bind(this))
    this.pubSub.on('addToCart', this.updateProductsAndCartView.bind(this))
  }

  logItems(items) {
    console.log(items)
    items.map(el => {
      this.cache.list.insertAdjacentHTML('beforeend', this.getListItem(el))
    })
  }

  updateProductsAndCartView(id) {
    const productBtn = this.cache.productBtns.find(btn => btn.dataset.id === id)
    productBtn.style.disabled = true
  }

  render() {
    return `<div>
              <h1>Items List</h1>
                <ul class="list"></ul>
            </div>
            `
  }

  getListItem(item) {
    return `<li>${item.title}</li>`
  }
}

class StoreController {
  constructor(store) {
    this.store = store
    this.init()
  }

  init() {
    // console.log(this.store.allItems) // logs empty array
  }
}

const wrapper = document.getElementById('root')
const pubSub = new PubSub()
const view = new StoreView(wrapper, pubSub)
const store = new Store(pubSub)
const controller = new StoreController(store, view)
