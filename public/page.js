var socket = io.connect('http://localhost:3700');
var acceptedUserName;
$(document).ready(function() {
  var username = $('#username');

  $('#set_username').click(function(){
    console.log('emiggint my username' + username.val());
    socket.emit('set username', {username: username.val()});
    // FIXME need, to check first
    acceptedUserName = username.val();
  });

  $('.group').click(function(){
    var roomName = $(this).val().toLowerCase();

    console.log('room is ' + roomName);
    socket.emit('choose a room', {roomName: roomName});
  });
});
