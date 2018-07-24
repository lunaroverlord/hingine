
/*
TrigIter = 5
TrigLimit = 1.1
Center = -0.0213501,-0.0041966
Zoom = 4.062113
Gamma = 2.843137
ToneMapping = 3
Exposure = 1.3044
Brightness = 1
Contrast = 1.0396
Saturation = 1.8817
AARange = 1
AAExp = 1
GaussianAA = false
Iterations = 69
PreIterations = 52
R = 0.5677083
G = 0.3036649
B = 0.6458333
C = 1.135417
Julia = true
JuliaX = 1.43649
JuliaY = 2.05404
ShowMap = false
MapZoom = 2.006667
EscapeSize = 5
ColoringType = 0
ColorFactor = 0.5
MinRadius = 0
Scaling = -2.350993
*/

var ground = new Gen(ground);
ground.generate();
ground.getDisjoint();

var plane = new Gen(plane);
plane.generate();
plane.getDisjoint();

let keyState = {};

window.addEventListener('keydown', function(event) {
  console.log("key", event.keyCode);
  keyState[event.keyCode] = true;
}, false);

window.addEventListener('keyup', function(event) {
  keyState[event.keyCode] = false;
}, false);


let scaleSensitivity = 0.01;
let moveSensitivity = 0.01;
let scale = 1.0;
let center = new BABYLON.Vector2(0.2, 0.1);
console.log("material", plane.mesh.material);
setInterval(() => {
    if(keyState[73])
        center.y += scale * moveSensitivity;
    if(keyState[75])
        center.y -= scale * moveSensitivity;
    if(keyState[74])
        center.x -= scale * moveSensitivity;
    if(keyState[76])
        center.x += scale * moveSensitivity;
    if(keyState[85])
        scale += scale * scaleSensitivity;
    if(keyState[79])
        scale -= scale * scaleSensitivity;
   plane.mesh.material.setFloat("scale", scale);
   plane.mesh.material.setVector2("center", center);
}, 50);

console.log("enabling web midi");
WebMidi.enable(function (err) {

  if (err) {
    console.log("WebMidi could not be enabled.", err);
  } else {
    console.log("WebMidi enabled!");
    console.log(WebMidi.inputs);
    console.log(WebMidi.outputs);
    var input = WebMidi.inputs[1];

    // Listen for a 'note on' message on all channels
    input.addListener('noteon', "all",
      function (e) {
        console.log("Received 'noteon' message (" + e.note.name + e.note.octave + ").");
      }
    );

    // Listen to pitch bend message on channel 3
    input.addListener('pitchbend', 3,
      function (e) {
        console.log("Received 'pitchbend' message.", e);
      }
    );

  // Listen to control change message on all channels
  input.addListener('controlchange', "all",
    function (e) {
      console.log("Received 'controlchange' message.", e);
    }
  );
  }
  
}, false);
