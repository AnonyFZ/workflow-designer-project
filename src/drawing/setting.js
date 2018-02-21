export default class Setting {
  addSetting(type = 'default', ...values) {
    let o = {
      'default': {
        value: 0,
        default_value: 0
      },
      'input': {},
      'boolean': {},
      'slider': {
        min_value: 0,
        max_value: 0
      },
    }

    let settings = _.assign(o[type], o.default)
    let index = 0
    _.forEach(settings, (val, key) => {
      settings[key] = values[index++]
    })

    return _.assign({type: type}, settings)
  }
}
