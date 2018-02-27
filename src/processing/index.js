import Graph from 'graph-data-structure'
import Code from './code'

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
    this.xcode = new Code()
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
      if (this.is_error > 0 || !this.is_processing) return

      const node = this.nodes.get(node_id)
      const code = this.xcode.getCode(node.name)
      const inputs = []

      if (_.isNil(code)) {
        // not found code
        alert('Code Error!')
        this.stopProcessing()
        return
      }

      _.forEach(node.lines, line => {
        console.log(node.id, line.beginId, line.endId)
        if (node.id === line.endId) {
          // get inputs
          inputs.push(line.beginId)
        }
        if (node.id === line.beginId) {
          // get files
          node.file = `file://${node.id}`
        }
      })

      this.qAjax({
        code: code,
        name: node.name,
        id: node.id,
        value: node.settings.value,
        input: inputs,
        file: node.file
      })
    })

    if (confirm('Process?')) {
      $(this.button_id)
        .text('Stop')
        .removeClass('btn-warning')
        .addClass('btn-info')
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

    this.queue.push({
      dataType: 'JSON',
      url: this.url_api,
      data: data,
      method: 'POST',
      cache: false,
      timeout: 60000,
      error: (xhr, status, error) => {
        console.log(`Error: ${status}`)
        this.canvas.nodeSetColor(node, 'red')
        this.stopProcessing()
      },
      success: data => {
        if (!this.is_processing) {
          console.log('LOO')
          this.stopProcessing()
          return
        }
        
        console.log(data.status)
        this.canvas.nodeSetColor(node, 'green')
        this.is_error = 0 // ok
      }
    })
  }

  qNext() {
    // basis
    if (this.queue.length === 0 || !this.is_processing || this.is_error > 0)
      return

    const qshift = this.queue.shift()
    const node = this.nodes.get(qshift.data.id)
    this.canvas.nodeSetColor(node, 'purple')

    // recursive
    $.ajax(qshift).done(this.qNext.bind(this))
  }

  stopProcessing() {
    this.is_processing = false
    this.is_error = 0
    this.queue = []

    $(this.button_id)
      .text('Start')
      .removeClass('btn-warning')
      .removeClass('btn-info')
      .addClass('btn-primary')

    this.resetNodesFill()
  }

  resetNodesFill() {
    this.nodes.forEach(node => {
      this.canvas.nodeSetColor(node, '#fff')
    })
  }
}
