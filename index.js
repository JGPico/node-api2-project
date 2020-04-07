const express = require('express');

const postsRouter = require('./router.js');

const server = express();

server.use(express.json());

server.use('/api/posts', postsRouter);

server.get("/", (req, res) => {
    res.send(`Blog posts`);
});
port = 8000;
server.listen(port, () => {
    console.log(`\n Server listening on port ${port}`);
});