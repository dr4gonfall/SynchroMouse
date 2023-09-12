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