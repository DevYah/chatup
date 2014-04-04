var express = require('express');
var app = express();
var port = 3700;

// jade stuff
app.set('views', __dirname + '/tpl');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

// static resources
app.use(express.static(__dirname + '/public'));
app.get("/", function(req, res) {
  res.render('page');
});

//app.listen(port); // not realtime
var io = require('socket.io').listen(app.listen(port)); // realtime

io.sockets.on('connection', function(socket){
  socket.emit('message', {message: 'welcome to the chat'});
  socket.on('send', function(data) {
    io.sockets.emit('message', data);
  });
});



console.log('Listenintg on ' + port);
