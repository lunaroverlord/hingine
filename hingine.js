//Redefine the way 3D worlds are created
//Realm3D
//file:///home/olafs/code/realm3d/index.html

const physics = true;

const Vector3 = BABYLON.Vector3;

const flatten = list => list.reduce(
    (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);

const RECT = [
  new Vector3(0, 0, 0),
  new Vector3(0, 1, 0),
  new Vector3(1, 1, 0),
  new Vector3(1, 0, 0)
];

const GROUND = [
  new Vector3(-100,-501, -100),
  new Vector3(-100,-500, -100),
  new Vector3(-100, -500,100),
  new Vector3(-100, -501,100)
]

class Contour
{
  constructor(points=RECT, norm) //0, 0, 1=new Vector3(0, 0, 1)
  {
    this.points = points;
    if(!norm)
      this.norm = this.calculateNorm(points);
    else
      this.norm = norm;
  }

  copy()
  {
    return new Contour(this.points, this.norm);
  }

  calculateNorm(points)
  {
    const v1 = points[1].subtract(points[0]);
    const v2 = points[2].subtract(points[1]);
    return BABYLON.Vector3.Cross(v2, v1).normalize();
  }

  centroid()
  {
    let centroid = new BABYLON.Vector3(0, 0, 0);
    this.points.forEach(point => {
      centroid.addInPlace(point);
    });
    centroid = centroid.scale(1.0/this.points.length);
    return centroid;
  }

  static derive(gen, contourSpec)
  {
    if(!contourSpec || contourSpec.type == "PARENT_END")
      return gen.end;
    if(contourSpec.type == "PARENT_SIDE")
    {
      //todo: var
      const length = gen.start.points.length; 
      const n = contourSpec.n;
      const segment = contourSpec.segment;
      const startIndex = n;
      const endIndex = (n + 2) % length; //todo: make work with all-size contours
      /*
      const lowerIndex = Math.min(startIndex, endIndex);
      const upperIndex = Math.max(startIndex, endIndex);
      */
      const sign = Math.sign(endIndex - startIndex);
      let firstVertices = [];
      let nextVertices = [];
      for(var i = startIndex; i != endIndex; i = ((i + 1) % length))
      {
        firstVertices.push(gen.segments[segment].points[i]);
        nextVertices.unshift(gen.segments[segment + 1].points[i]);
      }

      //const firstVertices = gen.segments[segment].points.slice(startIndex, endIndex);
      //const nextVertices = gen.segments[segment + 1].points.slice(startIndex, endIndex).reverse();
      const vertices = firstVertices.concat(nextVertices); ///? reverse
      return new Contour(vertices);
    }

  }
  
  getOrigin() {
    return this.points[0];
  }

  extrude()
  {
    //mirror past indices
    //relative
    const indices = [
      -1, 1, -2, 
      -2, 1, 2,
      -2, 2, 3,
      -2, 3, -3,
      -3, 3, 4,
      -3, 4, -4,
      -4, 4, -1,
      -1, 4, 1
    ]
    const vertices = new Contour(this.points.map(p => p.add(this.norm)), this.norm);
    return vertices;
    //mesh
  }
}

class Gen
{
  constructor(spec)
  {
    this.spec = spec;
  }

  resolve(parent=null)
  {
    return null;
  }

  multiply(vector, scalar)
  {
    return new Vector3(vector.x * scalar, vector.y * scalar, vector.z * scalar);
  }

  transform(step)
  {
    const { spec } = this;
    const normLength = spec.distance / spec.steps * step;
    let contour = this.start.copy();
    contour.norm = this.multiply(contour.norm.normalize(), normLength);
    contour = contour.extrude(); //transform here
    return contour;
  }

  selfRecurse()
  {
  }

  generate(parent=null, depth=0)
  {
    this.parent = parent;
    let { spec } = this;

    if(spec.type === "self")
    {
      if(depth >= spec.depth)
        return;

      let up = spec.up || 0; //up = up?
      let root = parent;
      while(up > 0)
      {
        root = root.parent;
        up--;
      }
      //if(spec.contour)
      if(!root.spec.contour.type)
        root.spec.contour = {type: "PARENT_END"};
      this.spec = spec = root.spec;
    }
    //spaec.contour ContourMaker parent
    this.start = spec.contour instanceof Contour ? spec.contour : Contour.derive(parent, spec.contour);
    this.relativeOrigin = this.start.getOrigin();
    this.start.points = this.start.points.map(p => p.subtract(this.relativeOrigin));
    this.end = this.transform(spec.steps);
    this.centroid = this.start.centroid().add((this.end.centroid().subtract(this.start.centroid()).scale(0.5)));

    let segments = [];
    for(let i = 0; i <= spec.steps; i++)
    {
      segments.push(this.transform(i));
    }
    this.segments = segments;

    if(spec.gen instanceof Array) //gen is list
    {
      this.children = spec.gen.map(gen => new Gen(gen).generate(this, depth + 1)).filter(x => x);
      //const rest = new Gen(spec.gen); //list - many gens in spec
      //const next = rest.generate(this); //list? - gen produces many gens? -- this
      //*** stitch rest up with current using its contour selectors
      //
      // (c   c) rest:  c   c       c   c 
    }
    else if(spec.gen instanceof Object)
    {
      if(spec.gen.type == "elf")
      {

      }
    }
    else
    {
      //just vertices
    }
    return this;
    /*
    */
     
  }

  render()
  {
    let vertices = [];//this.start.points.concat(this.end.points);
    let indices = [];
    let uvs = [];
    const length = this.start.points.length;
    console.log("rendering, segments", this.segments.length);
    for(let y = 0; y < this.segments.length; y++)
    {
      let contour = this.segments[y];
      vertices = vertices.concat(contour.points);
      const base = y * length;
      if(y < this.segments.length - 1)
      for(let i = 0; i < length; i++)
      {
        const around = (i + 1) % length;
        indices.push(base + i);
        indices.push(base + length + i);
        indices.push(base + length + around);

        indices.push(base + around);
        indices.push(base + i);
        indices.push(base + length + around);
        /*
        indices.push(base + i);
        indices.push(base + length + i);
        indices.push(base + around);
        indices.push(base + around);
        indices.push(base + length + i);
        indices.push(base + length + around);
        */

        console.log("step i ", i);
      }
      console.log("step y ", y);
      uvs = uvs.concat([0, 0, 1, 0, 0, 0, 1, 0]);
      uvs = uvs.concat([0, 1, 1, 1, 0, 1, 1, 1]);
    }
    //console.log("wo", vertices[0], this.relativeOrigin, vertices[0].subtract(this.relativeOrigin));
    return { vertices, indices, uvs };
  }

  get()
  {
    let {vertices, indices} = this.render();
    if(this.children)
    {
      //console.log("get: before", this.children);
      const childMeshes = this.children.map(child => child.get())
      childMeshes.forEach((mesh, index) => {
        indices = indices.concat(mesh.indices.map(indice => indice + vertices.length));
        vertices = vertices.concat(mesh.vertices);
      });
      //console.log("get: getting", childMeshes);
      //console.log("get: on top of vertices", vertices, indices);
      //todo: join
    }
    //else console.log("get: no children");
    return {vertices, indices};
  }

  getStartCentroid() {
    return this.start.points[0];
  }

  getEndCentroid() {
    return this.end.points[0];
  }
  
  getDisjoint(origin = new BABYLON.Vector3(0, 0, 0))
  {
    this.origin = origin;
    this.mesh = new BABYLON.Mesh("custom", scene);
    this.mesh.sideOrientation = BABYLON.Mesh.DOUBLESIDE;
    const meshData = this.render();
    const vertexData = this.createMeshVertexData(meshData, this.spec.texture);
    vertexData.applyToMesh(this.mesh);
    this.mesh.translate(this.relativeOrigin.add(origin), 1, BABYLON.Space.WORLD);

    if(this.spec.texture)
    {
      var material = new BABYLON.ShaderMaterial("mandelbrot", scene, "./mandelbrot",
          {
              attributes: ["position", "normal", "uv"],
              uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"]
          }
      );


      //var material = new BABYLON.StandardMaterial("customMaterial", scene);

      //material.diffuseTexture = new BABYLON.Texture(this.spec.texture, scene);

      this.mesh.material = material;
    }

    const mass = physics ? (this.spec.mass || 0) : 0;
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

    this.impostor = new BABYLON.PhysicsImpostor(this.mesh, BABYLON.PhysicsImpostor.MeshImpostor, 
      { mass , restitution: 0.001, ignoreParent: true }, scene);
    if(this.children)
    {
      const childMeshes = this.children.map(child => {
        const childMesh = child.getDisjoint(origin.add(this.relativeOrigin));
        //childMesh.parent = this.mesh;
        const mainPivot = this.centroid.subtract(child.start.centroid());
        const connectedPivot = child.start.centroid().subtract(child.centroid);
        const pivotDetails = {
          mainPivot,
          connectedPivot,
          nativeParams: { maxForce: 100 }, //TODO: use this
          collision: false,// mainAxis: BABYLON.Axis.Z, connectedAxis: BABYLON.Axis.Z,
        }
        if(child.spec.joint)
        {
          this.impostor.createJoint(child.impostor, BABYLON.PhysicsJoint.BallAndSocketJoint, pivotDetails);

        }

        return childMesh;
      });
    }
    return this.mesh;
  }

  collectDisjointMeshes()
  {
    //this.mesh must be generated
    let meshes = [this.mesh];
    if(this.children)
    {
      const childMeshes = this.children.map(child => child.collectDisjointMeshes());
      meshes = meshes.concat(flatten(childMeshes));
    }
    return meshes;
  }

  createMeshVertexData(meshData, texture)
  {
    var vertexData = new BABYLON.VertexData();
    vertexData.positions = [].concat.apply([], meshData.vertices.map(vertex => [vertex.x, vertex.y, vertex.z]));
    vertexData.indices = meshData.indices;    
    if(texture)
    {
    console.log("uvs", meshData);
       vertexData.uvs = meshData.uvs;
    }

    let normals = [];
    BABYLON.VertexData.ComputeNormals(vertexData.positions, vertexData.indices, normals);
    vertexData.normals = normals;
    BABYLON.VertexData._ComputeSides(BABYLON.Mesh.DOUBLESIDE, vertexData.positions, vertexData.indices, vertexData.normals, []);
    return vertexData;
  }

  createMesh()
  {
    const mesh = new BABYLON.Mesh("custom", scene);
    mesh.sideOrientation = BABYLON.Mesh.DOUBLESIDE;
    const meshData = this.get();

    const vertexData = this.createMeshVertexData(meshData);
    vertexData.applyToMesh(mesh);
  }

  makeSingularMesh(scene)
  {
    const mesh = new BABYLON.Mesh("custom", scene);
    mesh.sideOrientation = BABYLON.Mesh.DOUBLESIDE;
    const meshData = this.get();

    const vertexData = this.createMeshVertexData(meshData);
    vertexData.applyToMesh(mesh);
  }

}

//when building, convert this object to the mesh representation, add contours etc
var flake = {
  contour: new Contour(),
  steps: 3,
  //transform:  progress => tween (for each of n contours...)
  //n contours produced
  //distance vs steps:
  distance: 5,
  gen: [{
    contour: {type: "PARENT_END"},
    distance: 10,
    steps: 10,
    mass: 1,
    joint: true,
    gen: [{
      contour: {type: "PARENT_SIDE", n: 1, segment: 3},
      distance: 2,
      steps: 2,
      mass: 1,
      joint: true,
      gen: [{
        type: "self",
        up: 1,
        depth: 10
      }]
    },
      {
      contour: {type: "PARENT_SIDE", n: 2, segment: 5},
      distance: 2,
      steps: 2,
      mass: 1,
      joint: true,
      gen: [{
        type: "self",
        up: 1,
        depth: 40
      }]
    }]
  }]
};

var architecture = {
  contour: new Contour(),
  steps: 5,
  tag: "room base",
  //transform:  progress => tween (for each of n contours...)
  //n contours produced
  //distance vs steps:
  distance: 5,
  gen: [
    {
      contour: {type: "PARENT_SIDE", n: 1, segment: 2},
      distance: 6,
      steps: 3,
      gen: [
        {
          type: "self",
          up: 1,
          depth: 14
        }
      ]
    },
    {
      contour: {type: "PARENT_SIDE", n: 1, segment: 0},
      distance: 5,
      steps: 3,
      gen: [{
        type: "self",
        up: 1,
        depth: 19
      }]
    }
  ]
};

var darknet = {
  contour: new Contour(),
  steps: 5,
  tag: "room base",
  //transform:  progress => tween (for each of n contours...)
  //n contours produced
  //distance vs steps:
  distance: 6,
  gen: [
    {
      contour: {type: "PARENT_SIDE", n: 3, segment: 2},
      distance: 6,
      steps: 1,
      mass: 10,
      joint: true,
      gen: [
        {
          type: "self",
          up: 1,
          depth: 14
        }
      ]
    },
    {
      contour: {type: "PARENT_SIDE", n: 2, segment: 0},
      distance: 6,
      steps: 1,
      mass: 10,
      joint: true,
      gen: [{
        type: "self",
        up: 1,
        depth: 15
      }]
    }
  ]
};

var construct = {
  contour: new Contour(),
  steps: 1,
  mass: 0,
  tag: "room base",
  //transform:  progress => tween (for each of n contours...)
  //n contours produced
  //distance vs steps:
  distance: 5,
  joint: true,
  gen: [
    {
      contour: {type: "PARENT_END"},
      distance: 15,
      steps: 1,
      mass: 1,
      joint: true,
      gen: [
        {
          contour: {type: "PARENT_END"},
          distance: 15,
          steps: 1,
          mass: 1,
          joint: true,
        }
      ]
    },
  ]
};

var room = {
  tag: "chain0",
  contour: new Contour(),
  steps: 1,
  mass: 0,
  distance: 6,
  texture: "brickwork.jpg",
  gen: [
    {
      tag: "chain1",
      contour: {type: "PARENT_END"},
      distance: 6,
      steps: 1,
      mass: 1,
      joint: true,
      gen: [
        {
          tag: "chain2",
          contour: {type: "PARENT_END"},
          distance: 6,
          steps: 1,
          mass: 1,
          joint: true,
          gen: [
            {
              tag: "chain3",
              contour: {type: "PARENT_END"},
              distance: 6,
              steps: 1,
              mass: 1,
              joint: true,
            },
            {
                tag: "flag",
                contour: {type: "PARENT_SIDE", n: 0, segment: 0},
                texture: "brickwork.jpg",
                distance: 6,
                steps: 1,
                mass: 10,
                joint: true,
              /*
                gen: [{
                  type: "self",
                  up: 3,
                  depth: 20
                }]
                */
            }
          ]
        }
      ]
    }
  ]
}

var ground = {
  contour: new Contour(GROUND),
  distance: -200,
  steps: 1,
  mass: 0,
  tag: "ground"
}
var ground = new Gen(ground);
ground.generate();
ground.getDisjoint();

var realm = new Gen(room)
realm.generate();
realm.getDisjoint();
 console.log(realm);

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
//realm.collectDisjointMeshes();

//const meshData = realm.get();

//realm.makeMeshes(scene);


