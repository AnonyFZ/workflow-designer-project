// Solve: https://stackoverflow.com/a/48606449

export default class Arrow extends fabric.Line {
  constructor(points, objObjects) {
    super(points, objObjects)
  }

  _getCacheCanvasDimensions() {
    var dim = super._getCacheCanvasDimensions()
    dim.width += 15
    dim.height += 15
    return dim
  }

  _render(ctx) {
    super._render(ctx)
    const xDiff = this.x2 - this.x1
    const yDiff = this.y2 - this.y1
    const angle = Math.atan2(yDiff, xDiff)
    ctx.save()
    ctx.translate((this.x2 - this.x1) / 2, (this.y2 - this.y1) / 2)
    ctx.rotate(angle)
    ctx.beginPath()
    ctx.moveTo(5, 0)
    ctx.lineTo(-5, 5)
    ctx.lineTo(-5, -5)
    ctx.closePath()
    ctx.fillStyle = this.stroke
    ctx.fill()
    ctx.restore()
  }
}
