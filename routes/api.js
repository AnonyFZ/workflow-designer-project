import {Router} from 'express'
const router = Router()

const sleep = (msec) => {
  let waitTill = new Date(new Date().getTime() + msec);
  while(waitTill > new Date()) {}
}

const processing_map = new Map()
let node_count = 0, is_stop = false

router
  .post('/', (req, res) => {
    const node = req.body

    if (!!!node) {
      res.send(null)
      return
    }
    
    node.code = parseInt(node.code)

    if (node.hasOwnProperty('is_')) {
      let status = null

      switch (node.code) {
        case -1: // Start
          status = 'start'
          node_count = parseInt(node.count)
          is_stop = false
          break
        case 1: // Stop
          status = 'stop'
          while (processing_map.size < node_count) ;
          processing_map.clear()
          is_stop = true
          break
        default:
          status = 'unknow_code'
          break
      }

      res.json(status)
      return
    }

    if (processing_map.has(node.id)) {
      res.send(null)
      return
    }
    
    if (node.hasOwnProperty('inputs')) {
      // get input
      const arr = []
      node.inputs.forEach((elm, index) => {
        arr.push(`[${index + 1}@${processing_map.get(elm)}]`)
      })
      arr.push(node.id)
      processing_map.set(node.id, arr.join(' -> '))

    } else {
      // first node, get files
      processing_map.set(node.id, node.id)
    }

    console.log(processing_map.get(node.id), processing_map.size, node_count)
    sleep(1500)
    res.json(`${node.id}-ok`)
  })

export default router
