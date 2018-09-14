import * as BABYLON from 'babylonjs';
const Vector3 = BABYLON.Vector3;

export const RECT = [
  new Vector3(0, 0, 0),
  new Vector3(0, 1, 0),
  new Vector3(1, 1, 0),
  new Vector3(1, 0, 0)
];

export const GROUND = [
  new Vector3(-100,-51, -100),
  new Vector3(-100,-50, -100),
  new Vector3(-100, -50,100),
  new Vector3(-100, -51,100)
]

export const PLANE = [new Vector3(-10, 0, 0), new Vector3(10, 0, 0)];
