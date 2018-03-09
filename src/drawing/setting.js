export default class Setting {
  constructor() {
    this.url_api = 'http://127.0.0.1:8888/api/getcode'
    this.setting_data = null
  }

  $() {
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
    let k = null
    let res = null
    _.forEach(data, (elm, key) => {
      data[key].name = key
      _.forEach(data[key], elm2 => {
        if (elm2.hasOwnProperty('default_value'))
          elm2.value = elm2.default_value
      })

      if (elm.type === type) {
        k = key
        return
      }
    })

    return data[k]
  }

  get() {
    return this.setting_data
  }
}
