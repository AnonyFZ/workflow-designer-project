export default class {
  constructor(canvas) {
    this.canvas = canvas
    this.is_processing = false
    this.is_error = false
    this.queue = []
    this.$(canvas)
  }

  $(canvas) {
    $('#control-button').click(e => {
      this.qAjax({ text: 'node1' })
      this.qAjax({ text: 'node3' })
      this.qAjax({ text: 'node2' })
      this.qNext()
    })
  }

  qAjax(data) {
    this.queue.push({
      dataType: 'JSON',
      url: 'http://127.0.0.1:8888/api/process',
      data: data,
      method: 'POST',
      cache: false,
      success: data => {
        console.log(data.status)
      }
    })
  }

  qNext() {
    if (this.queue.length === 0) return

    $.ajax(this.queue.shift()).done(this.qNext.bind(this))
  }
}
