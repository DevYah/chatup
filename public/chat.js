var sendMessage;
window.onload = function() {
  var messages = [];
  var field = $("#field")[0];
  var sendButton = $("#send")[0];
  var content = $("#content")[0];

  socket.on('message', function (data) {
    if(data.message) {
      messages.push(data);
      var html = '';
      var i;
      for(i=0; i<messages.length; i++) {
        html += messages[i].username + ": ";
        html += messages[i].message + '<br />';
      }
      // TODO append don't accumlate
      content.innerHTML = html;
      content.scrollTop = content.scrollHeight;
    } else {
      console.log("There is a problem:", data);
    }
  });

  sendButton.onclick = sendMessage = function() {
    var text = field.value;
    socket.emit('send', { message: text });
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
