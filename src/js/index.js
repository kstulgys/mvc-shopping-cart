class Storage {
  constructor() {
    this.cartItems = []
    this.allItems = []
  }

  static async getAllItems() {
    const data = await fetch('products.json')
    const res = await data.json()
    console.log(res)
    // const results = await data.json()
    // console.log(results)
  }
  static getCartItems() {}

  static setAllItems() {}
  static setCartItems() {}
}

class Cart {
  static addItem() {}
  static removeItem() {}
  static updateItem() {}
}

window.addEventListener('DOMContentLoaded', () => {
  Storage.getAllItems()
})
