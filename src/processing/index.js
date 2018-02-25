import Graph from 'graph-data-structure'
import Code from './code'

export default class {
  constructor(canvas) {
    this._(canvas)
    this.isProcessing = false
    this.resTimeout = 5000
  }

  _(canvas) {
    $(document).keypress((e) => {
      let isError = 0 // ok
      this.isProcessing = true

      const url_api = 'http://127.0.0.1:8888/api'
      const g = new Graph()
      const code = new Code()
      const nodes_map = canvas.nodes_map
      const lines_map = canvas.lines_map
      lines_map.forEach(elm => g.addEdge(elm.beginId, elm.endId))
      const serial = g.serialize()
      const sort = g.topologicalSort()
      
      
      if (_.size(sort) === 0) {
        isError = 1 // no connection
        return
      }

      this.sendProcessing(url_api, {is_: true, code: code.getCode('Start'), count: _.size(sort)}, () => 1 + 1, data => console.log(data))
      
      _.forEach(sort, node_id => {
        if (isError) return

        const node = nodes_map.get(node_id)
        const ncode = code.getCode(node.name)
        const inputs = []
        let file = ''
        
        if (_.isNil(ncode)) {
          isError = 2 // not found code
          return 
        }

        _.forEach(node.lines, line => {
          if (node.id === line.endId) {
            // get inputs
            inputs.push(line.beginId)
          }
          if (node.id === line.beginId) {
            // get files
            node.file = `file://${node.id}`
          }
        })

        const node_config = {
          code: ncode,
          name: node.name,
          id: node.id,
          value: node.settings.value,
          inputs: inputs,
          file: node.file,
          magic_number: _.random(9999, true) 
        }

        console.log('req', node.name, node.id, ncode)

        // pre-process
        canvas.nodeSetColor(node, "purple")

        this.sendProcessing(url_api, node_config, 
          (xhr, status, error) => {
            // error-process
            console.log(status)
            canvas.nodeSetColor(node, "red")
            isError = 3 // ajax get error
          },
          data => {
            // complete-process
            console.log(data)
            canvas.nodeSetColor(node, "green")
            isError = 0 // ok
          }
        )
      })

      this.sendProcessing(url_api, {is_: true, code: code.getCode('Stop')}, () => 1 + 1, data => console.log(data))
    })
  }

  sendProcessing(url, data, errorHandle, successHandle) {
    $.ajax({
      dataType: "JSON",
      type: "POST",
      url: url,
      data: data,
      timeout: this.resTimeout += 1000,
      error: errorHandle,
      success: successHandle
    })
  }
}
