import { Gen, Shader, realms, renderer } from "./runtime.js";
import { Contour } from "./contour.js";
import { PLANE, GROUND } from "./shapes.js";
import { Vector3 } from "babylonjs";

//var cycler = new Gen(realms.cycler);



class Cycler
{
  constructor(scene) {
    this.scene = scene;
    this.cycleCount = 0;

    this.rtt = new BABYLON.RenderTargetTexture('rtt', 1024, scene, true);
    this.rtt2 = new BABYLON.RenderTargetTexture('rtt2', 1024, scene, true);
    this.rtt.renderList = null;
    this.rtt2.renderList = null;


    this.strangeLoop = new BABYLON.FreeCamera("strangeLoop", new BABYLON.Vector3(0, 11.0, 0), scene);
    this.strangeLoop.minZ = 0;
    this.reset();
    this.strangeLoop.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
    this.strangeLoop.orthoTop = 10;
    this.strangeLoop.orthoBottom = -10;
    this.strangeLoop.orthoLeft = -10;
    this.strangeLoop.orthoRight = 10;

    this.rtt.activeCamera = this.strangeLoop;
    this.rtt2.activeCamera = this.strangeLoop;

    /*
    rtt.renderList.push(sphere);
    rtt.activeCamera = cameraStudio;
    */


    //scene.customRenderTargets.push(this.rtt);
    const texture = new BABYLON.Texture("assets/brickwork.jpg", scene);
    this.shader = new Shader("texture", { textureSampler: texture } );
    //this.material = new BABYLON.StandardMaterial("cycler mat", this.scene);
    this.material = this.shader.material;
    //this.rtt.render(true);
  }

  getMaterial = () => {
    //return this.shader.material;
    //this.material.emissiveTexture = this.rtt;
    //this.material.disableLighting = true;
    return this.material;
  }

  cycle = () => {
    //this.rtt._engine.unBindFramebuffer(this.rtt);
    if(this.cycleCount % 2 == 0)
    {
      this.rtt.render(true);
      this.shader.material.setTexture("textureSampler", this.rtt);
    }
    else
    {
      this.rtt2.render(true);
      this.shader.material.setTexture("textureSampler", this.rtt2);
    }

    this.cycleCount++;
  }

  reset = () => {
    this.strangeLoop.setTarget(new BABYLON.Vector3(0, 0, 0));
    this.strangeLoop.rotation.y=Math.PI*2;
  }
  
  move = (target) => {
    this.strangeLoop.setTarget(target);
    this.strangeLoop.rotation.y=Math.PI*2;
  }

  rotateY = (y) => {
    this.strangeLoop.rotation.x += y;
  }
  rotateZ = (z) => {
    this.strangeLoop.rotation.z += z;
  }

}

const cyclerController = new Cycler(renderer.scene);

let cycler = {
  contour: new Contour(PLANE, new Vector3(0, 0, 1)),
  texture: "manta.jpg",
  cycler: cyclerController,
  distance: 20,
  steps: 1,
  mass: 0,
  tag: "plane"
}
cycler = new Gen(cycler);
cycler.generate();
cycler.getDisjoint();


//key state boilerplate
let keyState = {};

window.addEventListener('keydown', function(event) {
  console.log("key", event.keyCode);
  keyState[event.keyCode] = true;
}, false);

window.addEventListener('keyup', function(event) {
  keyState[event.keyCode] = false;
  cyclerController.reset();
}, false);

//logic
setTimeout(() => {
  setInterval(() => { cyclerController.cycle(); }, 30);
  setInterval(() => {
      if(keyState[73]) //up
      {
          const target = cyclerController.strangeLoop.getTarget();
          target.x -= 0.01;
          cyclerController.move(target);
      }
      if(keyState[75]) //down
      {
          const target = cyclerController.strangeLoop.getTarget();
          target.x += 0.01;
          cyclerController.move(target);
      }
      if(keyState[74]) //left
      {
          cyclerController.rotateZ(0.01)
      }
      if(keyState[76]) //right
      {
          cyclerController.rotateZ(-0.01)
      }

      if(keyState[85])
      {
          cyclerController.rotateY(0.01)
      }
      if(keyState[79])
      {
          cyclerController.rotateY(-0.01)
      }


  }, 50);

}, 1000);
