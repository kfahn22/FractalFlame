const e = 2.71828;

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

// https://mathcurve.com/courbes2d.gb/astroid/astroid.shtml
// https://mathworld.wolfram.com/Astroid.html
class Astroid extends Variation {
  constructor() {
    super();
    this.name = "Astroid";
  }

  f(v) {
    // Convert Cartesian to Polar
    let r = sqrt(v.x * v.x + v.y * v.y); // Distance from origin
    let theta = atan2(v.y, v.x); // Angle in radians

    // Ensure radius doesn't collapse too close to zero
    r = max(r, 0.001);

    // Astroid Transformation
    let x = r * pow(cos(theta), 3); // r * cos^3(theta)
    let y = r * pow(sin(theta), 3); // r * sin^3(theta)

    // Return the transformed point
    return createVector(x, y);
  }
}


// https://mathcurve.com/courbes2d.gb/bicorne/bicorne.shtml
class Bicorn extends Variation {
  constructor() {
    super();
    this.name = "Bicorn";
  }
  f(v) {
    let r = v.x * v.x + v.y * v.y;
    let theta = atan(v.x / v.y);

    // Ensure radius doesn't collapse too close to zero
    r = max(r, 0.001);
    let x = r * sin(theta);
    let y = r * (pow(cos(theta), 2) / (2 + cos(theta)));
    return createVector(x, y);
  }
}

// https://mathcurve.com/courbes2d/ornementales/ornementales.shtml
class Butterfly extends Variation {
  constructor() {
    super();
    this.name = "Butterfly";
  }
  f(v) {
    let r = v.x * v.x + v.y * v.y;
    let rr = -3 * cos(2 * theta) + sin(7 * theta) - 1;
    // Ensure radius doesn't collapse too close to zero
    r = max(r, 0.001);
    let theta = atan(v.x / v.y);
    let x = r * rr * cos(theta);
    let y = -r * rr * sin(theta);
    return createVector(x, y);
  }
}

// https://mathworld.wolfram.com/CassiniOvals.html
class CassiniOval extends Variation {
  constructor() {
    super();
    this.name = "CassiniOval";
  }
  f(v) {
    let r = v.x * v.x + v.y * v.y;
    let root = sqrt(pow(1 / 0.7, 4) - pow(sin(2 * theta), 2));
    let rr = pow(0.7, 2) * (cos(2 * theta) + root);
    // Ensure radius doesn't collapse too close to zero
    r = max(r, 0.001);
    let theta = atan(v.x / v.y);
    let x = r * rr * cos(theta);
    let y = r * rr * sin(theta);
    return createVector(x, y);
  }
}

class Clover extends Variation {
  constructor() {
    super();
    this.name = "Clover";
    this.m = 6;
  }
  f(v) {
    let r = v.x * v.x + v.y * v.y;
    // Ensure radius doesn't collapse too close to zero
    r = max(r, 0.001);
    let theta = atan(v.x / v.y);
    let rr = 1 + cos(6 * theta) + pow(sin(6 * theta), 2);
    let x = r * rr * cos(theta);
    let y = r * rr * sin(theta);
    return createVector(x, y);
  }
}

// // https://mathworld.wolfram.com/Cranioid.html
class Craniod extends Variation {
  constructor() {
    super();
    this.name = "Craniod";
    this.a = 1;
    this.b = 1;
  }
  f(v) {
    let r = v.x * v.x + v.y * v.y;
    // Ensure radius doesn't collapse too close to zero
    r = max(r, 0.001);
    let rr = this.a * sin(theta) + this.b * sqrt(1 - 0.75 * pow(cos(theta), 2));
    let x = r * rr * cos(theta);
    let y = r * rr * sin(theta);
    return createVector(x, y);
  }
}

// // https://mathcurve.com/courbes2d.gb/deltoid/deltoid.shtml
class Deltoid extends Variation {
  constructor() {
    super();
    this.name = "Deltoid";
  }
  f(v) {
    let r = v.x * v.x + v.y * v.y;
    // Ensure radius doesn't collapse too close to zero
    r = max(r, 0.001);
    let theta = atan(v.x / v.y);
    let x = r * (pow(cos(theta / 2), 2) * cos(theta) - 1);
    let y = r * (4 * pow(sin(theta / 2), 2) * sin(theta));
    return createVector(x, y);
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

class Eight extends Variation {
  constructor() {
    super();
    this.name = "Eight";
  }

  f(v) {
    let r = v.x * v.x + v.y * v.y;
    // Ensure radius doesn't collapse too close to zero
    r = max(r, 0.001);
    let theta = atan(v.x / v.y);
    let x = r * sin(theta);
    let y = r * sin(theta) * cos(theta);
    return createVector(x, y);
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

// // https://thecodingtrain.com/challenges/55-mathematical-rose-patterns
// // changed to flower
class Flower extends Variation {
  constructor() {
    super();
    this.name = "Flower";
    this.a = 1.3;
    this.m = 8;
  }
  f(v) {
    let r = v.x * v.x + v.y * v.y;
    // Ensure radius doesn't collapse too close to zero
    r = max(r, 0.001);
    let theta = atan(v.x / v.y);
    let rr = this.a + cos(this.m * theta);
  
    let x = r * rr * cos(theta);
    let y = r * rr * sin(theta);
    return createVector(x, y);
  }
}

// https://mathworld.wolfram.com/GearCurve.html
// https://help.tc2000.com/m/69445/l/755460-hyperbolic-functions-table
class Gear extends Variation {
  constructor(a, b, m) {
    super();
    this.name = "Gear";
    this.a = a; // Base radius parameter
    this.b = b; // Amplitude scaling parameter
    this.m = m; // Frequency multiplier parameter
  }

  hyperbolicTan(theta) {
    // tanh(theta) = (e^(2*theta) - 1) / (e^(2*theta) + 1)
    let l = exp(2 * theta); // Corrected `pow(e, 2 * theta)` to `exp(2 * theta)`
    return (l - 1) / (l + 1);
  }

  f(v) {
    // Convert Cartesian to polar
    let r = sqrt(v.x * v.x + v.y * v.y); // Use sqrt for proper radius
    let theta = atan2(v.y, v.x); // Correctly handle atan2

    // Ensure radius doesn't collapse too close to zero
    r = max(r, 0.001);

    // Gear formula for the radius
    let rr =
      this.a + (1 / this.b) * this.hyperbolicTan(this.b * sin(this.m * theta));

    // Convert back to Cartesian coordinates
    let x = r * rr * cos(theta); // Corrected order for Cartesian conversion
    let y = r * rr * sin(theta);

    // Return the transformed vector
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

// https://mathcurve.com/courbes2d.gb/bouche/bouche.shtml
class Kiss extends Variation {
  constructor() {
    super();
    this.name = "Kiss";
    this.a = 1;
    this.b = 2;
  }

  f(v) {
    let r = v.x * v.x + v.y * v.y;
    // Ensure radius doesn't collapse too close to zero
    r = max(r, 0.001);
    let theta = atan(v.x / v.y);
    let x = this.a * r * cos(theta);
    let y = this.b * r * pow(sin(theta), 3);
    return createVector(x, y);
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

class Quadrilateral extends Variation {
  constructor(m) {
    super();
    this.m = m;
    this.name = "Quadrilateral";
  }

  f(v) {
    let r = v.x * v.x + v.y * v.y;
    // Ensure radius doesn't collapse too close to zero
    r = max(r, 0.001);
    let theta = atan(v.x / v.y) / 5;
    let x = r * cos(theta);
    let y = r * sin(theta);
    return createVector(x, y);
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

//   // heart curve equation from https://mathworld.wolfram.com/HeartCurve.html
//   // https://thecodingtrain.com/challenges/134-heart-curve

//   heart() {
//     for (let theta = 0; theta < 2 * PI; theta += 0.1) {
//       const x = 0.1 * this.r * 16 * pow(sin(theta), 3);
//       const y =
//         0.1 *
//         -this.r *
//         (13 * cos(theta) -
//           5 * cos(2 * theta) -
//           2 * cos(3 * theta) -
//           cos(4 * theta));
//       this.points.push(createVector(x, y));
//     }
//   }

//   // https://mathcurve.com/courbes2d/ornementales/ornementales.shtml

//   knot() {
//     for (let theta = -2 * PI; theta < 2 * PI; theta += 0.1) {
//       let x = 0.5 * this.r * (3 * sin(theta) + 2 * sin(3 * theta));
//       let y = 0.5 * this.r * (cos(theta) - 2 * cos(3 * theta));
//       this.points.push(createVector(x, y));
//     }
//   }

//   // https://mathworld.wolfram.com/DumbbellCurve.html
//   // https://thecodingtrain.com/challenges/116-lissajous-curve-table

//   // https://mathcurve.com/courbes2d.gb/lissajous/lissajous.shtml
//   // https://thecodingtrain.com/challenges/116-lissajous-curve-table

//   lissajous() {
//     for (let theta = -2 * PI; theta <= 2 * PI; theta += 0.01) {
//       let x = this.r * sin(this.a * theta + this.m) + 1;
//       let y = this.r * sin(this.b * theta);
//       this.points.push(createVector(x, y));
//     }
//   }

//   // https://mathcurve.com/courbes2d.gb/croixdemalte/croixdemalte.shtml
//   malteseCross() {
//     for (let theta = 0.1; theta < TWO_PI; theta += 0.05) {
//       let x = this.r * +cos(theta) * (pow(cos(theta), 2) - this.a);
//       let y = this.r * +this.b * sin(theta) * pow(cos(theta), 2);
//       this.points.push(createVector(x, y));
//     }
//   }

//   // https://mathworld.wolfram.com/Ophiuride.html

//   ophiuride() {
//     for (let theta = (-PI * 1) / 2; theta < (PI * 1) / 2; theta += 0.05) {
//       let r = (this.b * sin(theta) - this.a * cos(theta)) * tan(theta);
//       let x = this.r * r * cos(theta);
//       let y = this.r * r * sin(theta);
//       this.points.push(createVector(x, y));
//     }
//   }

//   // https://mathcurve.com/courbes2d/ornementales/ornementales.shtml
//   pinwheel() {
//     for (let theta = 0; theta < TWO_PI; theta += 0.01) {
//       let denom = 1 - 0.75 * pow(sin(this.m * theta), 2);
//       let r = pow(sin(4 * theta) / denom, 0.5);
//       let x = this.r * r * cos(theta);
//       let y = this.n * this.r * r * sin(theta);
//       this.points.push(createVector(x, y));
//     }
//   }

//   // https://mathcurve.com/courbes2d.gb/rosace/rosace.shtml
//   // https://thecodingtrain.com/challenges/55-mathematical-rose-patterns
//   // https://editor.p5js.org/codingtrain/sketches/3kanFIcHd

//   reduceDenominator(numerator, denominator) {
//     function rec(a, b) {
//       return b ? rec(b, a % b) : a;
//     }
//     return denominator / rec(numerator, denominator);
//   }

//   rose() {
//     let k = this.d / this.m;
//     for (
//       let theta = 0;
//       theta < TWO_PI * this.reduceDenominator(this.d, this.m);
//       theta += 0.02
//     ) {
//       let r = this.r * cos(k * theta);
//       let x = r * cos(theta);
//       let y = r * sin(theta);
//       this.points.push(createVector(x, y));
//     }
//   }

//   quadrifolium() {
//     let a = 1;
//     for (let theta = 0; theta < TWO_PI; theta += 0.05) {
//       let x = this.r * (2 * a * pow(sin(theta), 2) * cos(theta));
//       let y = this.r * (2 * a * pow(cos(theta), 2) * sin(theta));
//       this.points.push(createVector(x, y));
//     }
//   }

//   // https://mathcurve.com/courbes2d.gb/archimede/archimede.shtml
//   // https://mathcurve.com/courbes2d.gb/spirale/spirale.shtml
//   // this.n = 1 Archimedian Spiral
//   // this.n = -1 Hyperbolic Spiral
//   // this.n = 1/2 Fermat spiral
//   // this.n = -1/2 Lituus spiral
//   // this.n = 2 Galilean spiral
//   spiral() {
//     //let a = 0.1;
//     let dir = -1;
//     for (let theta = 0; theta < 4 * PI; theta += 0.05) {
//       let r = dir * this.a * pow(theta, this.n);
//       //let r = this.a * pow(theta, this.n);
//       let x = this.r * r * cos(theta);
//       let y = this.r * r * sin(theta);
//       this.points.push(createVector(x, y));
//     }
//   }

//   // https://thecodingtrain.com/challenges/19-superellipse

//   // this.n = 0.5 astroid
//   sgn(val) {
//     if (val == 0) {
//       return 0;
//     }
//     return val / abs(val);
//   }

//   superellipse() {
//     for (let theta = 0; theta < TWO_PI; theta += 0.05) {
//       let na = 2 / this.m;
//       let x = this.r * pow(abs(cos(theta)), na) * this.a * this.sgn(cos(theta));
//       let y = this.r * pow(abs(sin(theta)), na) * this.b * this.sgn(sin(theta));
//       this.points.push(createVector(x, y));
//     }
//   }

//   // https://thecodingtrain.com/challenges/23-2d-supershapes

//   superformula(theta) {
//     let part1 = (1 / this.a) * cos((theta * this.m) / 4);
//     part1 = abs(part1);
//     part1 = pow(part1, this.n2);
//     let part2 = (1 / this.b) * sin((theta * this.m) / 4);
//     part2 = abs(part2);
//     part2 = pow(part2, this.n3);
//     let part3 = pow(part1 + part2, 1 / this.n1);
//     if (part3 === 0) {
//       return 0;
//     }
//     return 1 / part3;
//   }

//   supershape() {
//     for (let theta = 0; theta <= TWO_PI; theta += 0.05) {
//       let r = this.superformula(theta);
//       let x = this.r * r * cos(theta);
//       let y = this.r * r * sin(theta);
//       this.points.push(createVector(x, y));
//     }
//   }

//   // https://mathcurve.com/courbes2d.gb/larme/larme.shtml

//   tearDrop() {
//     let n = 4;
//     for (let theta = 0; theta < TWO_PI; theta += 0.1) {
//       let x = this.r * cos(theta);
//       let y = this.r * sin(theta) * pow(sin(theta / 2), n);
//       this.points.push(createVector(x, y));
//     }
//   }

//   //https://mathcurve.com/courbes2d.gb/moulinavent/moulinavent.shtml
//   windmill() {
//     for (let theta = 0; theta < 2 * PI; theta += 0.01) {
//       let r = abs(this.m * tan(2 * theta)) + this.a;
//       let x = this.r * r * cos(theta);
//       let y = this.r * r * sin(theta);
//       this.points.push(createVector(x, y));
//     }
//   }

//   // https://mathcurve.com/courbes2d.gb/abdank/abdank.shtml

//   zigzag() {
//     for (let theta = -PI / 2; theta < this.a * PI; theta += 0.1) {
//       let x = this.r * sin(theta);
//       let y =
//         ((this.r * pow(this.n, 2)) / 2) * (theta + sin(theta) * cos(theta));
//       this.points.push(createVector(x, y));
//     }
//   }

//   show() {
//     push();
//     translate(this.x * width, this.y * height);
//     rotate(this.angle);
//     beginShape();
//     for (let p of this.points) {
//       vertex(p.x, p.y);
//     }
//     endShape(CLOSE);
//     pop();
//   }

//   openShow() {
//     push();
//     translate(this.x * width, this.y * height);
//     rotate(this.angle);
//     beginShape();
//     for (let p of this.points) {
//       vertex(p.x, p.y);
//     }
//     endShape();
//     pop();
//   }
// }
