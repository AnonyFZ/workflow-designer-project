import Graph from "graph-data-structure";
import Code from "./code";

export default class {
  constructor(canvas) {
    this.canvas = canvas;
    this.isProcessing = false;
    this.resTimeout = 10000;
    this.isError = 0;
    this.xhrList = [];
    this._();
  }

  _() {
    $(document).keypress(e => {
      this.isProcessing = true;

      const url_api = "http://127.0.0.1:8888/api";
      const g = new Graph();
      const code = new Code();
      const nodes_map = this.canvas.nodes_map;
      const lines_map = this.canvas.lines_map;
      lines_map.forEach(elm => g.addEdge(elm.beginId, elm.endId));
      const serial = g.serialize();
      const sort = g.topologicalSort();

      if (_.size(sort) === 0) {
        this.isError = 1; // no connection
        return;
      }

      if (e.ctrlKey && e.shiftKey && e.key === "s") {
        this.sendProcessing(
          url_api,
          { is_: true, code: code.getCode("Stop") },
          null,
          null
        );
        e.preventDefault();
        return;
      }

      this.sendProcessing(
        url_api,
        { is_: true, code: code.getCode("Start"), count: _.size(sort) },
        null,
        null
      );

      _.forEach(sort, node_id => {
        if (this.isError !== 0) return;

        const node = nodes_map.get(node_id);
        const ncode = code.getCode(node.name);
        const inputs = [];
        let file = "";

        if (_.isNil(ncode)) {
          this.isError = 2; // not found code
          return;
        }

        _.forEach(node.lines, line => {
          if (node.id === line.endId) {
            // get inputs
            inputs.push(line.beginId);
          }
          if (node.id === line.beginId) {
            // get files
            node.file = `file://${node.id}`;
          }
        });

        const node_config = {
          code: ncode,
          name: node.name,
          id: node.id,
          value: node.settings.value,
          inputs: inputs,
          file: node.file,
          magic_number: _.random(9999, true)
        };

        // pre-process
        this.canvas.nodeSetColor(node, "purple");

        if (this.checkValidProcessing()) {
          this.sendProcessing(
            url_api,
            node_config,
            (xhr, status, error) => {
              // error-process
              this.canvas.nodeSetColor(node, "red");
              this.isError = 3; // ajax get error
            },
            data => {
              // complete-process
              this.canvas.nodeSetColor(node, "green");
              this.isError = 0; // ok
            }
          );
        }
      });

      this.sendProcessing(
        url_api,
        { is_: true, code: code.getCode("Stop") },
        null,
        null
      );
    });
  }

  sendProcessing(url, data, errorHandle, successHandle) {
    const xhr = $.ajax({
      dataType: "JSON",
      url: url,
      data: data,
      method: "POST",
      cache: false,
      timeout: (this.resTimeout += 1000),
      beforeSend: xhr => {
        this.xhrList.push(xhr);
      },
      error: errorHandle,
      success: successHandle
    });
  }

  abortAllXHR() {
    this.isError = 4;
    this.isProcessing = false;

    _.forEach(this.xhrList, val => {
      val.abort();
    });
  }

  resetNodesFill() {
    this.canvas.nodes_map.forEach(node => {
      this.canvas.nodeSetColor(node, "lightgray");
    });

    this.abortAllXHR();
  }

  checkValidProcessing() {
    return this.isProcessing && this.isError === 0;
  }
}
