const express = require('express');
const app = express();
const dotenv = require('dotenv');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
const mongoose = require('mongoose')
const authRoute = require('./p_routes/auth');
const Image = require('./model/Image');

dotenv.config();

mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true },
    () => console.log('connected to db!') 
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/user', authRoute);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set("view engine", "ejs");

var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({ storage: storage });

app.get('/api/signup', (req, res) => {
    Image.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render('signup', { items: items });
        }
    });
});

app.get('/api/upload', (req, res) => {
    Image.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render('imagesPage', { items: items });
        }
    });
});

app.post('/api/upload', upload.single('image'), (req, res, next) => {
    var obj = {
        id: req.body.id,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }
    Image.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            // item.save();
            res.redirect('/api/upload');
        }
    });
});

app.listen(3000, () => console.log('server up'));
