import * as BABYLON from 'babylonjs';
import { RECT } from "./shapes.js";

export class Contour
{
  constructor(points=RECT, norm) //0, 0, 1=new Vector3(0, 0, 1)
  {
    this.points = points;
    console.log("constructing contour", points, norm);
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
