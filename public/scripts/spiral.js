function Spiral(audio, options) {
  var app = {}
  var defaults = {
      intensity: 0.18,
      toggleRed: true,
      toggleGreen: false,
      toggleBlue: false,
      fov: (Math.random() * 40) + 10,
      radius: 50,
      a: 0.15,
      b: 0.20,
      angle: 11,
      aWavy: 1.20,
      bWavy: 0.76,
      wavyAngle: 2.44,
      aFlower: 25,
      bFlower: 0,
      flowerAngle: 2.86,
      spiral: false,
      wavySpiral: false,
      flower: false,
      circle: false,
      animate: true,
      color: '#'+Math.floor(Math.random()*16777215).toString(16),
      background: '#'+Math.floor(Math.random()*16777215).toString(16),
      dom: 'body'
  }
  var types = ['spiral', 'wavySpiral', 'flower', 'circle']
  var selectType = Math.floor(Math.random() * types.length);

  var spiral = _.extend({}, defaults, options || {})
  var type = spiral.type || types[selectType]
  spiral[type] = true

  var rgb = hexToRgb(spiral.color);
  spiral = _.extend({}, spiral, rgb);
  spiral.background = '#000000'

  var camera, scene, renderer;

  app.init = function init() {
      scene = new THREE.Scene();

      var width = 2500;
      var height = 2500;

      var fov = 50;
      spiral.start = true

      renderer = new THREE.CanvasRenderer({alpha: true});
      renderer.setSize(width, height);
      document.querySelector(spiral.dom).appendChild(renderer.domElement);

      camera = new THREE.PerspectiveCamera(fov, width / height, 1, 10000);
      camera.position.set(0, 0, 175);

      var PI2 = Math.PI * 2;
      app.particles = new Array();

      for (var i = 0; i <=2048; i++) {
          var material = new THREE.SpriteCanvasMaterial({
              color: 0xffffff,
              program: function (context) {
                  context.beginPath();
                  context.arc(0, 0, 0.33, 0, PI2);
                  context.fill();
              }
          });
          var particle = app.particles[i++] = new THREE.Particle(material);
          scene.add(particle);
      }
  }

  app.update = function (options) {
    spiral = _.extend({}, spiral, options);
    var rgb = hexToRgb(spiral.color);
    spiral = _.extend({}, spiral, rgb);

    if (options.type) {
      spiral.spiral = false;
      spiral.wavySpiral = false;
      spiral.flower = false;
      spiral.circle = false;

      spiral[spiral.type] = true
    }
  }

  app.animate = function animate() {
      app.animationFrame = (window.requestAnimationFrame || window.webkitRequestAnimationFrame)(app.animate);
      // stats.begin();
      app.animateParticles();
      checkVisualizer();
      camera.lookAt( scene.position );
      renderer.render( scene, camera );
      // stats.end();
  }

  app.animateParticles = function animateParticles(){
      // Fast Fourier Transform (FFT) used to determine waveform
      var timeFrequencyData = new Uint8Array(audio.analyser.fftSize);
      var timeFloatData = new Float32Array(audio.analyser.fftSize);
      audio.analyser.getByteTimeDomainData(timeFrequencyData);
      audio.analyser.getFloatTimeDomainData(timeFloatData);

      for (var j = 0; j <= app.particles.length; j++){
          particle = app.particles[j++];
          if (spiral.toggleRed){
              // forces red by adding the timeFloatData rather than subtracting
              var R = spiral.R + (timeFloatData[j]);
              var G = spiral.G - (timeFloatData[j]);
              var B = spiral.B - (timeFloatData[j]);
              particle.material.color.setRGB(R, G, B);
          }
          else if (spiral.toggleGreen){
              // forces green by adding the timeFloatData rather than subtracting
              var R = spiral.R - (timeFloatData[j]);
              var G = spiral.G + (timeFloatData[j]);
              var B = spiral.B - (timeFloatData[j]);
              particle.material.color.setRGB(R, G, B);
          }
          else if (spiral.toggleBlue){
              // forces blue by adding  the timeFloatData rather than subtracting
              var R = spiral.R - (timeFloatData[j]);
              var G = spiral.G - (timeFloatData[j]);
              var B = spiral.B + (timeFloatData[j]);
              particle.material.color.setRGB(R, G, B);
          }
          else {
              particle.material.color.setHex(0xffffff);
          }
          if (spiral.spiral){
              // Archimedean Spiral
              particle.position.x = (spiral.a + spiral.b * ((spiral.angle / 100) * j ))
                                  * Math.sin( ((spiral.angle / 100) * j) );
              particle.position.y = (spiral.a + spiral.b * ((spiral.angle / 100) * j ))
                                  * Math.cos( ((spiral.angle / 100) * j) );
              particle.position.z = (timeFloatData[j] * timeFrequencyData[j] * spiral.intensity);

              camera.position.y = 0;
          }
          else if(spiral.wavySpiral){
              // Archimedean Spiral with sin and cos added respectively to position to create a wavy spiral

              // * 5 for starfish?
              particle.position.x = (spiral.aWavy + spiral.bWavy * ((spiral.wavyAngle / 100) * j))
                                  * Math.sin(( (spiral.wavyAngle / 100) * j))
                                  + Math.sin(j / (spiral.wavyAngle / 100));
              particle.position.y = (spiral.aWavy + spiral.bWavy * ((spiral.wavyAngle / 100) * j))
                                  * Math.cos(( (spiral.wavyAngle / 100) * j))
                                  + Math.cos(j / (spiral.wavyAngle / 100));
              particle.position.z = (timeFloatData[j] * timeFrequencyData[j] * spiral.intensity);

              camera.position.y = 0;
          }
          else if(spiral.flower){
              particle.position.x = (spiral.aFlower + spiral.bFlower * ((spiral.flowerAngle / 100) * j))
                                  * Math.cos(( (spiral.flowerAngle / 100) * j))
                                  + Math.sin(j / (spiral.flowerAngle / 100)) * 17;
              particle.position.y = (spiral.aFlower + spiral.bFlower * ((spiral.flowerAngle / 100) * j))
                                  * Math.sin(( (spiral.flowerAngle / 100) * j))
                                  + Math.cos(j / (spiral.flowerAngle / 100)) * 17;
              particle.position.z = (timeFloatData[j] * timeFrequencyData[j] * spiral.intensity);
              camera.position.y = 0;
          }
          else if (spiral.circle){
              particle.position.x = Math.sin(j) * (j / (j/spiral.radius));
              particle.position.y = (timeFloatData[j] * timeFrequencyData[j] * spiral.intensity);
              particle.position.z = Math.cos(j) * (j / (j/spiral.radius));
              camera.fov = 35;
              camera.position.y = 100;
          }
      }
      camera.fov = spiral.fov;
      camera.updateProjectionMatrix();
  }

  function hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
          R: parseInt(result[1], 16) / 255,
          G: parseInt(result[2], 16) / 255,
          B: parseInt(result[3], 16) / 255
      } : null;
  }

  function checkVisualizer(){
      if(spiral.animate){
          if(spiral.spiral){
              changeAngle();
          }
          else if (spiral.wavySpiral){
              changeWavyAngle();
          }
          else if (spiral.flower){
              changeFlowerAngle();
          }
          else if (spiral.circle){
              changeCircleRadius();
          }
      }
  }

  app.spiralCounter = true;
  app.wavySpiralCounter = true;
  app.circleCounter = true;
  app.flowerCounter = false;

  function changeAngle (){
      if (app.spiralCounter){
          spiral.angle += 0.0008;
          if (spiral.angle >= 13){
              app.spiralCounter = false;
          }
      }
      else {
          spiral.angle -= 0.0008;
          if(spiral.angle <= 9){
              app.spiralCounter = true;
          }
      }
  }

  function changeWavyAngle(){
          if (app.wavySpiralCounter){
              spiral.wavyAngle += 0.000004;
              if (spiral.wavyAngle >= 2.48){
                  app.wavySpiralCounter = false;
              }
          }
          else {
              spiral.wavyAngle -= 0.000006;
              if (spiral.wavyAngle <= 2.43){
                  app.wavySpiralCounter = true;
              }
          }
  }

  function changeFlowerAngle(){
      if (app.flowerCounter){
          spiral.flowerAngle += 0.0000004;
          if (spiral.flowerAngle >= 2.87){
              app.flowerCounter = false;
          }
      }
      else {
          spiral.flowerAngle -= 0.0000004;
          if (spiral.flowerAngle <= 2.85){
              app.flowerCounter = true;
          }
      }
  }

  function changeCircleRadius(){
      if (app.circleCounter){
          spiral.radius += 0.05;
          if (spiral.radius >= 65){
              app.circleCounter = false;
          }
      }
      else {
          spiral.radius -= 0.05;
          if (spiral.radius <= 35){
              console.log('hit');
              app.circleCounter = true;
          }
      }
  }

  app.init()
  return app
}
