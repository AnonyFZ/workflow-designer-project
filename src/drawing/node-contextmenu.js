export default class NodeContextmenu {
  constructor(canvas) {
    this.canvas = canvas
  }

  loadMenu() {
    $.contextMenu({
      selector: 'canvas',
      className: 'data-title',
      callback: (key, options) => {
        console.log(key, options)
      },
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
    
    $('.data-title').attr('data-menutitle', `${opt.target.name}, ${opt.target.id}`)
    $('canvas').contextMenu(true)
  }

  mouseOut(opt) {
    if (_.isNil(opt.target)) return
    if (opt.target.type !== 'node') return

    $('canvas').contextMenu(false)
  }
}
