/*********************** development mode ********************************

bug: 
  - when drawing finished, cant already right click

**************************************************************************

hot_fix:
  
**************************************************************************/

import Canvas from './canvas'
import Setting from './setting'
import Drawing from './drawing'
import Processing from '../processing'

const canvas = new Canvas('drawing-canvas', 500, 500)
const setting = new Setting()

// prevent right click on page
document.addEventListener('contextmenu', event => event.preventDefault())
canvas._e()

for (let i = 1; i <= 3; i++)
  canvas.addObject(canvas.createNode(`node_${i}`, undefined, _.random(36, 200), _.random(36, 300), 99, setting.addSetting('input', {
    default_value: _.random(0, 999),
    value: _.random(0, 99)
  })))

canvas.renderAll()

const drawing = new Drawing(canvas)
drawing.start()

const processing = new Processing(canvas)
