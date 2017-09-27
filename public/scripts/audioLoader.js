var app = app || {};
var source;
var buffer;
var analyser;

window.onload = function () {
    app.init();
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
        app.play = true;
        app.ctx = new (window.AudioContext || window.webkitAudioContext)(); // creates audioNode
        source = app.ctx.createMediaStreamSource(stream) ; 
        analyser = app.ctx.createAnalyser();
        analyser.fftSize = 1024;
        source.connect(analyser);
        app.animate();

        var frequencyArray = new Uint8Array(analyser.frequencyBinCount);
    }

    var failedAudio = function (error) {
        console.log(error);
    }  
};

