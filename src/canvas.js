// development mode
const canvas = new fabric.Canvas('drawing-canvas', {
  width: 600,
  height: 500
})

let nodeBlur = new fabric.Circle({
  radius: 50,
  left: 50,
  top: 50,
  fill: 'blue',
  hoverCursor: 'pointer',
  type: 'node',
  name: 'GaussianBlur',
  id: '5555555555555',
  limitInput: 1,

  settings: {
    'sigmaX': {
      type: 'input',
      value: 20,
      default_value: 20
    },
    'sigmaY': {
      type: 'input',
      value: 0,
      default_value: 0
    }
  }
})
let nodeRotate = new fabric.Circle({
  radius: 50,
  left: 200,
  top: 200,
  fill: 'green',
  hoverCursor: 'pointer',
  type: 'node',
  name: 'Rotate',
  id: '9999999999999',
  limitInput: 1,
  
  settings: {
    'angle': {
      type: 'slider',
      value: 0,
      default_value: 0,
      min_value: 0,
      max_value: 360
    }
  }
})
canvas.add(nodeBlur, nodeRotate)

let objectTarget = null

$(() => {
  const selector = 'canvas'

  $.contextMenu({
    selector: 'canvas', 
    className: 'data-title',
    callback: (key, options) => {
      if (key === 'delete') {
        // event: delete node
        if (confirm("Are you want to delete this?"))
          canvas.remove(objectTarget)
      } else if (key === 'settings') {
        // event: node setting
        $('#modal-title').text(`type: ${objectTarget.type}, id: ${objectTarget.id}`)
        $('#modal-content').html('') // clear html

        // Add html to modal-body
        for (setting in objectTarget.settings) {
          let objectId = `${setting}_${objectTarget.id}`,
              settings = objectTarget.settings,
              html = ''
          html += `<div class="form-group">`
          html += `<label for=${setting} class="form-control-label">${setting}:</label>`
          if (settings[setting].type === 'input')
            html += `<input type="text" class="form-control" id=${objectId}>`
          else if (settings[setting].type === 'slider') {
            html += `<div id=${objectId}>
                      <div id=custom-${objectId} class="ui-slider-handle"></div>
                    </div>`
          }
          html += `</div>`
          $('#modal-content').append(html)

          // Add event and value
          if (settings[setting].type === 'slider') {
            let handle = $(`#custom-${objectId}`)
            $(`#${objectId}`).slider({
              value: settings[setting].value,
              min: settings[setting].min_value,
              max: settings[setting].max_value,
              create: () => {
                handle
                  .text(settings[setting].value)
                  .css({
                  'width': '2em',
                  'height': '1.6em',
                  'top': '50%',
                  'margin-top': '-.8em',
                  'text-align': 'center',
                  'line-height': '1.6em',
                })
              },
              slide: (event, ui) => {
                handle.text(ui.value)
              }
            })
          } else if (settings[setting].type === 'input')
            $(`#${objectId}`).val(settings[setting].value)
        }

        // modal onclick save
        $('#modal-save-settings').click(() => {
          for (setting in objectTarget.settings) {
            let objectId = `${setting}_${objectTarget.id}`,
                settings = objectTarget.settings
            if (settings[setting].type === 'slider')
              settings[setting].value = $(`#${objectId}`).slider("value")
            else
              settings[setting].value = $(`#${objectId}`).val()
            
            $('#modal-settings').modal('hide')
          }
        })
        $('#modal-settings').modal('toggle')
      }

      // objectTarget = null
    },
    items: {
      "delete": {
        name: "Delete", 
        icon: 'fa-trash'
      },
      "sep": "---------",
      "settings": {
        name: "Settings", 
        icon: 'fa-pencil-square-o'
      }
    }
  })

  $(selector).contextMenu(false)
})

canvas.on('mouse:over', (options) => {
  if (!!options.target) {
    objectTarget = options.target

    if (objectTarget.type === 'node') {
      $('.data-title').attr('data-menutitle', `${objectTarget.name}, ${objectTarget.id}`)
      $('canvas').contextMenu(true)
    }
  }
})

canvas.on('mouse:out', (options) => {
  if (!!options.target) {
    objectTarget = options.target

    if (objectTarget.type === 'node') {
      $('canvas').contextMenu(false)
    }
  }
})
