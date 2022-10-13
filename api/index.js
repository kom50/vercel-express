import express from 'express';

const app = express();
const PORT = 5000

app.get('/api', (req, res) => {
    res.json({
        name: 'test',
        age: '4'
    })
})

app.get('/api/test', (req, res) => {
    res.send('<h1>Hello Bro</h1>')
})

app.listen(PORT, () => {
    console.log('listening on port - ' + PORT);
})

// Export the Express API
export default app;