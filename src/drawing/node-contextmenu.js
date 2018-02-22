export default class NodeContextmenu {
  constructor(canvas) {
    this.canvas = canvas
    this.canvas_id = `#${canvas.id}`
    this.canvas_class = `.${canvas.id}`
    this.target = null
  }

  loadMenu() {
    $.contextMenu({
      selector: this.canvas_class,
      className: 'data-title',
      callback: this.contextMenuCallback.bind(this),
      items: {
        'delete': {
          name: 'Delete',
          icon: 'fa-trash'
        },
        'sep': '---------',
        'settings': {
          name: 'Settings',
          icon: 'fa-pencil-square-o'
        }
      }
    })

  }

  start() {
    this.loadMenu()

    this.canvas.onEventListener('mouse:over', this.mouseOver.bind(this))
    this.canvas.onEventListener('mouse:out', this.mouseOut.bind(this))
  }

  stop() {
    this.canvas.offEventListener('mouse:over')
    this.canvas.offEventListener('mouse:out')
  }

  mouseOver(opt) {
    if (_.isNil(opt.target)) return
    if (opt.target.type !== 'node') return
    
    this.target = opt.target
    $('.data-title').attr('data-menutitle', `${opt.target.name}, ${opt.target.id}`)
    $(this.canvas_id).contextMenu(true)
  }

  mouseOut(opt) {
    if (_.isNil(opt.target)) return
    if (opt.target.type !== 'node') return

    $(this.canvas_id).contextMenu(false)
  }

  contextMenuCallback(key, opt) {
    if (key === 'delete') {
      console.log(this.canvas.hashTable)      
      _.forEach(this.target.lines, (val) => {
        this.canvas.removeObject(val)
      })
      this.canvas.removeObject(this.target)
      this.target = null
      console.log(this.canvas.hashTable)
    }
  }
}
