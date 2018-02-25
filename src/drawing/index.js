/*********************** development mode ********************************

bug: 
  - when drawing finished, cant already right click

**************************************************************************

hot_fix:
  
**************************************************************************/

import Canvas from './canvas'
import Setting from './setting'
import Drawing from './drawing'
import Graph from 'graph-data-structure'
const canvas = new Canvas('drawing-canvas', 1500, 1500)
const setting = new Setting()

// prevent right click on page
document.addEventListener('contextmenu', event => event.preventDefault())
canvas._e()

for (let i = 0; i < 10; i++)
  canvas.addObject(canvas.createNode('', undefined, _.random(36, 500), _.random(36, 600), 99, {}))

canvas.renderAll()

const drawing = new Drawing(canvas)
drawing.start()

const ctx = canvas.getCanvas()

$(document).keypress((e) => {
  const graph = new Graph()
  const nodes = canvas.nodes_map
  const lines = canvas.lines_map
  lines.forEach(elm => {
    graph.addEdge(elm.beginId, elm.endId)
  })

  _.forEach(graph.topologicalSort(), (val, index) => {
    const node_canvas = nodes.get(val)
    const node = [
      new fabric.Circle({
        type: 'circle',
        radius: 25,
        fill: 'blue',
        stroke: '#000',
        strokeWidth: 2
      }),
      new fabric.Text(_.toString(index), {
        type: 'text',
        fontFamily: 'sans-serif',
        fontSize: 15,
        fill: '#fff'
      })
    ]
    const node_group = new fabric.Group(node, {
      level: 2,
      left: node_canvas.left,
      top: node_canvas.top,
    })
    ctx.add(node_group)
  })

  canvas.renderAll()
})
