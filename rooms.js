var app = require('./app.js');
var io = app.io;
var allUsernames = {};

/* ROOMS STUFF START */
var getRoomNames = function(){
  var roomNames = Object.keys(io.sockets.manager.rooms).slice(1);
  return roomNames.map(function(name){return name.slice(1);});
};

// OPTIMIZE (socket objects aren't tiny)
var getUserList = function(roomName){
  var roomSockets = io.sockets.clients(roomName);

  var usernames = roomSockets.map(function(socket){
    var username = socket.username;
    return username;
  });
  return usernames;
};

var joinRoom = function(socket, roomName){
  var username = socket.username;

  socket.join(roomName);

  socket.emit('room_joined', getUserList(roomName));
  socket.broadcast.to(roomName).emit('add_person', username);
};

var isUsernameInvalid = function(username){
  username = username.trim();
  if(allUsernames[username])
     return {error: "Username already taken"};

   if(!username.match(/^[a-zA-Z0-9_]+$/))
     return {error: "only use alphabets, numbers or underscore '_'"};

   return false;
};

var getSocketRoomName = function(socket){
  var roomName = Object.keys(io.sockets.manager.roomClients[socket.id])[1];
  if(roomName){
    roomName = roomName.slice(1);
  }

  return roomName;
};

var addUsername = function(username, roomName, socketId){
  allUsernames[username] = socketId;
};

var removeUsername = function(username, roomName){
  delete allUsernames[username] ;
};

var getSocketFromUsername = function(username){
  var socketId = allUsernames[username];
  return io.sockets.socket(socketId);
};

exports.getRoomNames      = getRoomNames;
exports.joinRoom          = joinRoom;
exports.getUserList       = getUserList;
exports.isUsernameInvalid = isUsernameInvalid;
exports.getSocketRoomName = getSocketRoomName;
exports.addUsername       = addUsername;
exports.removeUsername    = removeUsername;

/* ROOM STUFF END*/
