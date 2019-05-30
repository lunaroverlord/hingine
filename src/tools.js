    const outString = `
        position ${this.mesh.position} ,
        rotationQuaternion ${this.mesh.rotationQuaternion},
        scaling, ${this.mesh.scaling},
        rotation, ${this.mesh.rotation},
        parent, ${this.mesh.parent},
        getBoundingInfo(), ${JSON.stringify(this.mesh.getBoundingInfo())},
        computeWorldMatrix(), ${this.mesh.computeWorldMatrix()},
        getWorldMatrix?(), ${this.mesh.getWorldMatrix()},
        getChildMeshes(false), ${this.mesh.getChildMeshes()},
        getVerticesData(kind: string), ${this.mesh.getVerticesData()},
        getIndices(), ${this.mesh.getIndices()},
        getScene(), -=-
        getAbsolutePosition(), ${this.mesh.getAbsolutePosition()},
        getAbsolutePivotPoint(),${this.mesh.getAbsolutePivotPoint()},
      `;

const scrap = () => {
//realm.mesh
/*
var box = BABYLON.MeshBuilder.CreateBox("box", {height: 1, depth: 6, width: 1}, scene);
box.position.x = 4;
console.log("____box", box.position, box.rotationQuaternion);

    const outString = `
        position ${box.position},
        rotationQuaternion ${box.rotationQuaternion},
        scaling, ${box.scaling},
        rotation, ${box.rotation},
        parent, ${box.parent},
        getBoundingInfo(), ${JSON.stringify(box.getBoundingInfo())},
        computeWorldMatrix(), ${box.computeWorldMatrix()},
        getWorldMatrix?(), ${box.getWorldMatrix()},
        getChildMeshes(false), ${box.getChildMeshes()},
        getVerticesData(kind: string), ${box.getVerticesData()},
        getIndices(), ${box.getIndices()},
        getScene(), -=-
        getAbsolutePosition(), ${box.getAbsolutePosition()},
        getAbsolutePivotPoint(),${box.getAbsolutePivotPoint()},
      `;

    console.log(box.getBoundingInfo());
var boxImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.01 }, scene);

var box2 = BABYLON.MeshBuilder.CreateBox("box2", {height: 1, depth: 6, width: 1}, scene);
box2.position.x = 4;
var box2Impostor = new BABYLON.PhysicsImpostor(box2, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 10, restitution: 0.01 }, scene);

var box3 = BABYLON.MeshBuilder.CreateBox("box3", {height: 1, depth: 6, width: 1}, scene);
box3.position.x = 4;
var box3Impostor = new BABYLON.PhysicsImpostor(box3, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 10, restitution: 0.01 }, scene);

var box4 = BABYLON.MeshBuilder.CreateBox("box4", {height: 1, depth: 6, width: 1}, scene);
box3.position.x = 4;
var box4Impostor = new BABYLON.PhysicsImpostor(box4, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 10, restitution: 0.01 }, scene);

var box5 = BABYLON.MeshBuilder.CreateBox("box5", {height: 1, depth: 6, width: 1}, scene);
box3.position.x = 4;
var box5Impostor = new BABYLON.PhysicsImpostor(box5, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 10, restitution: 0.01 }, scene);

console.log("realm impostor", realm.impostor);
console.log("box imporsto", boxImpostor);
console.log("box2 imporsto", box2Impostor);
console.log("box3 imporsto", box3Impostor);
box2Impostor.createJoint(boxImpostor, BABYLON.PhysicsJoint.BallAndSocketJoint,  {
  mainPivot: new BABYLON.Vector3(0.0, 0, -3.0),
  connectedPivot: new BABYLON.Vector3(0.0, 0, 3.0),
});
box3Impostor.createJoint(box2Impostor, BABYLON.PhysicsJoint.BallAndSocketJoint, {
  mainPivot: new BABYLON.Vector3(0.0, 0, -3.0),
  connectedPivot: new BABYLON.Vector3(0.0, 0, 3.0),
});
box4Impostor.createJoint(box3Impostor, BABYLON.PhysicsJoint.BallAndSocketJoint, {
  mainPivot: new BABYLON.Vector3(0.0, 0, -3.0),
  connectedPivot: new BABYLON.Vector3(0.0, 0, 3.0),
});
box5Impostor.createJoint(box4Impostor, BABYLON.PhysicsJoint.BallAndSocketJoint, {
  mainPivot: new BABYLON.Vector3(0.0, 0, -3.0),
  connectedPivot: new BABYLON.Vector3(0.0, 0, 3.0),
});
*/
//TODO: nativeparams
/*
var box = BABYLON.MeshBuilder.CreateBox("", {}, scene);
    this.impostor = new BABYLON.PhysicsImpostor(this.mesh, BABYLON.PhysicsImpostor.MeshImpostor, { mass, restitution: 0.01 }, scene);
    */
}
