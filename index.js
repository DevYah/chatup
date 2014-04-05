var express = require('express');
var app = express();
var port = 3700;

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
  res.render('page');
});

//app.listen(port); // not realtime
var roomNames = ['space', 'science', 'sports', 'business', 'education'];
var usernameToSocketId = {};
var io = require('socket.io').listen(app.listen(port)); // realtime

io.sockets.on('connection', function(socket){
  socket.emit('message', {message:  'welcome to the chat, set a username', username: 'SYSTEM'});

  socket.on('set username', function(data) {
    var username = data.username;
    socket.set('username', username, function(){
      console.log('set username of ' + username);
      // TODO Assuming no conflicts
      usernameToSocketId[data.username] = socket.id;
    });
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
