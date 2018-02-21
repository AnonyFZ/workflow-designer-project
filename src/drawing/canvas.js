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

    fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center'
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
      hoverCursor: 'pointer',
      limitInput: 1,
      lines: [],
      settings: settings
    })
  }

  addObject(object) {
    if (_.isNil(object)) return
    this.canvas.add(object)
  }

  generateId() {
    let id
    do
      id = hash(_.toString(_.random(9999990, true))) 
    while(_.some(this.hashTable, id))

    this.hashTable.push(id)
    return id
  }

  createLine(points = [0, 0, 0, 0]) {
    return new fabric.Arrow(points, {
      level: 0,
      type: 'arrow_line',
      strokeWidth: 2,
      stroke: '#000'
    })
  }

  renderAll() {
    let _ = this.canvas.getObjects()
    _.sort((obj1, obj2) => {
      if (obj1.level === obj2.level)
        return obj1.width * obj1.height < obj2.width * obj2.height
      return obj1.level < obj2.level
    })
    this.canvas.renderAll()
  }
}
