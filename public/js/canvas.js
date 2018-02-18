// development mode
const canvas = new fabric.Canvas('drawing-canvas', {
  width: 600,
  height: 500
})

let nodeBlur = new fabric.Circle({
  radius: 50,
  left: 50,
  top: 50,
  fill: 'blue',
  hoverCursor: 'pointer',
  type: 'node',
  name: 'Blur',
  id: '5555555555555',
})
let nodeRotate = new fabric.Circle({
  radius: 50,
  left: 200,
  top: 200,
  fill: 'green',
  hoverCursor: 'pointer',
  type: 'node',
  name: 'Rotate',
  id: '9999999999999',
})
canvas.add(nodeBlur, nodeRotate)

let objectTarget = null

$(() => {
  const selector = 'canvas'

  $.contextMenu({
    selector: 'canvas', 
    className: 'data-title',
    callback: (key, options) => {
      if (key === 'delete') {
        if (confirm("Are you want to delete this?"))
          canvas.remove(objectTarget)
      }

      objectTarget = null
    },
    items: {
      "delete": {
        name: "Delete", 
        icon: 'fa-trash'
      },
      "sep": "---------",
      "settings": {
        name: "Settings", 
        icon: 'fa-pencil-square-o'
      }
    }
  })
  $(selector).contextMenu(false)
})

canvas.on('mouse:over', (options) => {
  if (!!options.target) {
    objectTarget = options.target

    if (objectTarget.type === 'node') {
      $('.data-title').attr('data-menutitle', objectTarget.name + ', ' + objectTarget.id)
      $('canvas').contextMenu(true)
    }
  }
})

canvas.on('mouse:out', (options) => {
  if (!!options.target) {
    objectTarget = options.target

    if (objectTarget.type === 'node') {
      $('canvas').contextMenu(false)
    }
  }
})
