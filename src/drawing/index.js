/*********************** development mode ********************************

bug: 
  - when drawing finished, cant already right click

**************************************************************************

hot_fix:
  
**************************************************************************/

import Canvas from './canvas'
import Setting from './setting'
import Drawing from './drawing'
import ContextMenu from './contextmenu'
import Processing from '../processing'

const drawing_canvas = new Canvas('drawing-canvas', 0, 0)
const nodes_canvas = new Canvas('nodes-canvas', 0, 0)
const drawing = new Drawing(drawing_canvas)
const context_menu = new ContextMenu(drawing_canvas)

// prevent right click on page
// window.addEventListener("contextmenu", event => event.preventDefault());
window.addEventListener('load', e => {
  drawing_canvas.resizeCanvas('#drawing-wrapping')
  nodes_canvas.resizeCanvas('#nodes-wrapping')

  drawing_canvas.renderAll()
  nodes_canvas.renderAll()

  drawing.start()
  context_menu.start()
})
window.addEventListener('resize', e => {
  drawing_canvas.resizeCanvas('#drawing-wrapping')
  nodes_canvas.resizeCanvas('#nodes-wrapping')
})

const setting = new Setting()
setting.loadSetting().done(() => {
  drawing_canvas.addObject(
    drawing_canvas.createNode(
      `Load Image`,
      'rgb(255, 255, 255)',
      'rgb(0, 0, 0)',
      'rgb(0, 0, 0)',
      _.random(36, 500, false),
      _.random(36, 500, false),
      0,
      setting.getSetting('Load Image')
    )
  )
  drawing_canvas.addObject(
    drawing_canvas.createNode(
      `Convert Grayscale`,
      'rgb(255, 255, 255)',
      'rgb(0, 0, 0)',
      'rgb(0, 0, 0)',
      _.random(36, 500, false),
      _.random(36, 500, false),
      1,
      setting.getSetting('Convert Grayscale')
    )
  )
  drawing_canvas.addObject(
    drawing_canvas.createNode(
      `Gaussian Blur`,
      'rgb(255, 255, 255)',
      'rgb(0, 0, 0)',
      'rgb(0, 0, 0)',
      _.random(36, 500, false),
      _.random(36, 500, false),
      1,
      setting.getSetting('Gaussian Blur')
    )
  )
})

const processing = new Processing(drawing_canvas)
$(
  $(window).keypress(e => {
    processing.$()
  })

  // $('#control-button').click(e => {
  //   processing.$()
  // })
)
