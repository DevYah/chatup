var express = require('express');
var app = express();
var port = 3700;

var roomNames = [];
var usernameToSocketId = {};

// jade stuff
app.set('views', __dirname + '/tpl');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

// static resources
app.use(express.static(__dirname + '/public'));
app.get('/room/:name', function(req, res) {
  res.render('room', {name: req.params.name});
});

app.get("/", function(req, res) {
  res.render('page', {roomNames: roomNames});
});

//app.listen(port); // not realtime

var io = require('socket.io').listen(app.listen(port), {log: false}); // realtime

io.sockets.on('connection', function(socket){
  socket.emit('message', 
              {
                message:  'welcome to the chat, set a username',
                username: 'SYSTEM'
              });

  socket.on('set username', function(data) {
    var username = data.username;
    if(usernameToSocketId[usernameToSocketId] || username === 'SYSTEM'){
      socket.emit('not_valid_username', {});
    } else{
      socket.set('username', username, function(){
        console.log('set username of ' + username);
        usernameToSocketId[data.username] = socket.id;
      });
    }
  });

  socket.on('choose a room', function(data){
    // assuming correct name
    var roomName = data.roomName;
    var username;
    socket.get('username', function(err, uname){username=uname;});

    console.log('name ' + username + ' is choosing ' + roomName);

    socket.join(roomName, function(){
      io.sockets.in(roomName).emit('message', {
        username: 'SYSTEM',
        message:  username + ' has just joined our glorious ' + roomName
      });
    });
  });

  socket.on('create_room', function(data){
    var newRoomName = data.roomName;
    if(roomNames.indexOf(newRoomName) === -1){
      console.log('added new room ' + newRoomName);
      roomNames.push(data.roomName);
      io.sockets.emit('new_room_created', { roomName: newRoomName });
    } else {
      console.log('not a valid roomanem ' + newRoomName);
      socket.emit('not_valid_group_name', {});
    }
  });

  socket.on('send', function(data) {
    var roomName = io.sockets.manager.roomClients[socket.id][1];
    var message = data.message;
    var username;
    socket.get('username', function(err, uname){username=uname;});


    console.log(io.sockets.manager.roomClients[socket.id]);
    console.log('room name is : ' + roomName);
    console.log('username is ' + username);
    console.log('messaeg is ' + message);

    io.sockets.in(roomName).emit('message', {
      username: username,
      message: message
    });
  });
});



console.log('Listenintg on ' + port);
