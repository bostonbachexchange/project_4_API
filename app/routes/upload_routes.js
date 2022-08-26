const express = require('express')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer( { storage })
const Upload = require('../models/upload')
const router = express.Router()
const s3Upload = require ('../../s3')

// UPLOAD route - uploads the target file
router.post('/uploads', upload.single('upload'), (req, res, next) => {
    s3Upload(req.file)
        .then(awsFile => {
            console.log('AWS FILE=======>>', awsFile)
            return Upload.create({ url: awsFile.Location })   
        })
		.then(uploadDoc => {
			res.status(201).json({ upload: uploadDoc })
		})
		.catch(next)
})

module.exports = router

// const express = require('express')
// const multer = require('multer')
// // const storage = multer.memoryStorage()
// // const upload = multer({ storage })
// const upload = multer({ dest: 'uploads' })

// // do you have a model called upload?
// // const Upload = require('../models/upload')
// const Song = require('../models/song')
// const router = express.Router()
// const s3Upload = require ('../../s3')

// // UPLOAD route - uploads the target file
// router.post('/uploads', upload.single('upload'), (req, res, next) => {
//     console.log('uploading')
//     console.log('req.file', req.file)
//     s3Upload(req.file)
//         .then(awsFile => {
//             console.log('AWS FILE=======>>', awsFile)
//             return Song.create({ url: awsFile.Location })   
//             // return Upload.create({ url: awsFile.Location })   
//         })
// 		.then(uploadDoc => {
// 			res.status(201).json({ upload: uploadDoc })
// 		})
// 		.catch(next)
// })

// app.post('/images', upload.single('image'), async (req, res) => {
// 	const file = req.file
// 	console.log(file)
// 	const result = await uploadFile(file)
// 	console.log(result)
// 	// const description = req.body.description
// 	res.send('👌')
// })

module.exports = router