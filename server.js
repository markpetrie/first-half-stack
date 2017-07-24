
const http = require('http');
const app = require('./lib/app');
const db = require('./lib/db');

const url = 'mongodb://localhost:27017/issues';
db.connect(url);

const server = http.createServer(app);
const port = 3000;
server.listen(port, () => {
    console.log('http server is running on', server.address().port);

});