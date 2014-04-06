var express = require('express');
var app = express();
var port = process.argv[2] || 8080;
var io = require('socket.io').listen(app.listen(port), {log: false});
exports.io = io;

// responsible of the logic of the room
var rooms = require('./rooms.js');

// jade stuff
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

// static resources
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res) {
  res.render('page', {roomNames: rooms.getRoomNames()});
});

io.sockets.on('connection', function(socket){
  socket.emit('message', 
              {
                message:  'welcome to the chat up',
                username: 'SYSTEM'
              });

  socket.on('set_username', function(data) {
    var username = data.username;
    var invalidty = rooms.isUsernameInvalid(username);
    if(!invalidty){
      socket.username = username;
      socket.emit('username_set', username);
      rooms.addUsername(username, socket.id);
    } else{
      socket.emit('not_valid_username', {error: invalidty.error});
    }
  });

  socket.on('join_room', function(data){
    var roomName = data.roomName;
    rooms.joinRoom(socket, roomName);
  });

  socket.on('create_room', function(data){
    var newRoomName = data.roomName;
    if(rooms.getRoomNames().indexOf(newRoomName) === -1){
      io.sockets.emit('new_room_created', { roomName: newRoomName });
      rooms.joinRoom(socket, newRoomName);

    } else {
      socket.emit('not_valid_group_name', {});
    }
  });

  socket.on('message', function(data) {
    var roomName = rooms.getSocketRoomName(socket);
    var message = data.message;
    var username = socket.username;

    io.sockets.in(roomName).emit('message', {
      username: username,
      message: message
    });
  });

  socket.on('private_message', function(data){
    var fromUsername = socket.username;
    var toUsername = data.username
    var toSocket = rooms.getSocketFromUsername(username);
    var message = data.message; 

    toSocket.emit('private_message', {from: fromUsername, message: message});
  });

  socket.on('disconnect', function(){
    var roomName = rooms.getSocketRoomName(socket);
    var username = socket.username;
    rooms.removeUsername(username);
    if(roomName){
      socket.broadcast.to(roomName).emit('person_left', username);
    }
  });
});

console.log('Listenintg on ' + port);
