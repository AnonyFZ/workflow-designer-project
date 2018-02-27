import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import methodOverride from 'method-override'
import cors from 'cors'
import favicon from 'serve-favicon'
import start_with_config from '../config'
import router from '../routes'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackDevConfig from '../webpack.dev.config'

const app = start_with_config(express())

app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'pug')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride())
app.use(express.static(path.join(__dirname, '../public')))
app.use(favicon(path.join(__dirname, '../public/favicon.ico')))
app.use(cors())

if (app.get('env') === 'dev') {
  app.use(express.static(path.join(__dirname, '../node_modules')))
  app.use(webpackDevMiddleware(webpack(webpackDevConfig)))
  app.locals.pretty = true
}

// pass app env with middleware
app.use((req, res, next) => {
  res.locals.env = app.get('env')
  next()
})
router(app)

app.listen(app.get('port'))
