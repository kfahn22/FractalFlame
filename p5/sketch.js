
let flameImg;
let current;
let variations = [];

// Increasing number of buffers improves rendering speed, but only marginally
let numBuffers = 2; // Number of buffers
let buffers = [];

// Number of iterations / draw cycle is adjusted in processBuffer(). A higher number perFrame will slow sketch down, but it will reach total faster
let total = 10000000;
let perFrame = 200000;
let count = 0;
let numVar = 4; // number of variations
let c1, c2;

const options = [
  "Diamond",
  "Disc",
  "Fisheye",
  "Handkerchief",
  "Heart",
  "Horseshoe",
  "Hyperbolic",
  "Linear",
  "PJF()",
  "Polar",
  "Sinusoidal",
  "Spherical",
  "Spiral",
  "Swirl",
];

let palette = [
  [90, 169, 230],
  [98, 71, 170],
  [244, 91, 105],
  [255, 228, 94],
  [255, 99, 146],
];

function setup() {
  createCanvas(640, 480);
  pixelDensity(1);

  variationOptions = [
    new Diamond(),
    new Disc(),
    new Fisheye(),
    new Hankerchief(),
    new Heart(),
    new HorseShoe(),
    new Hyperbolic(),
    new Linear(1),
    new PJF(2),
    new Polar(),
    new Sinusoidal(),
    new Spherical(),
    new Spiral(),
    new Swirl(),
  ];

  // Pick two colors
  c1 = randomColor();
  c2 = randomColor();
  while (c1 === c2) {
    c2 = randomColor();
  }

  variations = sphericalOption(variations);

  // Initialize buffers
  let segmentHeight = Math.ceil(height / numBuffers);
  for (let i = 0; i < numBuffers; i++) {
    buffers.push({
      pixies: new Float32Array(width * segmentHeight * 4), // [r, g, b, value]
      maxVal: 0, // Local maximum value for the buffer
      yStart: i * segmentHeight,
      yEnd: Math.min((i + 1) * segmentHeight, height),
    });
  }

  flameImg = createImage(width, height);

  // Starting point for flame transformation
  current = createVector(random(-1, 1), random(-1, 1), random(0, 1));
}

function addBuffer(w, h, i, segmentHeight) {
  let buffer = createGraphics(w, h);
  let pixies = new Float32Array(width * segmentHeight * 4); // [r, g, b, value]
  let yStart = i * segmentHeight;
  let yEnd = Math.min(i * segmentHeight, height);

  graphics.push({
    buffer: buffer,
    x: 0,
    y: 0,
    w: w,
    h: h,
    pixies: pixies,
    maxVal: 0,
    yStart: yStart,
    yEnd: yEnd,
  });
}

function draw() {
  clear();

  // Process each buffer
  for (let buffer of buffers) {
    processBuffer(buffer);
  }

  // Compute the global maxVal
  let globalMaxVal = computeGlobalMax(buffers);

  flameImg.loadPixels();

  for (let buffer of buffers) {
    let { pixies, yStart, yEnd } = buffer;
    for (let y = yStart; y < yEnd; y++) {
      for (let x = 0; x < width; x++) {
        let n = buffers.length;
        let idx = (x + (y - yStart) * width) * 4; // Buffer index
        let globalIdx = (x + y * width) * 4; // Image index

        let value = pixies[idx + 3];

        let normVal = globalMaxVal > 0 ? Math.log10(value) / globalMaxVal : 0;

        let r = pixies[idx] * normVal;
        let g = pixies[idx + 1] * normVal;
        let b = pixies[idx + 2] * normVal;

        // This is a slow step, haven't figured out a viable way to improve yet
        // Tried a lookup table and using a shader
        let gamma = 1 / 4;
        r = 255 * pow(r / 255, gamma);
        g = 255 * pow(g / 255, gamma);
        b = 255 * pow(b / 255, gamma);

        flameImg.pixels[globalIdx] = r; // Red
        flameImg.pixels[globalIdx + 1] = g; // Green
        flameImg.pixels[globalIdx + 2] = b; // Blue
        flameImg.pixels[globalIdx + 3] = 255; // Alpha
      }
    }
  }

  flameImg.updatePixels();

  // Display the final image
  image(flameImg, 0, 0);
  filter(BLUR, 1);

  // Faster, but not supported on Safari
  //drawingContext.filter = "blur(1px)";

  count += perFrame;
  if (count >= total) {
    noLoop();
  }

  let fps = frameRate();
  //console.log(fps);
  // Fairly slow ~ 2.3 
}

function randomColor() {
  let c = random(palette);
  return color(c[0], c[1], c[2]);
}

function processBuffer(buffer) {
  let { pixies, yStart, yEnd } = buffer;

  for (let i = 0; i < perFrame / numBuffers; i++) {
    // Pick a variation
    let index = int(random(variations.length));
    let variation = variations[index];
    let previous = current.copy();

    // Apply flame transformation
    current = variation.flame(current);

    // Handle invalid points
    if (!isFinite(current.x) || !isFinite(current.y)) {
      current = previous.copy();
    }

    let zoom = 0.5;
    let x = current.x * width * zoom;
    let y = -current.y * height * zoom;

    let px = int(x + width / 2);
    let py = int(y + height / 2);

    // Update pixels if in bounds
    if (px >= 0 && px < width && py >= yStart && py < yEnd) {
      let localY = py - yStart; // Local y-coordinate for this buffer
      let idx = (px + localY * width) * 4;

      pixies[idx + 3]++; // Increment value

      let c = lerpColor(c1, c2, current.z);
      pixies[idx] += red(c) / 255;
      pixies[idx + 1] += green(c) / 255;
      pixies[idx + 2] += blue(c) / 255;
    }
  }
}

function applyGammaCorrection(pixels, gamma = 1 / 4) {
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = 255 * pow(pixels[i] / 255, gamma);
    pixels[i + 1] = 255 * pow(pixels[i + 1] / 255, gamma);
    pixels[i + 2] = 255 * pow(pixels[i + 2] / 255, gamma);
  }
}

function computeGlobalMax(buffers) {
  let globalMax = 0;
  for (let buffer of buffers) {
    let { pixies } = buffer;
    for (let i = 0; i < pixies.length; i += 4) {
      if (pixies[i] > 0) {
        globalMax = Math.max(globalMax, Math.log10(pixies[i]));
      }
    }
  }

  return globalMax;
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
  variations.push(s1, s2, s3, s4);
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
