var express = require('express');
var app = express();
var port = 3700;
var io = require('socket.io').listen(app.listen(port), {log: false}); // realtime

var usernameToSocketId = {};
var getRoomNames;
var getUserList;
var joinRoom;
var getSocketRoomName;

// jade stuff
app.set('views', __dirname + '/tpl');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

// static resources
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res) {
  console.log(getRoomNames());
  res.render('page', {roomNames: getRoomNames()});
});

//app.listen(port); // not realtime


/* ROOMS STUFF START */
getRoomNames = function(){
  var roomNames = Object.keys(io.sockets.manager.rooms).slice(1);
  return roomNames.map(function(name){return name.slice(1);});
};

joinRoom = function(socket, roomName){
  var username = socket.username;

  socket.join(roomName);

  socket.emit('user_list', getUserList(roomName));
  socket.broadcast.to(roomName).emit('add_person', username);
};

// OPTIMIZE (socket objects are huge)
getUserList = function(roomName){
  var roomSockets = io.sockets.clients(roomName);

  var usernames = roomSockets.map(function(socket){
    var username = socket.username;
    return username;
  });
  console.log(usernames);
  return usernames;
};

getSocketRoomName = function(socket){
  //io.sockets.manager.roomClients[socket.id].keys[1]
  var roomName = Object.keys(io.sockets.manager.roomClients[socket.id])[1];
  if(roomName){
    roomName = roomName.slice(1);
  }

  return roomName;
};
/* ROOM STUFF END*/

io.sockets.on('connection', function(socket){
  socket.emit('message', 
              {
                message:  'welcome to the chat, set a username',
                username: 'SYSTEM'
              });

  socket.on('set_username', function(data) {
    var username = data.username;
    if(usernameToSocketId[usernameToSocketId] || username === 'SYSTEM'){
      socket.emit('not_valid_username', {});
    } else{
      socket.username = username;
      socket.emit('username_set', username);
    }
  });

  socket.on('join_room', function(data){
    // assuming correct name
    var roomName = data.roomName;
    joinRoom(socket, roomName);
  });

  socket.on('create_room', function(data){
    var newRoomName = data.roomName;
    if(getRoomNames().indexOf(newRoomName) === -1){
      console.log('added new room ' + newRoomName);
      io.sockets.emit('new_room_created', { roomName: newRoomName });
      joinRoom(socket, newRoomName);

    } else {
      socket.emit('not_valid_group_name', {});
    }
  });

  socket.on('send', function(data) {
    var roomName = getSocketRoomName(socket);
    var message = data.message;
    var username = socket.username;

    io.sockets.in(roomName).emit('message', {
      username: username,
      message: message
    });
  });

  socket.on('disconnect', function(data){
    var roomName = getSocketRoomName(socket);
    console.log(socket.username + "has been disconnected from " + roomName);
    if(roomName){
      socket.broadcast.to(roomName).emit('person_left', socket.username);
    }
  });
});




console.log('Listenintg on ' + port);

