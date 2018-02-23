export default class NodeContextmenu {
  constructor(canvas) {
    this.canvas = canvas
    this.canvas_id = `#${canvas.id}`
    this.canvas_class = `.${canvas.id}`
    this.modal_settings = $('#modal-settings')
    this.modal_title = $('#modal-title')
    this.modal_body = $('#modal-body')
    this.target = null
    this.is_over = false
  }

  nodeItems() {
    return {
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
  }

  arrowItems() {
    return {
      'delete': {
        name: 'Delete',
        icon: 'fa-trash'
      }
    }
  }

  loadMenu(items, callback) {
    $.contextMenu({
      selector: this.canvas_class,
      className: 'data-title',
      callback: callback.bind(this),
      items: items()
    })
  }

  start() {
    this.canvas.onEventListener('mouse:over', this.mouseOver.bind(this))
    this.canvas.onEventListener('mouse:out', this.mouseOut.bind(this))
  }

  stop() {
    this.canvas.offEventListener('mouse:over')
    this.canvas.offEventListener('mouse:out')
    $(this.canvas_class).contextMenu('destroy')
  }

  mouseOver(opt) {
    if (_.isNil(opt.target)) return
    if (!this.is_over) {
      $(this.canvas_class).contextMenu('destroy')
      $(this.canvas_class).contextMenu(true)

      if (opt.target.type === 'node') 
        this.loadMenu(this.nodeItems, this.nodeContextMenuCallback)
      else if (opt.target.type === 'arrow_line') 
        this.loadMenu(this.arrowItems, this.arrowContextMenuCallback)
      else return
      
      $('.data-title').attr('data-menutitle', `${opt.target.name}, ${opt.target.id}`)

      this.target = opt.target
      this.is_over = true
    }
  }

  mouseOut(opt) {
    if (_.isNil(opt.target)) return

    this.is_over = false
    $(this.canvas_class).contextMenu(false)
  }

  arrowContextMenuCallback(key, opt) {
    if (key === 'delete')
      this.arrowDeleteKeyContextMenu()
  }

  arrowDeleteKeyContextMenu() {
    if (confirm('Are you sure?')) {
      this.canvas.removeObject(this.target)

      // remove self at other
      let listObject = _.filter(this.canvas.getCanvas().getObjects(), {type: 'node'})
      _.forEach(listObject, (val) =>
        _.remove(val.lines, (obj) => {
          // decrease countInput when remove line
          if (val.id === obj.endId && this.target.endId === obj.endId)
            val.countInput = val.countInput < 0 ? 0 : val.countInput - 1

          return this.target.beginId === obj.beginId || this.target.endId === obj.endId
        })
      )

      this.target = null
    }
  }

  nodeContextMenuCallback(key, opt) {
    if (key === 'delete')
      this.nodeDeleteKeyContextMenu()
    else if (key === 'settings')
      this.nodeSettingsKeyContextMenu()
  }

  nodeDeleteKeyContextMenu() {
    if (confirm('Are you sure?')) {

      // remove lines in self
      _.forEach(this.target.lines, (val) => this.canvas.removeObject(val))
      this.canvas.removeObject(this.target)
      
      // remove lines self at other
      let listObject = _.filter(this.canvas.getCanvas().getObjects(), {type: 'node'})
      _.forEach(listObject, (val) =>
        _.remove(val.lines, (obj) => {
          // decrease countInput when remove node
          if (val.id === obj.endId && this.target.id === obj.beginId) {
            val.countInput = val.countInput < 0 ? 0 : val.countInput - 1
          }
          this.target.id === obj.beginId || this.target.id === obj.endId
        })
      )
      
      this.target = null
    }
  }

  nodeSettingsKeyContextMenu() {
    this.modal_title.text(`${this.target.name}-${this.target.type}-${this.target.id}`)
    this.modal_body.html('')

    // create dynamic modal content
    _.forEach(this.target.settings, this.createSettingElement.bind(this))

    // event when mouse click save change
    $('#modal-save-settings').click(() => {
      _.forEach(this.target.settings, (val, key) => {
        const object = $(`#${val.type}-${key}-${this.target.id}`)
        if (val.type === 'slider')
          val.value = object.slider('value')
        else
          val.value = object.val()
      })

      $(this.modal_settings).modal('hide')
    })

    this.modal_settings.modal('show')
  }

  createSettingElement(val, key) {
    const objectId = `${key}-${this.target.id}`
    
    // create common element
    const form_group = $('<div>', {
      class: 'form-group'
    }).appendTo(this.modal_body)

    const label = $('<label>', {
      class: 'form-control-label',
      for: objectId
    }).text(key).appendTo(form_group)

    if (val.type === 'input') {
      // create input element
      const input_form_control = $('<input>', {
        class: 'form-control',
        id: `${val.type}-${objectId}`,
        type: 'text',
      }).val(val.value).appendTo(form_group)

    } else if (val.type === 'slider') {
      // create slider element
      const div_form_control = $('<div>', {
        id: `${val.type}-${objectId}`
      }).appendTo(form_group)

      const div_ui_slider_handle = $('<div>', {
        id: `custom-${objectId}`,
        class: 'ui-slider-handle',
        css: {
          width: '2em',
          height: '1.6em',
          top: '50%',
          'margin-top': '-.8em',
          'text-align': 'center',
          'line-height': '1.6em'
        }
      }).text(val.value).appendTo(div_form_control)

      // add slider event
      div_form_control.slider({
          value: val.value,
          min: val.min_value,
          max: val.max_value,
          slide: (e, ui) => {
            div_ui_slider_handle.text(ui.value)
          }
      })
    }
  }
}
