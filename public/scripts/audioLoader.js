var Source;

var VizAudio = function () {
    var buffer;
    var app = {}

    return new Promise (function (res, cat) {

      navigator.mediaDevices.getUserMedia({audio:true}, receivedAudio, failedAudio)
          .then((stream) => {
              console.log("We streamin 😎 🎼");
              receivedAudio(stream);
          })
          .catch((error) => {
              failedAudio(error);
          });

      var receivedAudio = function (stream) {
          window.persistAudioStream = stream;
          app.stream = stream;
          app.ctx = new (window.AudioContext || window.webkitAudioContext)(); // creates audioNode
          Source = app.ctx.createMediaStreamSource(stream);
          app.analyser = app.ctx.createAnalyser();
          app.analyser.fftSize = 1024;
          Source.connect(app.analyser);

          res(app)
      }

      var failedAudio = function (error) {
          cat(error)
      }
  });
};
