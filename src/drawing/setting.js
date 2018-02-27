export default class Setting {
  constructor() {
    this.url_api = 'http://127.0.0.1:8888/api/getcode'
    this.setting_data = null
  }

  loadSetting() {
    return $.ajax({
      url: this.url_api,
      method: 'POST',
      cache: false,
      timeout: 60000,
      error: (xhr, status, error) => {
        alert('Cannot load setting data!')
        this.setting_data = null
      },
      success: data => {
        this.setting_data = data
      }
    })
  }

  getSetting(type) {
    let data = this.setting_data
    if (data.hasOwnProperty(type)) {
      data = data[type]
      _.forEach(data, (elm, key) => {
        if (key !== 'type') elm.value = elm.default_value
      })
    }
    return data
  }
}
