// Get the DOM element to attach to
const container =
    document.querySelector('#container');

BABYLON.DebugLayer.InspectorURL = 'babylon.inspector.bundle.js';
BABYLON.Tools.getClassName = BABYLON.Tools.GetClassName;

var engine = new BABYLON.Engine(container, true);

  // This begins the creation of a function that we will 'call' just after it's built
var createScene = function () 
{
    // Now create a basic Babylon Scene object 
    var scene = new BABYLON.Scene(engine);

    // Change the scene background color to green.
    scene.clearColor = new BABYLON.Color3(0, 1, 0);

    // This creates and positions a free camera
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(-40, 50, -50), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(container, false);

    camera.keysUp = [0x57]; //w
    camera.keysDown = [0x53]; //s
    camera.keysLeft = [0x41]; //a
    camera.keysRight = [0x44]; //d

    // This creates a light, aiming 0,1,0 - to the sky.
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // Dim the light a small amount
    light.intensity = .5;

    // Let's try our built-in 'sphere' shape. Params: name, subdivisions, size, scene
    //var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);

    // Move the sphere upward 1/2 its height
    //sphere.position.y = 1;

    // Let's try our built-in 'ground' shape.  Params: name, width, depth, subdivisions, scene
    //var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);

    // Leave this function
    return scene;

};  // End of createScene function



scene = createScene();

//scene.debugLayer.show();

var gravityVector = new BABYLON.Vector3(0,-9.81, 0);
var physicsPlugin = new BABYLON.OimoJSPlugin(100);
//var physicsPlugin = new BABYLON.CannonJSPlugin();
scene.enablePhysics(gravityVector, physicsPlugin);


engine.runRenderLoop(function () {
    scene.render();
});

window.addEventListener("resize", function () {
    engine.resize();
});
