

var ground = new Gen(ground);
ground.generate();
ground.getDisjoint();

var plane = new Gen(plane);
plane.generate();
plane.getDisjoint();

plane.mesh.material.setFloat("scale", 1.0/20.0);

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
