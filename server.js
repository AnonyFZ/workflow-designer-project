import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import multer from 'multer'
import methodOverride from 'method-override'
import cors from 'cors'
import favicon from 'serve-favicon'
import start_with_config from './config'
import router from './routes'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackConfig from './webpack.config'

const app = start_with_config(express())

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(methodOverride())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(favicon(path.join(__dirname, 'public/favicon.ico')))
app.use(cors())
router(app)

if (app.get('env') === 'dev') {
  app.use(webpackDevMiddleware(webpack(webpackConfig)))
  app.locals.pretty = true
}

app.listen(app.get('port'))
