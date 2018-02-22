import Canvas from './canvas'
import Setting from './setting'
import Drawing from './drawing'
import MoveObject from './moveoject';

const canvas = new Canvas('drawing-canvas', 1500, 1500)
const setting = new Setting()

const nodeBlur = canvas.createNode('GaussianBlur', undefined, 50, 50, {
  'sigmaX': setting.addSetting('input', 20, 20),
  'sigmaY': setting.addSetting('input', 0, 0)
})

const nodeRotate = canvas.createNode('Rotate', undefined, 170, 170, {
  'angle': setting.addSetting('slider', 0, 0, 0, 360)
})

const nodeZoom = canvas.createNode('Zoom', undefined, 250, 50, {
  'scale': setting.addSetting('slider', 0, 0, -50, 50)
})

canvas.addObject(nodeBlur, nodeRotate, nodeZoom)
canvas.renderAll()

const drawing = new Drawing(canvas)
drawing.start()

const moveobject = new MoveObject(canvas)
moveobject.start()
