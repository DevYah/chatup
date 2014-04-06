var sendMessage;
var socket = io.connect('http://localhost:3700');
var acceptedUserName;

window.onload = function() {

  var usernameField = $('#username');
  var newRoomField = $('#new_room_name');

  /* CHAT SUTFF START  */
  var field = $("#field")[0];
  var sendButton = $("#send")[0];
  var mainThread = $("#content")[0];

  socket.on('message', function (data) {
    if(data.message) {
      var html = data.username + ": " + data.message + "<br />";
      mainThread.innerHTML += html;
      mainThread.scrollTop = mainThread.scrollHeight;
    } else {
      console.log("There is a problem:", data);
    }
  });

  socket.on('new_room_created', function(data){
    var newRoomName = data.roomName;
    var html = 
      '<input type="button" value="' + newRoomName + '" class="button room">';
    $("#rooms").append(html);
  });

  sendButton.onclick = sendMessage = function() {
    var text = field.value;
    socket.emit('send', { message: text });
    field.value = '';
  };
  /* CHAT SUTFF END  */

  /* */
  $('#set_username').on('click', function(){
    socket.emit('set_username', {username: usernameField.val()});
    // FIXME need, to check first
    acceptedUserName = usernameField.val();
  });

  $('#create_room').on('click', function(){
    // TODO need to check
    socket.emit('create_room', {roomName: newRoomField.val()});
  });

  $('#rooms').on('click', '.room', function(){
    var roomName = $(this).val().toLowerCase();
    socket.emit('join_room', {roomName: roomName});
  });
};

$(document).ready(function() {
    $("#field").keyup(function(e) {
        if(e.keyCode === 13) {
            sendMessage();
        }
    });
});
