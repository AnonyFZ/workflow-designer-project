import home from './home'
import api from './api'

const routesMapping = {
  '/': home,
  '/api': api
}

export default (app) => Object.keys(routesMapping).forEach( (key) => app.use(key, routesMapping[key]) )
