import Arrow from './arrow'
import hash from 'string-hash'

export default class Canvas {
  constructor(id = 'canvas', width = 500, height = 500) {
    this.canvas = new fabric.Canvas(id, {
      width: width,
      height: height,
      selection: false,
      targetFindTolerance: 15,
      preserveObjectStacking: true,
      perPixelTargetFind: true
    })

    fabric.device
    fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center'
    fabric.Object.prototype.hoverCursor = 'pointer'
    fabric.Object.prototype.hasControls = fabric.Object.prototype.hasBorders = false
    fabric.Arrow = Arrow

    this.hashTable = []
  }

  createNode(name = 'Undefined', fill = '#fff', left = 0, top = 0, limitInput = 1, settings = {}) {
    const node = [
      new fabric.Circle({
        type: 'circle',
        radius: 35,
        fill: fill,
        stroke: '#000',
        strokeWidth: 2
      }),
      new fabric.Text(name, {
        type: 'text',
        fontFamily: 'sans-serif',
        fontSize: 10,
        fill: '#000'
      })
    ]

    return new fabric.Group(node, {
      level: 1,
      type: 'node',
      id: this.generateId(),
      name: name,
      left: left,
      top: top,
      limitInput: limitInput,
      countInput: 0,
      lines: [],
      settings: settings
    })
  }

  addObject(...object) {
    if (_.isNil(object)) return
    _.forEach(object, (val) => {
      this.canvas.add(val)
    })
  }

  removeObject(...object) {
    if (_.isNil(object)) return
    _.forEach(object, (val) => {
      this.canvas.remove(val)
    })
  }

  generateId() {
    let id
    do
      id = hash(_.toString(_.random(9999990, true))) 
    while(_.some(this.hashTable, id))

    this.hashTable.push(id)
    return id
  }

  createLine(points = [0, 0, 0, 0], color = '#000', beginNode = null, endNode = null) {
    if (_.isNil(beginNode) || _.isNil(endNode)) return
    const arrow = new fabric.Arrow(points, {
      level: 0,
      type: 'arrow_line',
      id: this.generateId(),
      strokeWidth: 4,
      stroke: color,
      arrow_size: 10,
      beginId: beginNode.id,
      endId: endNode.id
    })

    beginNode.lines.push(arrow)
    endNode.lines.push(arrow)
    endNode.countInput++

    return arrow
  }

  renderAll() {
    let _ = this.canvas.getObjects()
    _.sort((obj1, obj2) => {
      if (obj1.level === obj2.level)
        return obj1.width * obj1.height < obj2.width * obj2.height
      return obj1.level > obj2.level
    })
    this.canvas.renderAll()
  }

  onEventListener(event = {}, handle) {
    this.eventListener(event, handle)
  }

  offEventListener(event) {
    this.eventListener(event)
  }

  eventListener(event, handle) {
    if (_.isNil(handle))
      this.canvas.off(event)
    else
      this.canvas.on(event, handle)
  }

  getPointer(event) {
    if (_.isNil(event)) return
    return this.canvas.getPointer(event)
  }

  getCanvas() {
    return this.canvas
  }
}
