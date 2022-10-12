import express from 'express';

const app = express();
const PORT = 5000

app.get('/', (req, res) => {
    res.json({
        name: 'test',
        age: '4'
    })
})

app.listen(PORT, () => {
    console.log('listening on port - ' + PORT);
})