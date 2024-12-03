class Variation {
  constructor() {
    this.preTransform = Array(6)
      .fill()
      .map(() => random(-1, 1));
    this.postTransform = Array(6)
      .fill()
      .map(() => random(-1, 1));
    this.colorVal = 0;
    this.name = "Variation";
  }

  setColor(val) {
    this.colorVal = val;
    return this;
  }

  setTransform(pre) {
    this.preTransform = pre;
    return this;
  }

  affine(v, coeff) {
    let x = coeff[0] * v.x + coeff[1] * v.y + coeff[2];
    let y = coeff[3] * v.x + coeff[4] * v.y + coeff[5];
    return createVector(x, y);
  }

  f(v) {
    return v.copy();
  }

  flame(input) {
    let v = this.affine(input, this.preTransform);
    v = this.f(v);
    v.z = (input.z + this.colorVal) * 0.5;
    return v;
  }
}

class Fisheye extends Variation {
  constructor() {
    super();
    this.name = "Fisheye";
  }

  f(v) {
    let r = v.x * v.x + v.y * v.y;
    let newV = createVector(v.y, v.x);
    newV.mult(2 / (r + 1));
    return newV;
  }
}

class Diamond extends Variation {
  constructor() {
    super();
    this.name = "Diamond";
  }

  f(v) {
    let r = v.x * v.x + v.y * v.y;
    let theta = atan(v.x / v.y);
    let x = sin(theta) * cos(r);
    let y = cos(theta) * sin(r);
    return createVector(x, y);
  }
}

class Hyperbolic extends Variation {
  constructor() {
    super();
    this.name = "Hyperbolic";
  }

  f(v) {
    let r = v.x * v.x + v.y * v.y;
    let theta = atan(v.x / v.y);
    let x = sin(theta) / r;
    let y = r * cos(theta);
    return createVector(x, y);
  }
}

class Spiral extends Variation {
  constructor() {
    super();
    this.name = "Spiral";
  }

  f(v) {
    let r = v.x * v.x + v.y * v.y;
    let theta = atan(v.x / v.y);
    let x = (1 / r) * (cos(theta) + sin(r));
    let y = (1 / r) * (sin(theta) - cos(r));
    return createVector(x, y);
  }
}

class Disc extends Variation {
  constructor() {
    super();
    this.name = "Disc";
  }

  f(v) {
    let r = v.x * v.x + v.y * v.y;
    let theta = atan(v.x / v.y);
    let x = (theta / PI) * sin(PI * r);
    let y = (theta / PI) * cos(PI * r);
    return createVector(x, y);
  }
}

class Heart extends Variation {
  constructor() {
    super();
    this.name = "Heart";
  }

  f(v) {
    let r = v.x * v.x + v.y * v.y;
    let theta = atan(v.x / v.y);
    let x = r * sin(theta * r);
    let y = -r * cos(theta * r);
    return createVector(x, y);
  }
}

class Hankerchief extends Variation {
  constructor() {
    super();
    this.name = "Hankerchief";
  }

  f(v) {
    let r = v.x * v.x + v.y * v.y;
    let theta = atan(v.x / v.y);
    let x = r * sin(theta + r);
    let y = r * cos(theta - r);
    return createVector(x, y);
  }
}

class Polar extends Variation {
  constructor() {
    super();
    this.name = "Polar";
  }

  f(v) {
    let r = v.x * v.x + v.y * v.y;
    let theta = atan(v.x / v.y);
    let x = theta / PI;
    let y = r - 1;
    return createVector(x, y);
  }
}

class HorseShoe extends Variation {
  constructor() {
    super();
    this.name = "HorseShoe";
  }

  f(v) {
    let r = v.x * v.x + v.y * v.y;
    let x = (v.x - v.y) * (v.x + v.y);
    let y = 2 * v.x * v.y;
    return createVector(x / r, y / r);
  }
}

class Spherical extends Variation {
  constructor() {
    super();
    this.name = "Spherical";
  }

  f(v) {
    let r = v.x * v.x + v.y * v.y;
    return createVector(v.x / r, v.y / r);
  }
}

class Swirl extends Variation {
  constructor() {
    super();
    this.name = "Swirl";
  }

  f(v) {
    let r = v.magSq();
    return createVector(
      v.x * sin(r) - v.y * cos(r),
      v.x * cos(r) - v.y * sin(r)
    );
  }
}

class Sinusoidal extends Variation {
  constructor() {
    super();
    this.name = "Sinusoidal";
  }

  f(v) {
    return createVector(sin(v.x), sin(v.y));
  }
}

class Linear extends Variation {
  constructor(amt) {
    super();
    this.amt = amt;
    this.name = "Linear";
  }

  f(v) {
    return createVector(v.x * this.amt, v.y * this.amt);
  }
}

class PJF extends Variation {
  constructor(amt) {
    super();
    this.amt = amt;
    this.name = "PJF";
  }

  f(v) {
    return createVector(v.x * this.amt, v.y * this.amt);
  }
}
