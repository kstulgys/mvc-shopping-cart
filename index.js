const { PubSub, Store, StoreView, StoreController } = window.CLASSES

window.onload = () => {
  let wrapper = document.querySelector('.products-center')
  const pubSub = new PubSub()
  const store = new Store(pubSub)
  const view = new StoreView(wrapper, pubSub)
  /*
   * Set StoreController
   *
   */
  new StoreController(store, view, pubSub)
}
