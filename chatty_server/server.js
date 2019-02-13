// server.js

const express = require('express');
// const SocketLib = require('ws');
// const SocketServer = SocketLib.Server;
const SocketServer = require('ws').Server;
const uuidv4 = require('uuid/v4');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('message', (msg) => {
    const newObj = JSON.parse(msg);
    newObj.id = uuidv4();
    //console.log('newObj', newObj);

    // wss.broadcast = function broadcast(newObj) {
      wss.clients.forEach(function each(client) {
        //if (client.readyState === SocketLib.OPEN) {
        if (client.readyState) { 
          //console.log('sending the msg to client ready state', client);
          client.send(JSON.stringify(newObj));
        }
      })
    // }

    //ws.send(newObj);
  })
  //  console.log(ws);
  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => console.log('Client disconnected'));
});