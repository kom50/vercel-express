import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';
import url, { fileURLToPath } from 'url'
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import multer from 'multer'
import fs from 'fs';

import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

// const upload = multer({ dest: 'uploads/' })

// var multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '/../uploads/'))
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

var upload = multer({ storage: storage });

const app = express();
const PORT = process.env.PORT || 5000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(cookieParser("secret", "ko"))
app.use('/uploads', express.static(path.join(__dirname, '/../uploads')))

console.log(path.join(__dirname, '/../uploads'))

main().catch(err => console.log(err));

async function main() {
    mongoose.connect(process.env.MONGO_DB_URL);
    console.log("🚀 ~ file: index.js ~ line 21 ~ main ~ res",)
}

const ImageSchema = new mongoose.Schema({
    name: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
});

const Image = mongoose.model('Image', ImageSchema);


// await fluffy.save();
// Kitten.count({ name: 'fluffy' }, function (err, adventure) {
//     console.log("🚀 ~ file: index.js ~ line 34 ~ adventure", adventure)
// })

// app.use(express.static('public'))

app.get('/login', (req, res) => {
    var token = jwt.sign({ ...req.body }, 'secret');
    console.log("🚀 ~ file: index.js ~ line 43 ~ app.get ~ token", req.body)
    console.log('Cookies: ', req.cookies)

    res.cookie('token', token, { signed: true, maxAge: 3000, httpOnly: true }).json({
        token,
    })
})

app.get('/protected', (req, res) => {
    try {
        var decoded = jwt.verify(req.cookies.token || req.body.token, 'secret');
        console.log("🚀 ~ file: index.js ~ line 54 ~ app.get ~ decoded", decoded)
        res.json({ verified: true, name: decoded.name, })
    } catch (err) {
        console.log("🚀 ~ decoded", decoded)
        res.json({ not_verified: false })
    }
})
/*  */

app.get('/upload', async (req, res) => {
    console.log('Upload image', path.join(__dirname + '/../uploads/'))
    console.log()
    const data1 = await Image.find({})
    // const data = await Image.find({})
    res.json({ hi: 'gfg', ...data1 })
})

// app.post('/upload', upload.single('avatar'), function (req, res) {
app.post('/upload', upload.single('image'), function (req, res) {


    console.log(req.file, req.body)


    const image = new Image({
        name: req.body.name,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/../uploads/' + req.file.filename)),
            // data: fs.readFileSync(path.join(__dirname + '/../uploads/' + req.file.filename)),
            // contentType: 'image/png'
            contentType: req.file.mimetype
        }
    });

    image.save()
    res.json({ name: 'hii' })
})

/*  */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../public/index.html'))
})


/* User   */

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    imageURL: String,
})

const User = mongoose.model('User', userSchema)

app.get('/user', async (req, res) => {
    const users = await User.find({})
    res.json(users)
})
app.post('/user', upload.single('image'), async (req, res) => {

    console.log("file", req.file)
    const url = req.protocol + '://' + req.get("host");
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        imageURL: url + '/uploads/' + req.file.filename
    })

    try {
        const res1 = await user.save();
        console.log("🚀 ~ file: index.js ~ line 142 ~ app.post ~ res", res1)
        res.json({ ...res1 })
    } catch (err) {
        console.log("🚀 ~ file: index.js ~ line 143 ~ app.post ~ err", err)
        res.json({ error: err })
    }
})

app.delete('/delete', (req, res) => {
    const url = req.protocol + '://' + req.get("host");//+ '/uploads/download.jpeg';
    fs.unlink(path.join(__dirname, '/../uploads') + '/download.jpeg', function (err) {
        if (err) throw err;
        console.log('File deleted!');
        res.send("deleted")
    });
})

/*  */

app.get('/api', (req, res) => {
    console.log(req.query)
    res.json({
        name: 'test',
        age: '4'
    })
})

app.get('/api/:id', (req, res) => {
    console.log("/api/:id/:rt", req.params)
    const q = url.parse(req.url, true).query
    console.log(q)
    res.send('success')
})

app.get('/api/test', (req, res) => {
    res.send('<h1>Hello Bro</h1>')
})

app.get('/test', (req, res) => {
    res.send('<h1>Hello OM</h1>')
})

app.post("/test", (req, res) => {
    console.log("🚀 ~ file: index.js ~ line 46 ~ app.post ~ req", req.body)
    res.send("Hii")
})

app.listen(PORT, () => {
    console.log('listening on port - ' + PORT);
})

// Export the Express API
export default app;