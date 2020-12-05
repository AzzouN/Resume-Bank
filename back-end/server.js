const express = require('express')
const fileUpload = require('express-fileupload')
const upload = require('express-fileupload')
const { v4: uuidv4 } = require('uuid')
var reader = require('any-text');
const fs = require('fs');
const pdf = require('pdf-parse');
const { createWorker } = require('tesseract.js')


const app = express()
const PORT = process.env.PORT || 5000

app.use(express.static('resumes'))
app.use(upload())

// API End point responsable for storing Resumes
app.post('/resumes', (req, res) => {
    const resume = req.files.resume
    let filename = uuidv4()
    let extension = resume.name.split('.')[resume.name.split('.').length - 1]
    let result
    resume.mv("resumes/" + filename + '.' + extension, (err, result) => {
        if (err) {
            throw err
        }

        // Parsing
        reader.getText(`resumes/${filename}.${extension}`).then((data) => {
            result = data
            // Storing and indexing
            res.send({
                message: 'Resume uploaded!'
            })
        }).catch((err) => {
            // The file format not supported by any-text, so it's not a pdf, neither a doc(x)
            // Recognize text using OCR
            const worker = createWorker({
                logger: m => console.log(m),
            });
            (async () => {
                console.log('inside function');
                await worker.load()
                await worker.loadLanguage('eng')
                await worker.initialize('eng')
                result = await worker.recognize(`resumes/${filename}.${extension}`)
                console.log(result)
                await worker.terminate()
                // Storing and indexing
                res.send({
                    message: 'Resume uploaded!'
                })
            })()
            
        })
    })
})

// API End point responsable for searching Resumes
app.get('/resumes', (req, res) => {
    res.send('Searching endpoint')
})

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))