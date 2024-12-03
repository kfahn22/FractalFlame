let flameImg;
let current;
let variations = [];
let numBuffers = 4; // Number of buffers
let buffers = [];
let total = 10000000;
let perFrame = 200000;
let count = 0;
let numVar = 4;
let palette; // Color palette array
let colorIndexArray; // Stores palette indices
let url =
  "https://supercolorpalette.com/?scp=G0-hsl-000000-1E012D-100458-083381-0F92A9-17CF8E-31E34B-8CE55D";

function setup() {
  createCanvas(400, 400);
  //createCanvas(680, 480);
  pixelDensity(1);

  palette = generatePaletteArray(url); // Generate palette
  colorIndexArray = Array.from({ length: height }, () =>
    new Array(width).fill(0)
  );

  // I am working on adding additional variations, only Astroid is working at this point
  variationOptions = [
    new Astroid(), // rendering
    // new Bicorn(),
    // new Butterfly(),
    // new CassiniOval(),
    // new Clover(),
    // new Craniod(),
    // new Deltoid(),
    new Diamond(),
    new Disc(),
    //new Eight(),
    new Fisheye(),
    // new Flower(),
    // new Gear(),
    new Hankerchief(),
    new Heart(),
    new HorseShoe(),
    new Hyperbolic(),
    //new Kiss(),
    new Linear(1),
    new PJF(2),
    new Polar(),
    //new Quadrilateral(5),
    new Sinusoidal(),
    new Spherical(),
    new Spiral(),
    new Swirl(),
  ];

  let weights = getVariationsWeights(numVar);
  getRandomVariations(variations, numVar, variationOptions, weights);

  //variations = sphericalOption(variations);

  // Initialize variations
  variations = [];
  //variations.push(new Spherical());
  variations.push(new Gear());
  variations.push(new Gear());
  variations.push(new Gear());
  variations.push(new Gear());
  

  transformVariations(variations, weights);

  // Initialize buffers
  let segmentHeight = Math.ceil(height / numBuffers);
  for (let i = 0; i < numBuffers; i++) {
    buffers.push({
      values: new Float32Array(width * segmentHeight), // Store values for coloring
      maxVal: 0, // Local max value
      yStart: i * segmentHeight,
      yEnd: Math.min((i + 1) * segmentHeight, height),
    });
  }

  // Starting point for the fractal transformation
  current = createVector(random(-1, 1), random(-1, 1), random(0, 1));
}

function draw() {
  clear();

  for (let buffer of buffers) {
    processBuffer(buffer);
  }

  let globalMaxVal = computeGlobalMax(buffers);

  // Map values to color indices
  for (let buffer of buffers) {
    let { values, yStart, yEnd } = buffer;
    for (let y = yStart; y < yEnd; y++) {
      for (let x = 0; x < width; x++) {
        let idx = x + (y - yStart) * width;
        let value = values[idx];

        let normVal = globalMaxVal > 0 ? Math.log10(value) / globalMaxVal : 0;
        let index = ceil((normVal * 10) % palette.length);
        if (index > 0 && index < palette.length - 1) {
          colorIndexArray[y][x] = index;
        }
        //colorFlame(x, y);
      }
    }
  }

  for (let y = 0; y < height-2; y+=2) {
    for (let x = 0; x < width-2; x+=2) {
      colorFlame(x, y);
    }
  }

  filter(BLUR, 1.5);

  count += perFrame;
  if (count >= total) {
    noLoop();
  }
}

function colorFlame(i, j) {
  let index = colorIndexArray[i][j];
  // let c = palette[index];
  // c[3] = 180;
  stroke(palette[index]);
  //vertex(i, j)
  circle(i, j, 2);
}

function processBuffer(buffer) {
  let { values, yStart, yEnd } = buffer;

  for (let i = 0; i < perFrame / numBuffers; i++) {
    let index = int(random(variations.length));
    let variation = variations[index];
    let previous = current.copy();

    current = variation.flame(current);

    if (!isFinite(current.x) || !isFinite(current.y)) {
      current = previous.copy();
    }

    let zoom = 0.5;
    let x = current.x * width * zoom;
    let y = -current.y * height * zoom;

    let px = int(x + width / 2);
    let py = int(y + height / 2);

    if (px >= 0 && px < width && py >= yStart && py < yEnd) {
      let localY = py - yStart;
      let idx = px + localY * width;

      values[idx]++;
    }
  }
}

function computeGlobalMax(buffers) {
  let globalMax = 0;
  for (let buffer of buffers) {
    let { values } = buffer;
    for (let i = 0; i < values.length; i++) {
      globalMax = Math.max(globalMax, values[i]);
    }
  }
  return Math.log10(globalMax);
}

// Palette generation functions
function extractHexCodes(url) {
  let startIndex = url.indexOf("=");
  let hexPart = url.substring(startIndex + 1);
  let parts = hexPart.split("-");
  return parts.filter((part) => /^[0-9A-Fa-f]{6}$/.test(part));
}

function hexToColor(hex) {
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  return color(r, g, b);
}

function generatePaletteArray(url) {
  let hexCodes = extractHexCodes(url);
  return hexCodes.map((hex) => hexToColor(hex));
}

function sphericalOption(variations) {
  let s1 = new Spherical().setColor(1);
  s1.setTransform([
    -0.681206, -0.0779465, 0.20769, 0.755065, -0.0416126, -0.262334,
  ]);
  let s2 = new Spherical().setColor(0.66);
  s2.setTransform([
    0.953766, 0.48396, 0.43268, -0.0542476, 0.642503, -0.995898,
  ]);
  let s3 = new Spherical().setColor(0.33);
  s3.setTransform([
    0.840613, -0.816191, 0.318971, -0.430402, 0.905589, 0.909402,
  ]);
  let s4 = new Spherical().setColor(0);
  s4.setTransform([
    0.960492, -0.466555, 0.215383, -0.727377, -0.126074, 0.253509,
  ]);
  // variations.push(s1, s2, s3, s4);
  variations.push(s1, s2, s3);
  return variations;
}

// Functions from https://github.com/brzzznko/FractalFlames/blob/main/js/main.js
function getRandomVariations(variations, n, variationOptions, weights) {
  for (let j = 0; j < n; j++) {
    let i = int(random(variationOptions.length));
    let v = variationOptions[i];
    let w = weights[j];
    v.setColor(w);
    let coeff = Array(6)
      .fill()
      .map(() => random(-1, 1));
    v.setTransform(coeff);
    variations.push(v);
  }
  return variations;
}

// Functions from https://github.com/brzzznko/FractalFlames/blob/main/js/main.js
function getRandomVariations(variations, n, variationOptions, weights) {
  for (let j = 0; j < n; j++) {
    let i = int(random(variationOptions.length));
    let v = variationOptions[i];
    let w = weights[j];
    v.setColor(w);
    let coeff = Array(6)
      .fill()
      .map(() => random(-1, 1));
    v.setTransform(coeff);
    variations.push(v);
  }
  return variations;
}

function transformVariations(variations, weights) {
  for (let i = 0; i < variations.length; i++) {
    let v = variations[i];
    let w = weights[i];
    v.setColor(w);
    let coeff = Array(6)
      .fill()
      .map(() => random(-1, 1));
    v.setTransform(coeff);
  }
  return variations;
}

function getVariationsWeights(variationsCount) {
  if (variationsCount < 2) return [1];

  let weights = [];
  for (let i = 0; i < variationsCount; i++) {
    weights.push(0);
  }

  let totalSum = 0;
  let increment = 0.015;

  while (totalSum < 1) {
    weights[int(random(0, variationsCount - 1))] += increment;
    totalSum += increment;
  }

  //console.log("weights: " + weights);
  return weights;
}
