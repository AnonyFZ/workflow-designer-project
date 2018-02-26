export default class {
  constructor() {}

  $() {
    const load_image_node = new Node(
      "Load Image",
      "rgb(51,0,102)",
      "rgb(153,204,0)",
      "rgb(102,102,51)",
      2,
      100,
      100,
      0,
      {
        "load_image": setting.addSetting("file", {
          'file': ''
        })
      }
    );
  }
}
