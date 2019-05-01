export default class StoreView {
  constructor(wrapper, pubSub) {
    this.wrapper = wrapper
    this.pubSub = pubSub
    this.cache = {}
    this.init()
  }

  init() {
    wrapper.insertAdjacentHTML('afterbegin', this.render())
    // this.cache.products = document.querySelector('.products-center')
    // this.cache.productBtns = [...document.querySelectorAll('.btn')]
    // this.pubSub.on('storeProductsReady', this.logItems.bind(this))
    // this.pubSub.on('addToCart', this.updateProductsAndCartView.bind(this))
  }

  // logItems(items) {
  //   console.log(items)
  //   items.map(el => {
  //     this.cache.list.insertAdjacentHTML('beforeend', this.getListItem(el))
  //   })
  // }

  //   updateProductsAndCartView(id) {
  //     const productBtn = this.cache.productBtns.find(btn => btn.dataset.id === id)
  //     productBtn.style.disabled = true
  //   }

  render() {
    return `
            <article class="product">
            <div class="img-container">
                <img
                src="./images/product-1.jpeg"
                alt="product"
                class="product-img"
                />
                <button class="bag-btn" data-id="1">
                <i class="fas fa-shopping-cart"></i>
                add to bag
                </button>
            </div>
            <h3>queen bed</h3>
            <h4>$160</h4>
            </article>
              `
  }

  //   getListItem(item) {
  //     return `<li>${item.title}</li>`
  //   }
}
