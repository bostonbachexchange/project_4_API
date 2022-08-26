// require('dotenv').config()
// const fs = require('fs')
// const S3 = require('aws-sdk/clients/s3')

// // const bucketName = process.env.AWS_BUCKET_NAME
// const region = process.env.AWS_ACCESS_KEY
// const accessKeyId = process.env.AWS_ACCESS_KEY
// const secretAccessKey = process.env.AWS_SECRET_KEY

// const s3 = new S3({
//     region,
//     accessKeyId,
//     secretAccessKey
// })
// // Read the file elsewhere, accept it here
// function uploadFile(file) {
//     const fileStream = fs.createReadStream(file.path)

//     const uploadParams = {
//         Bucket: bucketName, 
//         // Key: Date.now() + '_' + file.originalname, 
//         Body: fileStream,
//         Key: file.filename, 
//         // ACL: 'public-read',
//         // ContentType: file.mimetype
//     }

//     return s3.upload(uploadParams).promise()
// }

// exports.uploadFile = uploadFile

require('dotenv').config()
//var fs = require('fs');
const AWS = require ('aws-sdk')
// Create S3 service object
const s3 = new AWS.S3({apiVersion: '2006-03-01'})

//

// const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_ACCESS_KEY
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY


// Read the file elsewhere, accept it here
module.exports = function (file) {
    console.log(file.mimetype)
    const uploadParams = {
        Bucket: process.env.BUCKET, 
        // accessKeyId:process.env.AWS_ACCESS_ID,
        // secretAccessKey: process.env.AWS_SECRET_KEY,
        // accessKeyId: process.env.AWS_ACCESS_KEY ,
        Key: Date.now() + '_' + file.originalname, 
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: file.mimetype,
    }

    return s3.upload(uploadParams).promise()
}



