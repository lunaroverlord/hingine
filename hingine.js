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
      const sign = Math.sign(endIndex - startIndex);
      let firstVertices = [];
      let nextVertices = [];

      for(var i = startIndex; i != endIndex; i = ((i + 1) % length))
      {
        firstVertices.push(gen.segments[segment].points[i]);
        nextVertices.unshift(gen.segments[segment + 1].points[i]);
      }

      const vertices = firstVertices.concat(nextVertices); ///? reverse
      return new Contour(vertices);
    }

  }
  
  getOrigin() {
    return this.points[0];
  }

  extrude()
  {
    const vertices = new Contour(this.points.map(p => p.add(this.norm)), this.norm);
    return vertices;
  }
}

class Gen
{
  constructor(spec)
  {
    this.spec = spec;
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

  generate(parent=null, depth=0)
  {
    this.parent = parent;
    let { spec } = this;

    if(spec.type === "self")
    {
      if(depth >= spec.depth)
        return;

      let up = spec.up || 0;
      let root = parent;
      while(up > 0)
      {
        root = root.parent;
        up--;
      }
      // Default - end
      if(!root.spec.contour.type)
        root.spec.contour = {type: "PARENT_END"};
      this.spec = spec = root.spec;
    }

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
    }
    return this;
  }

  render()
  {
    let vertices = [];
    let indices = [];
    let uvs = [];

    //todo: joint per segment
    const length = this.start.points.length;
    for(let y = 0; y < this.segments.length; y++)
    {
      let contour = this.segments[y];
      vertices = vertices.concat(contour.points);
      const base = y * length;
      if(y < this.segments.length - 1)
      for(let i = 0; i < length; i++)
      {
        const around = (i + 1) % length;
        /* Alternative triangulation:
        indices.push(base + i);
        indices.push(base + length + i);
        indices.push(base + length + around);
        indices.push(base + around);
        indices.push(base + i);
        indices.push(base + length + around);
        */
        indices.push(base + i);
        indices.push(base + length + i);
        indices.push(base + around);
        indices.push(base + around);
        indices.push(base + length + i);
        indices.push(base + length + around);
      }
      uvs = uvs.concat([0, 0, 1, 0, 0, 0, 1, 0]);
      uvs = uvs.concat([0, 1, 1, 1, 0, 1, 1, 1]);
    }
    return { vertices, indices, uvs };
  }

  static makeBabylonMesh({vertices, indices, uvs})
  {
  }

  // Deprecated (need to concat uvs)
  getSingular()
  {
    let { vertices, indices, uvs } = this.render();
    if(this.children)
    {
      const childMeshes = this.children.map(child => child.getSingular())
      childMeshes.forEach((mesh, index) => {
        indices = indices.concat(mesh.indices.map(indice => indice + vertices.length));
        vertices = vertices.concat(mesh.vertices);
      });
    }
    return { vertices, indices, uvs };
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
      this.mesh.material = material;
    }

    const mass = physics ? (this.spec.mass || 0) : 0;

    this.impostor = new BABYLON.PhysicsImpostor(this.mesh, BABYLON.PhysicsImpostor.MeshImpostor, 
      { mass , restitution: 0.001, ignoreParent: true }, scene);

    if(this.children)
    {
      const childMeshes = this.children.map(child => {
        const childMesh = child.getDisjoint(origin.add(this.relativeOrigin));
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

  createMeshVertexData(meshData, texture)
  {
    var vertexData = new BABYLON.VertexData();
    vertexData.positions = [].concat.apply([], meshData.vertices.map(vertex => [vertex.x, vertex.y, vertex.z]));
    vertexData.indices = meshData.indices;    
    vertexData.uvs = meshData.uvs;

    let normals = [];
    BABYLON.VertexData.ComputeNormals(vertexData.positions, vertexData.indices, normals);
    vertexData.normals = normals;
    BABYLON.VertexData._ComputeSides(BABYLON.Mesh.DOUBLESIDE, vertexData.positions, vertexData.indices, vertexData.normals, []);
    return vertexData;
  }
}
