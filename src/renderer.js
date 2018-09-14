// Get the DOM element to attach to
import * as BABYLON from 'babylonjs';


BABYLON.DebugLayer.InspectorURL = 'https://preview.babylonjs.com/inspector/babylon.inspector.bundle.js';
BABYLON.Tools.getClassName = BABYLON.Tools.GetClassName;

class Renderer
{
  constructor()
  {
    const container = document.querySelector('#container');
    this.engine = new BABYLON.Engine(container, true);
  }

  createScene = () =>
  {
      // Now create a basic Babylon Scene object 
      var scene = new BABYLON.Scene(this.engine);

      // Change the scene background color to green.
      scene.clearColor = new BABYLON.Color3(0.44, 0.44, 0.9);

      // This creates and positions a free camera
      var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(-40, 50, -50), scene);
      camera.minZ = 0;

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

      var rtt = new BABYLON.RenderTargetTexture('rtt', 1024, scene, true);
      //rtt.renderList.push(sphere);
      //rtt.activeCamera = cameraStudio;
      scene.customRenderTargets.push(rtt);


      //Physics
      var gravityVector = new BABYLON.Vector3(0,-9.81, 0);
      var physicsPlugin = new BABYLON.OimoJSPlugin(100);
      //var physicsPlugin = new BABYLON.CannonJSPlugin();
      scene.enablePhysics(gravityVector, physicsPlugin);
          
      return scene;

  };  // End of createScene function

  install = () => {
    this.scene = this.createScene();

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    window.addEventListener("resize", () => {
      this.engine.resize();
    });
  }

  showDebug = () => {
    this.scene.debugLayer.show();
  }
}

export default Renderer;

