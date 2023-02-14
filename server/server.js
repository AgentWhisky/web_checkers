// *** Imports ***
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');


// * Import Functions and Classes *
const {Server_handler} = require("./js/server_handler");


// *** Server Creation ***
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// *** Port Settings ***
const defaultPort = 3000;
const port = process.env.PORT || defaultPort;

// *** Path Setup ***
// * Note the '/..' in the path so the server can access the 'client' directory *
const publicDirectoryPath = path.join(__dirname, '/../client');
app.use(express.static(publicDirectoryPath));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/../index.html');
});

// ***** Global Variables *****
handler = new Server_handler(io)

// ***** SocketIO Events *****
io.on('connection', function(socket) {
    console.log(`User Connected with id: [${socket.id}]`);

    // Handle Socket Events
    handler.socketIOEvents(socket);



});


// ***** Listen to Port ******
server.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
})



/*  *** Important Info ***
    npm install –save express
    npm install -save socket.io

    add -> "start": "node server/server.js" to scripts

    *** Commands ***
    node server/server.js  -> run server
    or
    npm run start -> run server

    ctrl + c        -> stop server


    *** Testing ***
    http://localhost:3000


*/