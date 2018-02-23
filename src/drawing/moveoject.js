export default class MoveObject {
  constructor(canvas) {
    this.canvas = canvas
  }

  start() {
    this.canvas.onEventListener('object:moving', this.objectMoving.bind(this))
  }

  stop() {
    this.canvas.offEventListener('object:moving')
  }

  objectMoving (opt) {
    _.forEach(opt.target.lines, (lineElm) => {
      
      if (opt.target.id === lineElm.beginId)
        lineElm.set({x1: opt.target.left, y1: opt.target.top})
      else if (opt.target.id === lineElm.endId)
        lineElm.set({x2: opt.target.left, y2: opt.target.top})
      
      // update coords
      lineElm.setCoords()
      opt.target.setCoords()
      this.canvas.renderAll()
    })
  }
}
