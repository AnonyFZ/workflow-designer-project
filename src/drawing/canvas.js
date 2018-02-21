import hash from 'string-hash'

export default class Canvas {
  constructor(id = 'canvas', width = 500, height = 500) {
    this.canvas = new fabric.Canvas(id, {
      width: width,
      height: height
    })

    fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center'
    fabric.Object.prototype.hasControls = false

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

  createLine() {
    
  }
}
