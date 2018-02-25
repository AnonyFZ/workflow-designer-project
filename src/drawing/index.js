/*********************** development mode ********************************

bug: 
  - when drawing finished, cant already right click

**************************************************************************

hot_fix:
  
**************************************************************************/

import Canvas from "./canvas";
import Setting from "./setting";
import Function from "./node-function";
import Drawing from "./drawing";
import ContextMenu from './contextmenu'

const drawing_canvas = new Canvas("drawing-canvas", 0, 0);
const nodes_canvas = new Canvas("nodes-canvas", 0, 0);
const setting = new Setting();
const drawing = new Drawing(drawing_canvas);
const context_menu = new ContextMenu(drawing_canvas)

// prevent right click on page
// window.addEventListener("contextmenu", event => event.preventDefault());
window.addEventListener("load", e => {
  drawing_canvas.resizeCanvas("#drawing-wrapping");
  nodes_canvas.resizeCanvas("#nodes-wrapping");

  drawing_canvas.renderAll();
  nodes_canvas.renderAll();

  drawing.start();
  context_menu.start()
});
window.addEventListener("resize", e => {
  drawing_canvas.resizeCanvas("#drawing-wrapping");
  nodes_canvas.resizeCanvas("#nodes-wrapping");
});

drawing_canvas.addObject(
  drawing_canvas.createNode("Load Image", "rgb(51,0,102)", 100, 100, 0, {
    'uploadImage': setting.addSetting("file", {
      file: null
    })
  })
);
