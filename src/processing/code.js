export default class {
  constructor() {
    this.code_map = new Map()
    this._()
  }

  _() {
    this.code_map.set('Load Image', 1)

    // for debug
    for (let i = 1; i <= 3; i++)
      this.code_map.set(`node_${i}`, 1 + i)
  }

  getCode(name) {
    return this.code_map.get(name) || 0 // not found
  }
}
