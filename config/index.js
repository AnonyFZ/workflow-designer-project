const env_project = process.env.NODE_ENV || 'development'
const env_files = require('./' + env_project)

export default (app) => {
  if (!!app) {
    Object.keys(env_files).forEach((key) => {
      app.set(key, env_files[key])
    })
  }
  return app
}
