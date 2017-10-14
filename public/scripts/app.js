var FBconfig = {
   apiKey: 'AIzaSyCBR2el-lzq7LZvXG7bZJ7ivYNY1Ui3tYc',
   authDomain: 'free-radicals-4ca3a.firebaseapp.com',
   databaseURL: 'https://free-radicals-4ca3a.firebaseio.com',
   projectId: 'free-radicals-4ca3a',
   storageBucket: 'free-radicals-4ca3a.appspot.com',
   messagingSenderId: '767523430935'
 };

firebase.initializeApp(FBconfig);

var prevDims = null;
var configRef = firebase.database().ref('visualization');
var visuals = {}
var Size = 2500;

function createViz(id, audio, config) {
  config = config || {}
  config.dom = '#viz-' + id;
  $('body').css({
    background: '#550000'
  });

  config.position = config.position || {};
  var posX = config.position.x ? (config.position.x * window.innerWidth) : window.innerWidth / 2
  var posY = config.position.y ? (config.position.y * window.innerHeight) : window.innerHeight / 2

  $('.viz-container #viz-' + id).remove();
  $('.viz-container').append('<div class="viz" id="viz-' + id + '" />');
  $('.viz-container #viz-' + id).css({
    width: Size,
    height: Size,
    top: posY - (Size / 2),
    left: posX - (Size / 2)
  });

  var spiral = Spiral(audio, config);
  spiral.animate();
  return spiral;
}

function updateViz(id, config) {
  config.position = config.position || {};
  var posX = config.position.x ? (config.position.x * window.innerWidth) : window.innerWidth / 2
  var posY = config.position.y ? (config.position.y * window.innerHeight) : window.innerHeight / 2

  $('.viz-container #viz-' + id).css({
    width: Size,
    height: Size,
    top: posY - (Size / 2),
    left: posX - (Size / 2)
  });
}

VizAudio().then(function (audio) {
  configRef.on('value', function(snapshot) {
    var vizData = snapshot.val()
    var len = _.values(vizData).length
    var dims = {w: 5000, h: 5000}
    var diff = len % 3

    for (var v in vizData) {
      let config = vizData[v]

      if (visuals[v]) {
        updateViz(v, config)
        visuals[v].update(config)
      } else {
        visuals[v] = createViz(v, audio, config)
      }
    }

    // if (diff) {
    //   while(diff >= 0) {
    //     createViz(diff, audio, {dims: dims})
    //     diff--
    //   }
    // }
    prevDims = dims.w + '-' + dims.h
  });
})
