import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000

app.use(express.static('public'))

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