import express from 'express';

const server = express();

server.get('/', (req, res) => {
    res.send('Hello world!');
});

server.listen(8000, () => console.log('Listening on http://localhost:8000'));
