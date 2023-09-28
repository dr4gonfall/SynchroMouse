function makeid(length) {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let index = 0; index < length; index++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

function boxMullerTransform() {
    const u1 = Math.random();
    const u2 = Math.random();
    
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
    
    return { z0, z1 };
}

function getNormallyDistributedRandomNumber(mean, stddev) {
    const { z0, _ } = boxMullerTransform();
    
    return z0 * stddev + mean;
}

function randIntervalFromInterval(min, max) {
  return (Math.random() * (max - min + 1) + min);
}

function randIntervalFromIntervalInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function linearInterpolation(min, max, percentage) {
  let result = min * (1 - percentage) + max * percentage;
  return result;
}

function randomSelectionVariations(array, n) {
 const output = [];
 for (let i = 0; i < n; i++) {
  const randomIndex = Math.floor(Math.random() * array.length);
  output.push(array[randomIndex])
  array.splice(randomIndex, 1);
 }
 return output;
}

function BezierCurveMovement(currentPosition, point1Bezier, point2Bezier, endPoint) {
    let points = [
        currentPosition,
        point1Bezier,
        point2Bezier,
        endPoint 
    ]
    let [p0, p1, p2, p3] = points;
    //Calculate the coefficients based on where the ball currently is in the animation
    let cx = 3 * (p1.x - p0.x);
    let bx = 3 * (p2.x - p1.x) - cx;
    let ax = p3.x - p0.x - cx - bx;

    let cy = 3 * (p1.y - p0.y);
    let by = 3 * (p2.y - p1.y) - cy;
    let ay = p3.y - p0.y - cy -by;

    // this.percentagePosition += Math.hypot(this.collisionY, this.collisionX) / Math.hypot(p3.y, p3.x)
    // this.percentagePositionX += this.speedX
    // this.percentagePositionY += this.speedY
    this.percentagePositionX += this.percentageSpeedX;
    this.percentagePositionY += this.percentageSpeedY;
    // let tX = this.speedX;
    // let tY = this.speedY;

    //Increment t value by speed
    // ball.t += ball.speed;

    //Calculate new X & Y positions of ball
    // let xt = ax*(tX*tX*tX) + bx*(tX*tX) + cx*tX + p0.x;
    // let yt = ay*(tY*tY*tY) + by*(tY*tY) + cy*tY + p0.y;

    let xt = ax*(this.percentagePositionX * this.percentagePositionX * this.percentagePositionX) + bx*(this.percentagePositionX * this.percentagePositionX) + cx*this.percentagePositionX + p0.x;
    let yt = ay*(this.percentagePositionY * this.percentagePositionY * this.percentagePositionY) + by*(this.percentagePositionY * this.percentagePositionY) + cy*this.percentagePositionY + p0.y;

    // console.log(`The percentage of the movement in X is: ${this.percentagePositionX} and in Y: ${this.percentagePositionY}`)
    // console.log(`The speed in X is: ${Math.abs(this.collisionX - xt)} and in Y: ${Math.abs(this.collisionY - yt)}`)

    // this.collisionX = xt;
    // this.collisionY = yt;

    this.initialBezier.x = xt;
    this.initialBezier.y = yt;

}

function defineMagnitude(x, y) {
  return Math.sqrt(x ** 2 + y ** 2);
}

function normalize(x, y) {
  let m = defineMagnitude(x, y);
  if (m > 0) {
    return { x: x / m, y: y / m };
  }
  if (m === 0) {
    return { x: 0, y: 0 };
  }
}

// linearly maps value from the range (a..b) to (c..d)
function mapRange(value, a, b, c, d) {
  // first map value from (a..b) to (0..1)
  value = (value - a) / (b - a);
  // then map it from (0..1) to (c..d) and return it
  return c + value * (d - c);
}


function calculateAverage(array) {
    let total = 0;
    let count = 0;
  
    array.forEach(function (item, index) {
      total += item;
      count++;
    });
  
    return total / count;
  }

  function calculateCurvature(speedX, speedY, accX, accY) {
    let curve =
      Math.abs(speedX * accY - accX * speedY) /
      (speedX ** 2 + speedY ** 2) ** (3 / 2);
  
    return curve;
  }

  function toggleScreen(id, toggle) {
    let element = document.getElementById(id);
    let display = toggle ? "block" : "none";
    element.style.display = display;
  }

  function baseVector(agent, player) {
    distance = Math.sqrt(
      (player.position.x - agent.position.x) ** 2 +
        (player.position.y - agent.position.y) ** 2
    );
  
    if (distance !== 0) {
      agent.angle = Math.atan2(
        player.position.y - agent.position.y,
        player.position.x - agent.position.x
      );
      agent.velocity = Math.min(distance, agent.maxVelocity);
    }
  }

  function easeInSine(x) {
    return (1- Math.cos((x * Math.PI) / 2));
  }

  function easeOutSine(x) {
    return (1- Math.sin((x * Math.PI) / 2));
  }

  function easeInOutSine(x) {
    return - (Math.cos(Math.PI * x) - 1);
  }

  function easeInQuad(x) {
    return x * x;
  }

  function easeOutQuad(x) {
    return 1 - (1 - x) * (1 - x);
  }

  function easeInOutQuad(x) {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  }

  function easeInCubic(x) {
    return x * x * x;
  }

  function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
}

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}


function easeInQuart(x) {
  return x * x * x * x;
}

function easeOutQuart(x) {
  return 1 - Math.pow(1 - x, 4);
}


function easeInOutQuart(x) {
  return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
}

function easeInQuint(x) {
  return x * x * x * x * x;
}

function easeOutQuint(x) {
  return 1 - Math.pow(1 - x, 5);
}

function easeInOutQuint(x) {
  return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
}

function easeInExpo(x) {
  return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
}

function easeOutExpo(x) {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

function easeInOutExpo(x) {
  return x === 0
  ? 0
  : x === 1
  ? 1
  : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2
  : (2 - Math.pow(2, -20 * x + 10)) / 2;
}

function easeInCirc(x) {
  return 1 - Math.sqrt(1 - Math.pow(x, 2));
}

function easeOutCirc(x) {
  return sqrt(1 - Math.pow(x - 1, 2));
}

function easeInOutCirc(x) {
  return x < 0.5
  ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
  : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
}

function easeInBack(x) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return c3 * x * x * x - c1 * x * x;
}


function easeOutBack(x) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

function easeInOutBack(x) {
  const c1 = 1.70158;
  const c2 = c1 * 1.525;
  return x < 0.5
     ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
     : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
}

function easeInElastic(x) {
  const c4 = (2 * Math.PI) / 3;
  return x === 0
      ? 0
      : x === 1
      ? 1
      : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4);
}

function easeOutElastic(x) {
  const c4 = (2 * Math.PI) / 3;
  return x === 0
  ? 0
  : x === 1
  ? 1
  : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}


function easeInOutElastic(x) {
  const c5 = (2 * Math.PI) / 4.5;
  return x === 0
  ? 0
  : x === 1
  ? 1
  : x < 0.5
  ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
  : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
}

function easeInBounce(x) {
  return 1 - easeOutBounce(1 - x);
}

function easeOutBounce(x) {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (x < 1 / d1) {
  return n1 * x * x;
  } else if (x < 2 / d1) {
      return n1 * (x -= 1.5 / d1) * x + 0.75;
  } else if (x < 2.5 / d1) {
      return n1 * (x -= 2.25 / d1) * x + 0.9375;
  } else {
      return n1 * (x -= 2.625 / d1) * x + 0.984375;
  }
}


function easeInOutBounce(x) {
  return x < 0.5
  ? (1 - easeOutBounce(1 - 2 * x)) / 2
  : (1 + easeOutBounce(2 * x - 1)) / 2;
}