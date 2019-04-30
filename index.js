class PubSub {
  constructor() {
    this.registry = {}
  }

  on(evtName, cb) {
    this.registry[evtName] = this.registry[evtName] || []
    this.registry[evtName].push(cb)
  }

  off(evtName, cb) {
    if (this.registry[evtName]) {
      for (let i = 0; i < this.registry[evtName].length; i++) {
        if (this.registry[evtName][i] === cb) {
          this.registry[evtName].splice(i, 1)
          break
        }
      }
    }
  }

  emit(evtName, data) {
    if (this.registry[evtName]) {
      this.registry[evtName].forEach(cb => cb(data))
    }
  }
}

class Store {
  constructor(pubSub) {
    this.pubSub = pubSub
    this.allProducts = []
    this.cartItems = []
    this.init()
  }

  async init() {
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
    this.pubSub.on('storeProductsReady', this.logItems.bind(this))
  }

  logItems(items) {
    console.log(items)
    items.map(el => {
      this.cache.list.insertAdjacentHTML('beforeend', this.getListItem(el))
    })
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
