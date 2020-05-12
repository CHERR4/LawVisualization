const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path');
const fs = require('fs');
const db = require('./db')
const lawTokenRouter = require('./routes/lawToken-router')

const app = express();
const PORT = 5000

app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())
app.use(fileUpload());
app.use(bodyParser.json())

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

// Upload Endpoint
app.post('/upload', (req, res) => {
  console.log(req.files.file)
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const file = req.files.file;

  file.mv(`../client/public/uploads/${file.name}`, err => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  });
});

app.get('/uploads', (req, res) => {
  console.log(req.query.dir)
  if(req.query.dir === null){
    const dir = "../client/public/uploads/"
  } else {
    const dir = req.query.dir
  }

  const dir = "../client/public/uploads/"


  fs.readdir(dir, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 

    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        console.log(file); 
    });

    res.json({files : files})
  });
})

app.use('/api', lawTokenRouter)

app.listen(PORT, () => console.log(`Server Started...port ${PORT}`));
