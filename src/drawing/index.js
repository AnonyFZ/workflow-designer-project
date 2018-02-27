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
const setting = new Setting()
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

for (let i = 0; i < 5; i++) {
  drawing_canvas.addObject(
    drawing_canvas.createNode(
      `node_${i + 1}`,
      'rgb(255, 255, 255)',
      'rgb(0, 0, 0)',
      'rgb(0, 0, 0)',
      _.random(36, 500, false),
      _.random(36, 500, false),
      99,
      {
        undef: setting.addSetting('input', {})
      }
    )
  )
}

const processing = new Processing(drawing_canvas)

$(
  $('#control-button').click(e => {
    processing.$()
  })
)
