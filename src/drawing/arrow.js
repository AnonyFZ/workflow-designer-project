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
    const x = this.x2 - this.x1
    const y = this.y2 - this.y1
    const size = this.arrow_size
    const angle = Math.atan2(y, x)
    ctx.save()
    ctx.rotate(angle)
    ctx.beginPath()
    ctx.moveTo(size, 0)
    ctx.lineTo(-size, size)
    ctx.lineTo(-size, -size)
    ctx.closePath()
    ctx.fillStyle = this.stroke
    ctx.fill()
    ctx.restore()
  }
}
