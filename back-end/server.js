const express = require('express');
const upload = require('express-fileupload');
const { v4: uuidv4 } = require('uuid');
var reader = require('any-text');
const fs = require('fs');
const pdf = require('pdf-parse');
const { createWorker } = require('tesseract.js');
const { Client } = require('@elastic/elasticsearch')
var bodyParser = require('body-parser')
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const ESclient = new Client({ node: process.env.ES_API })

app.use(express.static('resumes'));
app.use(upload()); 
// parse application/json
app.use(bodyParser.json())
// Handle CORS
app.use(cors());


// API End point responsable for storing Resumes
app.post('/resumes', (req, res) => {
    const resume = req.files.file;
    let extension = resume.name.split('.')[resume.name.split('.').length - 1];
    let filename = `${uuidv4()}.${extension}`;
    resume.mv("resumes/" + filename, (err, result) => {
        if (err) {
            throw err;
        }

        // Parsing
        reader.getText(`resumes/${filename}`).then((data) => {
            // Storing and indexing
            res.send({
                status: 200,
                message: 'Resume uploaded!'
            });
            storeInES(data, filename);
        }).catch((err) => {
            // The file format not supported by any-text, so it's not a pdf, neither a doc(x)
            // Recognize text using OCR
            const worker = createWorker();
            res.send({
                status: 202,
                message: 'Resume uploaded and will be indexed soon'
            });
            (async () => {
                await worker.load();
                await worker.loadLanguage('eng');
                await worker.initialize('eng');
                const { data: { text } } = await worker.recognize(`resumes/${filename}`);
                await worker.terminate();
                // Storing and indexing
                storeInES(text, filename);
            })();
        })
    })
})

async function storeInES(text, filename) {
    let resumeJson = new Object();
    resumeJson.filename = filename;
    // Extract Email
    const emailRegex = /(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})/i;
    const result = emailRegex.exec(text);

    if (result && result.length > 0) {
        resumeJson.email = result[0];
    }
    resumeJson.text = text;

    //store resumeJson in ElasticSearch
    await ESclient.index({
        index: 'resumes',
        body: {
            resumeJson
        }
    }).catch(console.log);
    await ESclient.indices.refresh({ index: 'resumes' });
}

// API End point responsable for searching Resumes
app.post('/resumes/search', (req, res) => {
    // Build the query object
    let mustQuery = JSON.parse(JSON.stringify(req.body.query.must).split(',').join(' AND '));
    let optionalQuery = req.body.query.optional;
    let alternativesQuery = req.body.query.alternatives;
    let query = new Object();
    if (mustQuery.length == 0 && alternativesQuery.length == 0 && optionalQuery.length == 0) {
        query = {
            match_all: {}
        }
    } else {
        query.bool = new Object();
        if (mustQuery.length > 0 || alternativesQuery.length > 0) {
            query.bool.must = new Array();
            if (mustQuery.length > 0) {
                query.bool.must.push({
                    query_string: {
                        query: mustQuery
                    }
                });
            }
            if (alternativesQuery.length > 0) {
                alternativesQuery.map(element => {
                    query.bool.must.push({
                        query_string: {
                            query: element.split(',').join(' OR ')
                        }
                    });
                });
            }
        }
        if (optionalQuery.length > 0) {
            query.bool.should = new Array();
            optionalQuery.split(',').map(element => {
                query.bool.should.push({
                    query_string: {
                        query: element
                    }
                });
            })
        }
    }
    // Query the data
    ESclient.search({
        index: 'resumes',
        body: {
            from: req.body.query.from,
            size: req.body.query.size,
            query: query
        }
    }).then(({body}) => {
        // Build the response object
        let result = new Array();
        body.hits.hits.map(resume => {
            let r = {
                filename: resume._source.resumeJson.filename,
                score: resume._score
            };
            if (resume._source.resumeJson.email) {
                r.email = resume._source.resumeJson.email;
            }
            result.push(r);
        });
        res.send({
            total: body.hits.total.value,
            result: result
        });
    }).catch(console.log);
})

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));