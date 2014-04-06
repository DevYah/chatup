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

  //$('#username_step').hide();
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
    var html =  '<a data="' + newRoomName + '" class="room"> ' + newRoomName + '<a/><br>';
    $("#rooms").append(html);
  });

  socket.on('room_joined', function(usernames){
    var html = '<ul>';
    usernames.forEach(function(username){
      html += '<li value="' + username + '">' + username  + '</li>';
    });
    html += '</ul>';
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

  socket.on('not_valid_roomname', function(){
    $('#group_step .error')[0].innerHTML = data.error;
  });

  //socket.on('private_message', function(data){
    //var from = data.from;
    //var message = data.message;
    //alert('you got a message from ' + from + " :" + message);
  //});

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

  $('#room_users').on('click', 'li', function(){
    var toUsername = $(this).attr('value');

    var proper_chat = $('ul.nav li#' + toUsername);

    if(proper_chat.length === 0){
      var html = '<li id="' + toUsername +'"> <a>' + toUsername + '</a></li>';
      $('#navChats').append(html);

      var tabcontent = '<div class="tab-pane" id="b"> bel 7ob ya welad el kalab </div>'
    }else{
    }

    //var html='<div id="chat_' + toUsername+ '" to="' + toUsername + '">';
    //html += 'Chat iwth ' + toUsername + '<br>';
    //html += '<div class="thread">';
    //html += '</div>';
    //html += '<input private="true" to="' + toUsername +'">';
    //html += '<input id="send" type="button" value="send">';

    //html += '</div>';
    //alert('you clicked on ' + toUsername + ', ' + acceptedUserName);
    //$('#chat_step').append(html);
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
