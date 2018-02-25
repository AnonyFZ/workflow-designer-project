export default class Drawing {
  constructor(canvas) {
    this.canvas = canvas
    this.line = null
    this.begin_circle = null
    this.end_circle = null
    this.begin_node = null
    this.end_node = null
    this.is_draw = false
  }

  start() {
    this.canvas.onEventListener('mouse:dblclick', this.mouseDblclick.bind(this))
    this.canvas.onEventListener('mouse:move', this.mouseMove.bind(this))
    this.canvas.onEventListener('mouse:up', this.mouseUp.bind(this))
  }

  stop() {
    this.canvas.offEventListener('mouse:dblclick')
    this.canvas.offEventListener('mouse:move')
    this.canvas.offEventListener('mouse:up')
  }

  mouseDblclick(opt) {
    this.drawingNode(opt)
  }

  mouseMove(opt) {
    if (!this.is_draw) return

    let pointer = this.canvas.getPointer(opt.e)
    let x2 = pointer.x, y2 = pointer.y
    let color = 'red'
    
    if (!!opt.target) {
      if (this.validateConnection(opt.target)) {
        x2 = opt.target.left
        y2 = opt.target.top
        color = 'green'
      }
    }

    this.begin_circle.set({fill: color})
    this.line.set({x2: x2, y2: y2, stroke: color})
    this.end_circle.set({left: x2, top: y2, fill: color})
    this.canvas.renderAll()
  }

  drawingNode(opt) {
    if (_.isNil(opt.target)) return
    if (opt.target.type !== 'node') return

    if (this.is_draw) {
      // when finish
      if (this.validateConnection(opt.target)) {
        this.end_node = opt.target

        let x1 = this.line.x1, y1 = this.line.y1,
            x2 = opt.target.left, y2 = opt.target.top
        let line = this.canvas.createLine([x1, y1, x2, y2], undefined, this.begin_node, this.end_node)
        this.canvas.addObject(line)
        this.cleanDrawing()
      }
    } else {
      // when start
      this.is_draw = true
      this.canvas._d()
      
      let pointer = this.canvas.getPointer(opt.e)
      let x1 = opt.target.left, y1 = opt.target.top,
          x2 = pointer.x, y2 = pointer.y
          
      this.line = new fabric.Line([x1, y1, x2, y2], {
        level: 2,
        strokeWidth: 4,
        stroke: 'red'
      })

      this.begin_circle = new fabric.Circle({
        level: 3,
        radius: 5,
        fill: 'red',
        left: x1,
        top: y1,
        lockMovementX: true,
        lockMovementY: true
      })

      this.end_circle = new fabric.Circle({
        level: 4,
        radius: 10,
        fill: 'red',
        left: x2,
        top: y2
      })

      this.begin_node = opt.target
      this.canvas.addObject(this.begin_circle, this.line, this.end_circle)
    }

    this.canvas.renderAll()
  }

  validateConnection(target) {
    if (target.type !== 'node') return false

    // self
    if (target.id === this.begin_node.id) return false
    // limit input
    if (target.countInput + 1 > target.limitInput) return false

    let isUndir = false, isSame = false
    _.forEach(this.begin_node.lines, (lineElm) => {
      // undir
      if (target.id === lineElm.beginId) {
        isUndir = true
        return
      }
      // dupplicate
      if (target.id === lineElm.endId) {
        isSame = true
        return
      }
    })

    return !isUndir && !isSame
  }

  cleanDrawing() {
    this.is_draw = false
    
    this.canvas.removeObject(this.begin_circle, this.line, this.end_circle)
    this.line = this.begin_circle = this.end_circle = null
    this.begin_node = this.end_node = null
    this.canvas._e()
  }

  mouseUp(opt) {
    if (!this.is_draw) return
    if (_.isNil(opt.target)) this.cleanDrawing()
  }
}
