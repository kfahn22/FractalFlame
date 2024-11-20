// Coding Train Videos:
// Stream: https://www.youtube.com/watch?v=5lIl5F1hpTE
// Challenge: https://www.youtube.com/watch?v=BZUdGqeOD0w

// Is there a way to further optimize???  Not sure the buffers are doing anything.
let current;
let finalV;

let variations = [];
let graphics = [];

let pixies;
let flameImg;

let total = 10000000;
let perFrame = 1000000;
let test = false;
let count = 0;
let n = 1; // number of buffers
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

let indexes = [12, 4, 2];

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

  if (test) {
    total = 10000;
    perFrame = 500;
  }

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

  variations = sphericalOption(variations)

  // let weights = getVariationsWeights(numVar);
  // variations = getRandomVariations(
  //   variations,
  //   numVar,
  //   variationOptions,
  //   weights
  // );

  // for (let i of indexes) {
  //   variations.push(variationOptions[i]);
  // }

  graphics.push(imageBuffer());
  for (let i = 0; i < n; i++) {
    graphics.push(flameBuffer());
  }

  flameImg = graphics[0].image;
  pixies = graphics[1].pixies;

  // Starting point
  current = createVector(random(-1, 1), random(-1, 1), random(0, 1));
}

function draw() {
  clear();
  for (let i = 0; i < perFrame; i++) {
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
    if (px >= 0 && px < width && py >= 0 && py < height) {
      pixies[px][py].value++;
      let c = lerpColor(c1, c2, current.z);
      pixies[px][py].r += red(c) / 255;
      pixies[px][py].g += green(c) / 255;
      pixies[px][py].b += blue(c) / 255;
    }
  }

  // Find max log value
  let maxVal = 0;
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      let pix = pixies[i][j];
      let value = Math.log10(pix.value);
      maxVal = Math.max(maxVal, value);
    }
  }

  // Update image
  flameImg.loadPixels();

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      let pix = pixies[i][j];
      let value = Math.log10(pix.value) / maxVal;
      let index = (i + j * width) * 4;

      let r = pix.r * value;
      let g = pix.g * value;
      let b = pix.b * value;

      // Apply gamma
      let gamma = 1 / 4.0;
      r = 255 * pow(r / 255, gamma);
      g = 255 * pow(g / 255, gamma);
      b = 255 * pow(b / 255, gamma);

      flameImg.pixels[index] = r;
      flameImg.pixels[index + 1] = g;
      flameImg.pixels[index + 2] = b;
      flameImg.pixels[index + 3] = 255;
    }
  }
  flameImg.updatePixels();

  // Display
  //background(0);
  image(flameImg, 0, 0);
  filter(BLUR, 1);

  // Check progress
  count += perFrame;
  if (count >= total) {
    noLoop();
    //saveCanvas("render" + millis(), "png");
  }

}

function randomColor() {
  let c = random(palette);
  return color(c[0], c[1], c[2]);
}

function flameBuffer() {
  let buffer = createGraphics(width, height);
  // Initialize pixel array
  let pixies = Array.from({ length: width }, () =>
    Array.from({ length: height }, () => new Pixie())
  );

  let g = {
    buffer: buffer,
    x: 0,
    y: 0,
    w: width,
    h: height,
    pixies: pixies,
  };
  return g;
}

function imageBuffer() {
  let buffer = createGraphics(width, height);

  let img = createImage(width, height);

  let g = {
    buffer: buffer,
    x: 0,
    y: 0,
    w: width,
    h: height,
    image: img,
  };
  return g;
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
