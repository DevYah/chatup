var sendMessage;
var displayMessage;
var socket = io.connect();
var acceptedUserName;

window.onload = function() {
  var usernameField = $('#username');
  var newRoomField = $('#new_room_name');

  var field = $("#field")[0];
  var sendButton = $("#send")[0];
  var mainThread = $("#content")[0];

  $('#group_step').hide();
  $('#chat_step').hide();

  socket.on('message', function (data) {
    if(data.message) {
      displayMessage(mainThread, data.message, data.username);
    } else {
      console.log("There is a problem:", data);
    }
  });

  socket.on('new_room_created', function(data){
    var newRoomName = data.roomName;
    var html =  '<a data="' + newRoomName + '" class="room"> ' + newRoomName + '<a/>';
    $("#rooms").append(html);
    if($('#rooms .alert').length !== 0)
      $('#rooms .alert').remove();
  });

  socket.on('room_joined', function(data){
    var usernames = data.usernames;
    var roomName = data.roomName;
    var html = '<ul>';
    usernames.forEach(function(username){
      html += '<li value="' + username + '">' + username  + '</li>';
    });
    html += '</ul>';
    $('li.active a').innerHTML = roomName;
    $('#users')[0].innerHTML = html;
    $('#group_step').hide();
    $('#chat_step').show();
  });

  socket.on('add_person', function(username){
    displayMessage(mainThread,username + " has joined");
    $('#users ul').append('<li value="' + username + '">' + username + '</li>');
  });

  socket.on('person_left', function(username){
    displayMessage(mainThread,username + " has left");
    $('#users li[value=' + username +']').remove();
  });

  socket.on('not_valid_username', function(data){
    $('#username_step .error')[0].innerHTML = data.error;
  });

  socket.on('not_valid_roomname', function(data){
    $('#group_step .error')[0].innerHTML = data.error;
  });

  socket.on('username_set', function(){
    $('#username_step').hide();
    $('#group_step').show();
  });

  sendButton.onclick = sendMessage = function() {
    var text = field.value;
    socket.emit('message', { message: text });
    field.value = '';
  };
  /* CHAT SUTFF END  */

  $('#set_username').on('click', function(){
    socket.emit('set_username', {username: usernameField.val()});
    acceptedUserName = usernameField.val();
  });


  $('#create_room').on('click', function(){
    socket.emit('create_room', {roomName: newRoomField.val()});
  });

  $('#rooms').on('click', '.room', function(){
    var roomName = $(this).attr('data').toLowerCase();
    socket.emit('join_room', {roomName: roomName});
  });
};

$(document).ready(function() {
    $("#field").keyup(function(e) {
        if(e.keyCode === 13) {
            sendMessage();
        }
    });

    $("#username").keyup(function(e) {
        if(e.keyCode === 13) {
          $('#set_username').click();
        }
    });

    $("#new_room_name").keyup(function(e) {
        if(e.keyCode === 13) {
          $('#create_room').click();
        }
    });
});

displayMessage = function(chatWindow,  message, username){
  var html;
  if(username)
    html = username + ": " + message + "<br />";
  else
    html = message + "<br />";

  chatWindow.innerHTML += html;
  chatWindow.scrollTop = chatWindow.scrollHeight;
};
