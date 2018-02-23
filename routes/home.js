import {Router} from 'express'
const router = Router()

router
  .get('/', (req, res) => res.render('index'))
  .get('/canvas', (req, res) => res.render('canvas'))
export default router
