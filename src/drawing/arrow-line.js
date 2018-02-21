// Solve: https://stackoverflow.com/a/48606449

export default fabric.util.createClass(fabric.Line, {
  _getCacheCanvasDimensions() {
    var dim = this.callSuper('_getCacheCanvasDimensions')
    dim.width += 15
    dim.height += 15
    return dim
  },
  _render(ctx) {
    this.callSuper('_render', ctx)
    ctx.save()
    const xDiff = this.x2 - this.x1
    const yDiff = this.y2 - this.y1
    const angle = Math.atan2(yDiff, xDiff)
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
})
