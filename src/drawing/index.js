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

const setting = new Setting()
const drawing_canvas = new Canvas('drawing-canvas', 0, 0)
// const nodes_canvas = new Canvas('nodes-canvas', 0, 0)
const drawing = new Drawing(drawing_canvas)
const context_menu = new ContextMenu(drawing_canvas)

// prevent right click on page
// window.addEventListener("contextmenu", event => event.preventDefault());
window.addEventListener('load', e => {
  drawing_canvas.resizeCanvas('#drawing-wrapping')
  // nodes_canvas.resizeCanvas('#nodes-wrapping')

  drawing_canvas.renderAll()
  // nodes_canvas.renderAll()

  drawing.start()
  context_menu.start()
})
window.addEventListener('resize', e => {
  drawing_canvas.resizeCanvas('#drawing-wrapping')
  // nodes_canvas.resizeCanvas('#nodes-wrapping')
})

setting.$().done(() => {
  drawing_canvas.setSettings(setting)

  const dropdown_menu = $('#dropdown-menu')
  _.forEach(setting.setting_data, (elm, key) => {
    if (elm.type === 'end') return
    
    const item = $('<a>', {
      class: 'dropdown-item',
      href: '#',
      select_type: elm.type
    }).text(key).appendTo(dropdown_menu)
  })
  $('.dropdown-item').click((e) => {
    const type = e.currentTarget.getAttribute('select_type')
    drawing_canvas.addObject(
      drawing_canvas.createNode(
        type,
        _.random(36, 500, false),
        _.random(36, 500, false)
      )
    )
  })
})

const processing = new Processing(drawing_canvas)
$(
  $(window).keypress(e => {
    processing.$()
  }),
  $('#control-button').click(e => {
    processing.$()
  })
)
