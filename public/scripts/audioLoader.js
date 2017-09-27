var app = app || {};
var source;
var buffer;
var analyser;

window.onload = function () {
    app.init();
    // console.log('audio loader connected');
    navigator.mediaDevices.getUserMedia({audio:true}, soundAllowed, soundNotAllowed)
        .then((stream) => {
            console.log("Streamin", stream);
            soundAllowed(stream);
        })    

    window.addEventListener('drop', onDrop, false);
    window.addEventListener('dragover', onDrag, false);

    function onDrag(e) {
        e.stopPropagation();
        e.preventDefault();
        return false;
    }

    function onDrop(e) {
        e.stopPropagation();
        e.preventDefault();
        var droppedFiles = e.dataTransfer.files;
        initiateAudio(droppedFiles[0]); // initiates audio from the dropped file
    }

    // function initiateAudio(data) {
    //     if(app.audio){
    //         app.audio.remove();
    //         window.cancelAnimationFrame(app.animationFrame);
    //     }
    //     app.audio = document.createElement('audio'); // creates an html audio element
    //     app.audio.src = URL.createObjectURL(data); // sets the audio source to the dropped file
    //     app.audio.autoplay = true;
    //     // app.audio.play();
    //     app.play = true;
    //     document.body.appendChild(app.audio);
    //     app.ctx = new (window.AudioContext || window.webkitAudioContext)(); // creates audioNode
    //     source = app.ctx.createMediaStreamSource(app.audio); // creates audio source
    //     // source = app.ctx.createMediaElementSource(app.audio); // creates audio source
    //     analyser = app.ctx.createAnalyser(); // creates analyserNode
    //     source.connect(app.ctx.destination); // connects the audioNode to the audioDestinationNode (computer speakers)
    //     source.connect(analyser); // connects the analyser node to the audioNode and the audioDestinationNode
    //     app.animate();
    // }

    // -----\
    // CODEPEN
    // -------\

    var soundAllowed = function (stream) {
        //Audio stops listening in FF without // window.persistAudioStream = stream;
        //https://bugzilla.mozilla.org/show_bug.cgi?id=965483
        //https://support.mozilla.org/en-US/questions/984179
        console.log("Sound Allowed");
        window.persistAudioStream = stream;
        app.play = true;
        app.ctx = new (window.AudioContext || window.webkitAudioContext)(); // creates audioNode
        source = app.ctx.createMediaStreamSource(stream) ; 
        analyser = app.ctx.createAnalyser();
        analyser.fftSize = 1024;
        source.connect(analyser);
        app.animate();

        var frequencyArray = new Uint8Array(analyser.frequencyBinCount);
      
        //Through the frequencyArray has a length longer than 255, there seems to be no
        //significant data after this point. Not worth visualizing.

        var doDraw = function () {
            console.log("Doing draw");
            requestAnimationFrame(doDraw);
            console.log(frequencyArray);
            analyser.getByteFrequencyData(frequencyArray);
            var adjustedLength;
            for (var i = 0 ; i < 255; i++) {
                adjustedLength = Math.floor(frequencyArray[i]) - (Math.floor(frequencyArray[i]) % 5);
            }

        }
        doDraw();
    }

    var soundNotAllowed = function (error) {
        console.log("You must allow your microphone.");
        console.log(error);
    }

    
};

