window.onload = function() {
  var messages = [];
  var socket = io.connect('http://localhost:3700');
  var field = document.getElementById("field");
  var sendButton = document.getElementById("send");
  var content = document.getElementById("content");
  var name = document.getElementById("name");

  socket.on('message', function (data) {
    if(data.message) {
      messages.push(data);
      var html = '';
      var i;
      for(i=0; i<messages.length; i++) {
        html += messages[i].name + ": ";
        html += messages[i].message + '<br />';
      }
      content.innerHTML = html;
      content.scrollTop(content.scrollHeight);
    } else {
      console.log("There is a problem:", data);
    }
  });

  sendButton.onclick = sendMessage = function() {
    if (name.value === '') {
      alert('Please enter your name');
      return;
    }
    var text = field.value;
    socket.emit('send', { message: text, name: name.value });
    field.value = '';
  };
};

$(document).ready(function() {
    $("#field").keyup(function(e) {
        if(e.keyCode == 13) {
            sendMessage();
        }
    });
});
