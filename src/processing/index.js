import Graph from 'graph-data-structure'

export default class {
  constructor(canvas) {
    this.button_id = '#control-button'
    this.canvas = canvas
    this.nodes = canvas.nodes_map
    this.lines = canvas.lines_map
    this.is_processing = false
    this.is_error = false
    this.url_api = 'http://127.0.0.1:8888/api/process'
    this.queue = []
  }

  $() {
    const canvas = this.canvas

    if (this.is_processing) {
      this.stopProcessing()
      return
    }

    this.is_processing = true
    const sort = this.sortLines(this.lines)

    if (sort.length === 0 || !this.is_processing) {
      // no connection
      alert('No Connection!')
      this.stopProcessing()
      return
    }

    sort.forEach(node_id => {
      if (this.is_error || !this.is_processing) return

      const node = this.nodes.get(node_id)
      const inputs = []

      _.forEach(node.lines, line => {
        if (node.id === line.endId) {
          // get inputs
          inputs.push(line.beginId)
        }
      })

      this.qAjax({
        name: node.name,
        id: node.id,
        settings: node.settings,
        input: inputs
      })
    })

    if (confirm('Process?')) {
      $(this.button_id)
        .text('Stop')
        .removeClass('btn-primary')
        .addClass('btn-warning')
      this.qNext()
    } else {
      // cancel
      this.stopProcessing()
    }
  }

  _() {
    // mock data
    const num = 10
    const nodes = new Map()
    const lines = new Map()
    const arr = []

    for (let i = 0; i < num; i++) {
      const id = this.canvas.generateId()
      const val = _.random(9999999, true, false)

      arr.push(id)
      nodes.set(id, {
        name: `node_${i + 1}`,
        type: `node`,
        id: id,
        settings: {
          value: val,
          default_value: val
        },
        lines: []
      })
    }

    for (let i = 0; i < num; i++) {
      const nid = arr[_.random(num - 1, true, false)]
      const lid = this.canvas.generateId()
      let bid, eid

      do {
        bid = _.random(num - 1, true, false)
        eid = _.random(num - 1, true, false)
      } while (bid === eid)

      lines.set(lid, { beginId: arr[bid], endId: arr[eid] })
      nodes.get(nid).lines.push(lines.get(lid))
    }

    this.nodes = nodes
    this.lines = lines
  }

  sortLines(lines) {
    const g = new Graph()
    lines.forEach(elm => g.addEdge(elm.beginId, elm.endId))
    return g.topologicalSort()
  }

  qAjax(data) {
    const node = this.nodes.get(data.id)
    const error_callback = (xhr, status, error) => {
      console.log(`Error: ${status}`)
      this.canvas.nodeSetColor(node, 'red')
      this.stopProcessing()
    }
    const success_callback = data => {
      if (!this.is_processing) {
        this.stopProcessing()
        return
      }

      this.canvas.nodeSetColor(node, 'green')
      this.is_error = false // ok
    }

    this.queue.push(this.qCreateAjax(data, error_callback, success_callback))
  }

  qCreateAjax(data, error_callback, success_callback) {
    return {
      dataType: 'JSON',
      url: this.url_api,
      data: data,
      method: 'POST',
      cache: false,
      timeout: 60000,
      error: error_callback,
      success: success_callback
    }
  }

  qNext() {
    // basis
    if (this.queue.length === 0 || !this.is_processing || this.is_error) {
      this.stopProcessing(true)
      return
    }

    const qshift = this.queue.shift()
    const node = this.nodes.get(qshift.data.id)
    this.canvas.nodeSetColor(node, 'purple')

    // recursive
    $.ajax(qshift).done(this.qNext.bind(this))
  }

  stopProcessing(req) {
    this.is_processing = false
    this.is_error = false
    this.queue = []

    if (req) {
      // tell server for stop
      $.ajax(
        this.qCreateAjax(
          {
            code: 'end'
          },
          null,
          data => {
            console.log(data)
          }
        )
      )
    }

    $(this.button_id)
      .text('Start')
      .removeClass('btn-warning')
      .addClass('btn-primary')

    this.resetNodesFill()
  }

  resetNodesFill() {
    this.nodes.forEach(node => {
      this.canvas.nodeSetColor(node, '#fff')
    })
  }
}
