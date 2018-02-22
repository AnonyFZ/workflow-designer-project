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
    fabric.Object.prototype.hasControls = false
    fabric.Arrow = Arrow

    this.hashTable = []
  }

  createNode(name = 'Undefined', fill = '#fff', left = 0, top = 0, settings = {}) {
    const node = [
      new fabric.Circle({
        type: 'circle',
        radius: 35,
        fill: fill,
        stroke: '#000',
        strokeWidth: 1
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
      limitInput: 1,
      lines: [],
      settings: settings
    })
    .on('moving', (options) => {
      let target = options.target
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

  createLine(points = [0, 0, 0, 0], beginId = -1, endId = -1) {
    return new fabric.Arrow(points, {
      level: 0,
      type: 'arrow_line',
      strokeWidth: 2,
      stroke: '#000',
      beginId: beginId,
      endId: endId
    })
  }

  renderAll() {
    let _ = this.canvas.getObjects()
    _.sort((obj1, obj2) => {
      if (obj1.level === obj2.level)
        return obj1.width * obj1.height < obj2.width * obj2.height
      return obj1.level < obj2.level // debug arrow
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
