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
const canvas = new Canvas('drawing-canvas', 500, 500)
const setting = new Setting()

// prevent right click on page
document.addEventListener('contextmenu', event => event.preventDefault())
canvas._e()

for (let i = 0; i < 5; i++)
  canvas.addObject(canvas.createNode('', undefined, _.random(36, 500), _.random(36, 350), 99, {}))

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

const createNodeFixed = (id) => {
  const width = 74, height = 74

  const c = new fabric.StaticCanvas()
  const node = canvas.createNode('Rotate', 'pink', width / 2, height / 2, 1, {}, true)
  c.add(node)
  $('#node1').html(c.toSVG({
    suppressPreamble: true,
    viewBox: {
        x: 0,
        y: 0,
        width: width,
        height: height
    }
  })).attr('draggable', 'true')
}
$(
  // createNodeFixed('node1')
)
