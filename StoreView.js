;(function(window) {
  const StoreView = class StoreView {
    constructor(wrapper, pubSub) {
      this.wrapper = wrapper
      this.pubSub = pubSub
      this.cache = {}
      this.init()
    }

    init() {
      this.pubSub.on('addToCart', this.disableProductBtn.bind(this))
    }

    displayProducts(products) {
      products.map(product => {
        this.wrapper.insertAdjacentHTML(
          'beforeend',
          this.renderProduct(product)
        )
      })
      this.cache.productButtons = [...document.querySelectorAll('.bag-btn')]
    }

    disableProductBtn(id) {
      this.cache.productButtons.forEach(btn => {
        console.log(btn.dataset.id === id)
        if (btn.dataset.id === id) {
          btn.setAttribute('disabled', true)
        }
      })
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
                <button class="bag-btn" data-id=${id} ${inCart && 'disabled'}>
                <i class="fas fa-shopping-cart"></i>
                add to bag
                </button>
              </div>
              <h3>${title}</h3>
              <h4>${price}</h4>
            </article>
            `
    }
  }
  window.CLASSES.StoreView = StoreView
})(window)
