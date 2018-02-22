export default class Drawing {
  constructor(canvas) {
    this.canvas = canvas
    this.line = null
    this.circle = null
    this.begin_id = null
    this.end_id = null
    this.isDraw = false
    this.ok = false
  }

  start() {
    this.canvas.onEventListener('mouse:dblclick', this.mouseDblclick.bind(this))
    this.canvas.onEventListener('mouse:move', this.mouseMove.bind(this))
  }

  stop() {
    this.canvas.offEventListener('mouse:dblclick')
    this.canvas.offEventListener('mouse:move')
  }

  mouseDblclick(opt) {
    if (_.isNil(opt.target)) return
    if (this.isDraw) {
      // when stop
      if (this.ok) {
        this.isDraw = false
        this.end_id = opt.target.id

        let x1 = this.line.x1, y1 = this.line.y1,
            x2 = opt.target.left, y2 = opt.target.top
        let line = this.canvas.createLine([x1, y1, x2, y2], this.begin_id, this.end_id)

        this.canvas.addObject(line)
        this.canvas.removeObject(this.line, this.circle)
        this.line = this.circle = null
      }
    } else {
      // when start
      this.isDraw = true
      
      let pointer = this.canvas.getPointer(opt.e)
      let x1 = opt.target.left, y1 = opt.target.top,
          x2 = pointer.x, y2 = pointer.y
      this.line = new fabric.Line([x1, y1, x2, y2], {
        level: 99,
        strokeWidth: 2,
        stroke: '#000'
      })

      this.circle = new fabric.Circle({
        level: -99,
        radius: 10,
        fill: '#fff',
        stroke: '#000',
        strokeWidth: 1,
        left: x2,
        top: y2
      })

      this.begin_id = opt.target.id
      this.canvas.addObject(this.line, this.circle)
    }

    this.canvas.renderAll()
  }

  mouseMove(opt) {
    if (!this.isDraw) return

    let pointer = this.canvas.getPointer(opt.e)
    let x2 = pointer.x, y2 = pointer.y
    let color = 'red'

    this.ok = false

    if (_.isObject(opt.target)) {
      _.forEach(this.canvas.getCanvas().getObjects(), (val) => {
        if (val.intersectsWithObject(this.circle)) {
          if (opt.target.type !== 'node') return
          if (opt.target.id === this.begin_id) return

          // isNode, notSelf
          x2 = opt.target.left
          y2 = opt.target.top
          color = 'green'

          this.ok = true
          return
        }
      })
    }

    this.line.set({x2: x2, y2: y2})
    this.circle.set({
      left: x2,
      top: y2,
      fill: color
    })

    this.canvas.renderAll()
  }
}
