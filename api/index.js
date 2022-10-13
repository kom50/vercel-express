import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'


const app = express();
const PORT = process.env.PORT || 5000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../public/index.html'))
})

app.get('/api', (req, res) => {
    res.json({
        name: 'test',
        age: '4'
    })
})

app.get('/api/test', (req, res) => {
    res.send('<h1>Hello Bro</h1>')
})

app.get('/test', (req, res) => {
    res.send('<h1>Hello OM</h1>')
})

app.listen(PORT, () => {
    console.log('listening on port - ' + PORT);
})

// Export the Express API
export default app;