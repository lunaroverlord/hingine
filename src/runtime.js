console.log("Hingine v0.000001");

import Renderer from "./renderer.js";
const renderer = new Renderer();
renderer.install();

import Hingine from "./hingine.js";
const { Gen } = Hingine(renderer.scene);

import * as realms from "./realms.js";

export { Gen, Hingine, Renderer, realms };
