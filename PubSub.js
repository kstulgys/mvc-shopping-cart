export default class PubSub {
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
