import multer from 'multer'
import express, { Router } from 'express'
import path from 'path'
const router = Router()
const storage = multer.diskStorage({
  destination: './temp/',
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    )
  }
})
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 25 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb)
  }
}).single('uploadImage')

const checkFileType = (file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (mimetype && extname) return cb(null, true)
  else cb('Image (.jpeg|.jpg|.png|.gif) Only!')
}

const upload_callback = (req, res) => {
  upload(req, res, err => {
    if (err) {
      res.json({
        msg: err
      })
    } else {
      if (req.file === undefined) {
        res.json({
          msg: 'No File Selected!'
        })
      } else {
        res.json({
          status: 'ok',
          msg: 'File Uploaded!',
          file: `temp/${req.file.filename}`
        })
      }
    }
  })
}

const sleep = (msec) => {
  let waitTill = new Date(new Date().getTime() + msec);
  while(waitTill > new Date()) {}
}

router
  .use('/temp', express.static(path.join(__dirname, '../temp')))
  .post('/upload/:id', upload_callback)
  .get('/upload', (req, res) => {
    res.render('upload')
  })
  .post('/process', (req, res) => {
    console.log(req.body)
    
    sleep(1000)
    res.json({
      status: 'ok'
    })
  })

// const socket_map = new Map()
// const processing_map = new Map()
// let node_count = 0, is_stop = false

// router
// .post('/', (req, res) => {
//   const node = req.body

//   if (!!!node) {
//     res.send(null)
//     return
//   }

//   node.code = parseInt(node.code)

//   if (node.hasOwnProperty('is_')) {
//     let status = null

//     switch (node.code) {
//       case -1: // Start
//         status = 'start'
//         node_count = parseInt(node.count)
//         is_stop = false
//         break
//       case 1: // Stop
//         status = 'stop'
//         processing_map.clear()
//         is_stop = true
//         res.status(500).send({ error: 'Stop' })
//         break
//       default:
//         status = 'unknow_code'
//         break
//     }

//     return
//   }

//   if (processing_map.has(node.id)) {
//     res.send(null)
//     return
//   }

//   if (node.hasOwnProperty('inputs')) {
//     // get inputs

//   } else {
//     // first node, get files

//   }

//   res.json(`${node.id}-ok`)
// })

export default router
