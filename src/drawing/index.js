/*********************** development mode ********************************

bug: 
  - when drawing finished, cant already right click

**************************************************************************

hot_fix:
  - when remove, decrease [countInput]
  - arrow_line cant detected when moveobject

**************************************************************************/

import Canvas from './canvas'
import Setting from './setting'
import Drawing from './drawing'
const canvas = new Canvas('drawing-canvas', 1500, 1500)
const setting = new Setting()

// prevent right click on page
document.addEventListener('contextmenu', event => event.preventDefault())
canvas._e()

const nodeBlur = canvas.createNode('GaussianBlur', undefined, 50, 50, 1, {
  'sigmaX': setting.addSetting('input', {
    value: 20,
    default_value: 20,
  }),
  'sigmaY': setting.addSetting('input', {
    value: 0,
    default_value: 0,
  })
})

const nodeRotate = canvas.createNode('Rotate', undefined, 170, 170, 1, {
  'angle': setting.addSetting('slider', {
    value: 0,
    default_value: 0,
    min_value: 0,
    max_value: 360
  })
})

const nodeZoom = canvas.createNode('Zoom', undefined, 250, 50, 1, {
  'scale': setting.addSetting('slider', {
    value: 0,
    default_value: 0,
    min_value: -50,
    max_value: 50
  })
})

canvas.addObject(nodeBlur, nodeRotate, nodeZoom)
canvas.renderAll()

const drawing = new Drawing(canvas)
drawing.start()

