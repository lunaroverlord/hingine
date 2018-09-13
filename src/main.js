console.log("Hingine v0.000001");
import { scene } from "./renderer.js";
import { Gen } from "./hingine.js";
Gen.scene = scene;
import * as realms from "./realms.js";
/*
xxx
*/

var ground = new Gen(realms.ground);
ground.generate();
ground.getDisjoint();

var plane = new Gen(realms.plane);
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
