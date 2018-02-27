export default class {
  constructor() {
    this.code_map = new Map()
    this._()
  }

  _() {
    this.code_map.set('Start', -1)
    this.code_map.set('Stop', 1)
    this.code_map.set('Load Image', 2)

    // for debug
    for (let i = 1; i <= 10; i++)
      this.code_map.set(`node_${i}`, 2 + i)

  }

  getCode(name) {
    return this.code_map.get(name) || null // not found
  }
}
