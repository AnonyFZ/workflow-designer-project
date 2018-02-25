export default class {
  constructor(name, color, text, stroke, strokewidth, width, height, limitinput, settings) {
    this.name = name
    this.color = color;
    this.stroke = stroke;
    this.text = text
    this.strokewidth = strokewidth;
    this.width = width;
    this.height = height;
    this.limitinput = limitinput;
    this.settings = settings;
    
    return this.$()
  }

  $() {
    fabric.Object.prototype.originX = fabric.Object.prototype.originY = "center";
    fabric.Object.prototype.hoverCursor = "pointer";
    fabric.Object.prototype.objectCaching = false; // fix cant select object
    fabric.Object.prototype.hasBorders = false;

    const node = [
      new fabric.Rect({
        type: "rect",
        width: this.width,
        height: this.height,
        fill: this.color,
        stroke: this.stroke,
        strokeWidth: this.strokewidth,
      }),
      new fabric.Text(this.name, {
        type: "text",
        fontFamily: "sans-serif",
        fontSize: 15,
        fill: this.text,
      })
    ];

    return new fabric.Group(node, {
      level: 1,
      type: "node",
      name: this.name,
      limitInput: this.limitinput,
      countInput: 0,
      lines: [],
      file: "",
      settings: this.settings,
    })
  }
}
