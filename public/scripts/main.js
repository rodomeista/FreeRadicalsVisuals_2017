var nav = true;
const SOCKET_EVENTS = {
    USER_CONNECT: 'USER_CONNECT',
    USER_DISCONNECT: 'USER_DISCONNECT'
};

$(function() {
  var socket = io();
  socket.emit(SOCKET_EVENTS.USER_CONNECT, 'Addison Rodomista');
  socket.on(SOCKET_EVENTS.USER_CONNECT, function(username) {
    $("#user_container").append($('<li>').text(username));
  });
});