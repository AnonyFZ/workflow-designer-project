import multer from 'multer'
import express, { Router } from 'express'
import path from 'path'
import cv from '../node_modules/opencv/build/opencv/v6.0.0/Release/node-v59-linux-x64/opencv.node'

const router = Router()
const image_path = './temp/'
const storage = multer.diskStorage({
  destination: image_path,
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
          file: path.join(image_path, req.file.filename),
          mimetype: req.file.mimetype
        })
      }
    }
  })
}

const sleep = msec => {
  let waitTill = new Date(new Date().getTime() + msec)
  while (waitTill > new Date()) {}
}

const getcode_callback = (req, res) => {
  const code = {
    End: { type: 'end' },
    'Load Image': {
      type: 'load_image',
      style: {
        fill: 'rgb(255, 255, 204)',
        text: 'rgb(77, 77, 0)',
        stroke: 'rgb(77, 77, 0)',
        limit: 0
      },
      upload_image: { type: 'upload', default_value: '' }
    },
    'Gaussian Blur': {
      type: 'gaussian_blur',
      style: {
        fill: 'rgb(204, 204, 255)',
        text: 'rgb(0, 0, 77)',
        limit: 1
      },
      sigmaX: { type: 'input', default_value: 17 },
      sigmaY: { type: 'input', default_value: 0 }
    },
    'Convert Grayscale': {
      type: 'convert_grayscale',
      style: {
        fill: 'rgb(224, 235, 235)',
        text: 'rgb(41, 61, 61)',
        limit: 1
      }
    },
    'Convert HSVscale': {
      type: 'convert_hsvscale',
      style: {
        fill: 'rgb(255, 153, 255)',
        text: 'rgb(153, 0, 153)',
        limit: 1
      }
    },
    Resize: {
      type: 'resize',
      style: {
        fill: 'rgb(255, 221, 204)',
        text: 'rgb(153, 0, 0)',
        limit: 1
      },
      width: { type: 'input', default_value: 0 },
      height: { type: 'input', default_value: 0 }
    },
    Brightness: {
      type: 'brightness',
      style: {
        fill: 'rgb(255, 179, 179)',
        text: '	rgb(179, 0, 0)',
        limit: 1
      },
      alpha: { type: 'slider', default_value: 0, min_value: 0, max_value: 3.0 },
      beta: { type: 'slider', default_value: 0, min_value: 0, max_value: 100 }
    }
  }

  res.json(code)
}

const nodes_map = new Map()
const process = data => {
  const id = data.id
  const settings = data.settings
  const code = settings.type
  const input = data.input || settings.upload_image.value
  let output_file = path.join(image_path, 'process', `${id}.png`)

  switch (code) {
    case 'load_image':
      cv.readImage(input, (err, img) => {
        if (err) throw err
        if (img.width() < 1 || img.height() < 1)
          throw new Error('Image has no size')
        img.save(output_file)
      })
      break
    case 'convert_grayscale':
      cv.readImage(nodes_map.get(input[0]), (err, img) => {
        if (err) throw err
        if (img.width() < 1 || img.height() < 1)
          throw new Error('Image has no size')

        img.convertGrayscale()
        img.save(output_file)
      })
      break
    case 'convert_hsvscale':
      cv.readImage(nodes_map.get(input[0]), (err, img) => {
        if (err) throw err
        if (img.width() < 1 || img.height() < 1)
          throw new Error('Image has no size')

        img.convertHSVscale()
        img.save(output_file)
      })
      break
    case 'gaussian_blur':
      let sigmaX = parseFloat(settings.sigmaX.value),
        sigmaY = parseFloat(settings.sigmaY.value)
      cv.readImage(nodes_map.get(input[0]), (err, img) => {
        if (err) throw err
        if (img.width() < 1 || img.height() < 1)
          throw new Error('Image has no size')

        if (sigmaY === 0) sigmaY = sigmaX
        if (sigmaX % 2 === 0) sigmaX++
        if (sigmaY % 2 === 0) sigmaY++

        img.gaussianBlur([sigmaX, sigmaY])
        img.save(output_file)
      })
      break
    case 'resize':
      let width = parseInt(settings.width.value),
        height = parseInt(settings.height.value)
      cv.readImage(nodes_map.get(input[0]), (err, img) => {
        if (err) throw err
        if (img.width() < 1 || img.height() < 1)
          throw new Error('Image has no size')

        if (width === 0) width = img.width() * 2
        if (height === 0) height = img.height() * 2

        img.resize(width, height)
        img.save(output_file)
      })
      break
    case 'brightness':
      let alpha = parseFloat(settings.alpha.value),
        beta = parseInt(settings.beta.value)
      cv.readImage(nodes_map.get(input[0]), (err, img) => {
        if (err) throw err
        if (img.width() < 1 || img.height() < 1)
          throw new Error('Image has no size')

        img.brightness(alpha, beta)
        img.save(output_file)
      })
      break
  }

  nodes_map.set(id, output_file)
  return 'ok'
}

const process_callback = (req, res) => {
  const node = req.body
  const res_data = { status: 'ok', end: 0 }
  if (node.code === 'end') {
    // reset server
    nodes_map.clear()
    res_data.end = 1
  } else {
    const r = process(node)
    console.log(r)
    sleep(1500)
  }

  res.json(res_data)
}

router
  .use('/temp', express.static(path.join(__dirname, '../temp')))
  .post('/upload/:id', upload_callback)
  .post('/getcode', getcode_callback)
  .post('/process', process_callback)

export default router
