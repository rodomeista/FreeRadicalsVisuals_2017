var nav = true;
const SOCKET_EVENTS = {
    USER_CONNECT: 'USER_CONNECT',
    USER_DISCONNECT: 'USER_DISCONNECT'
};

$(function() {
  var socket = io();
  var socket = io();
  
  
  
  socket.on(SOCKET_EVENTS.USER_CONNECT, function(username) {
    $("#user_container").append($('<li>').text(username));
  });
  //TODO(arodomista): Implement a way to disconnect users.
//   socket.on(SOCKET_EVENTS.USER_DISCONNECT, function())

  $("#loginButton").on('click', (event) => {
      const username = $("#usernameInput").val();
      socket.emit(SOCKET_EVENTS.USER_CONNECT, username);  
  })
});