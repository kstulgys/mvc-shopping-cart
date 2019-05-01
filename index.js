import PubSub from './PubSub'
import Store from './Store'
import StoreView from './StoreView'

class StoreController {
  constructor(store) {
    this.store = store
    this.init()
  }

  init() {
    // console.log(this.store.allItems) // logs empty array
  }
}
const wrapper = document.querySelector('.products-center')
// const wrapper = document.getElementById('root')
console.log(wrapper)
const pubSub = new PubSub()
const store = new Store(pubSub)
const view = new StoreView(wrapper, pubSub)
const controller = new StoreController(store, view)
