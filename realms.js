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

var chain = {
  tag: "chain0",
  contour: new Contour(),
  steps: 2,
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

var plane = {
  contour: new Contour(PLANE, new Vector3(0, 0, 1)),
  texture: "brickwork.jpg",
  distance: 20,
  steps: 1,
  mass: 0,
  tag: "plane"
}

var ground = {
  contour: new Contour(GROUND),
  distance: -200,
  steps: 1,
  mass: 0,
  tag: "ground"
}
