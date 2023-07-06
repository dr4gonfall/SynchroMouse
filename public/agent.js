class Agent {
  constructor(game, player) {
    this.game = game;
    this.player = player;
    // Position of the agent.
    this.collisionX = this.game.width * 0.5;
    this.collisionY = this.game.height * 0.5;
    this.collisionRadius = 30;
    this.frequency = 1;
    // Speed of the Agent (Changes depend on Competence).
    this.speedX = 0;
    this.speedY = 0;
    this.speedXPoint = 0;
    this.speedYPoint = 0;
    this.maxSpeed = 5;
    this.decSpeed = 0;
    // Acceleration of the Agent.
    this.accX = 0;
    this.accY = 0;
    this.prevAccX = this.accX;
    this.prevAccY = this.accY;
    this.maxAcceleration = 60;
    this.accelerationProfile = [];
    this.deccelerationProfile = [];
    this.moveErrorX = 0;
    this.moveErrorY = 0;
    // Forces of the Agent.
    this.force = 0;
    this.maxForce = 10.0;
    // Competence and Predictability
    this.competence = 0;
    this.predictability = 0;
    // Bezier Curve Coordinates
    this.initialBezier = {
      x: this.game.width * 0.5,
      y: this.game.height * 0.5,
    };
    this.initialBezier_zero = { x: this.collisionX, y: this.collisionY };
    this.p1Bezier = { x: 0, y: 0 };
    this.p2Bezier = { x: 0, y: 0 };
    this.endBezier = { x: 400, y: 500 };
    this.percentagePositionX = 0;
    this.percentagePositionY = 0;
    this.percentageSpeedX = 0;
    this.percentageSpeedY = 0;
    // Polygon parameters
    this.numberSides = 0;
    this.totalAngle = 0;
    this.lengthSide = [];
    this.size = 10;
    this.initialPolygon = { x: this.collisionX, y: this.collisionY };
    this.pointsPerSide = 5;
    this.currentSide = 0;
    this.polygonPoints = [];
    this.isCollinearPoint = [];
    this.alpha = (2 * Math.PI) / 14;
    this.radius = 0;
    this.starCenter = { x: this.collisionX, y: this.collisionY };
    this.isPolygon = true;
    // Circle parameters
    this.circleRadius = 0;
    this.initialAngle = 0;
    this.center = { x: this.collisionX, y: this.collisionY };
    this.currentAngle = 0;
    this.circlePoints = [];
    this.maxCirclePoints = 20;
    // Movement distance
    this.movementDistance = 0;

    this.paintMovementDecision = false;

    // Line Parameters
    this.initialLinePoint = { x: this.collisionX, y: this.collisionY };
    this.left = false;

    this.movementOrder = 0;

    //Player of the Game
    this.player = this.game.player;
    // Decision to change the type of movement base on the score.
    this.follower = true;
    // Decision of the agent to commit to a movement.
    this.movementDecision = false;
    // Type of movement the agent will perform.
    this.currentMovementDecision = 0;
    // Guiding points for following the movement
    this.trajectoryMovement = [];
    this.trajectoryMovementPolygon = [];
    this.isPlanning = true;
    this.trajectoryMov = [];
    // Current target of the agent.
    this.target = { x: 500, y: 200 };
    // Verify the agent has arrived to a given target.
    this.hasArrived = false;
    // Counter for the current target in the trayectory.
    this.counterTarget = 0;

    this.timerDecision = 0;
    this.movementCounter = 0;

    this.degreeVel = 0;

    this.prevMoveDec = this.movementDecision;

    this.velocityProfile = [];

    // Second Order dynamics
    // Previous Input
    // this.xp = {x: 0, y: 0};
    this.previousInput = { x: 0, y: 0 };
    // State Variables
    // this.y = {x: 0, y: 0};
    this.outputVectorY = { x: 0, y: 0 };
    // this.yd = {x: 0, y: 0};
    this.outputVectorYVel = { x: 0, y: 0 };
    // Dynamics Constants
    this.k1 = 0;
    this.k2 = 0;
    this.k3 = 0;
  }
  draw(context, targetX, targetY) {
    context.beginPath();
    context.arc(
      this.collisionX,
      this.collisionY,
      this.collisionRadius,
      0,
      Math.PI * 2
    );
    context.save();
    context.globalAlpha = 0.5;
    context.fill();
    context.restore();
    context.stroke();

    context.beginPath();
    context.arc(
      this.game.width - 50,
      this.game.height - 50,
      this.collisionRadius,
      0,
      Math.PI * 2
    );
    context.save();
    context.globalAlpha = 0.5;
    context.fill();
    context.restore();
    context.stroke();

    context.beginPath();
    context.arc(300, 300, 5, 0, Math.PI * 2);
    context.save();
    context.globalAlpha = 0.5;
    context.fill();
    context.restore();
    context.stroke();

    context.beginPath();
    context.arc(this.initialBezier.x, this.initialBezier.y, 5, 0, Math.PI * 2);
    context.save();
    // context.globalAlpha = 0.5;
    context.fillStyle = "purple";
    context.fill();
    context.restore();
    context.stroke();

    // context.beginPath()
    // context.arc(this.p1Bezier.x, this.p1Bezier.y, 5, 0 , Math.PI * 2)
    // context.save();
    // context.globalAlpha = 0.5;
    // context.fillStyle = 'blue'
    // context.fill();
    // context.restore();
    // context.stroke()

    // context.beginPath()
    // context.arc(this.p2Bezier.x, this.p2Bezier.y, 5, 0 , Math.PI * 2)
    // context.save();
    // context.globalAlpha = 0.5;
    // context.fillStyle = 'blue'
    // context.fill();
    // context.restore();
    // context.stroke()

    context.beginPath();
    context.arc(this.endBezier.x, this.endBezier.y, 5, 0, Math.PI * 2);
    context.save();
    // context.globalAlpha = 0.5;
    context.fillStyle = "black";
    context.fill();
    context.restore();
    // context.stroke()

    context.beginPath();
    context.moveTo(this.collisionX, this.collisionY);
    context.lineTo(this.target.x, this.target.y);
    context.stroke();

    for (let i = 0; i < this.trajectoryMovement.length - 1; i++) {
      context.beginPath();
      context.arc(
        this.trajectoryMovement[i].x,
        this.trajectoryMovement[i].y,
        5,
        0,
        Math.PI * 2
      );
      if (i >= 1) {
        context.moveTo(
          this.trajectoryMovement[i].x,
          this.trajectoryMovement[i].y
        );
        context.lineTo(
          this.trajectoryMovement[i - 1].x,
          this.trajectoryMovement[i - 1].y
        );
      }

      context.save();
      // context.globalAlpha = 0.5;
      context.fillStyle = "red";
      context.fill();
      context.restore();
      context.stroke();

      console.log;
    }

    // for (let i = 0; i < this.trajectoryMovementPolygon.length ; i++) {
    //     context.beginPath()
    //     context.arc(this.trajectoryMovementPolygon[i].x, this.trajectoryMovementPolygon[i].y, 5, 0 , Math.PI * 2)
    //     context.save();
    //     // context.globalAlpha = 0.5;
    //     context.fillStyle = 'red'
    //     context.fill();
    //     context.restore();
    //     context.stroke()

    // }

    // for (let i = 0; i < this.circlePoints.length; i++) {
    //     context.beginPath()
    //     context.arc(this.circlePoints[i].x, this.circlePoints[i].y, 5, 0 , Math.PI * 2)
    //     context.save();
    //     // context.globalAlpha = 0.5;
    //     context.fillStyle = 'purple'
    //     context.fill();
    //     context.restore();
    //     context.stroke()

    // }

    // this.game.context.beginPath()
    // console.log(this.trajectoryMov.length)
    // for (let i = this.trajectoryMov.length- 1; i > 0; i--) {
    //     this.game.context.arc(this.trajectoryMov[i].x, this.trajectoryMov[i].y, 5, 0, Math.PI * 2)

    // }
    // this.game.context.closePath()
    // this.game.context.stroke()

    // for (let i = 15; i !== 0; i--) {
    //     let r = radius * (i % 2 + 1) /2
    //     var omega = alpha * i;
    //     // this.game.context.lineTo((r * Math.sin(omega)) + starXY[0], (r * Math.cos(omega)) + starXY[1]);
    //     if (isPolygon) {
    //         if(i % 2 !== 0) {
    //             this.game.context.arc((r * Math.sin(omega)) + starCenter[0], (r * Math.cos(omega)) + starCenter[1], 5, 0 , Math.PI * 2)
    //             this.trajectoryMov.push({x: (r * Math.sin(omega)) + starCenter[0], y: (r * Math.cos(omega)) + starCenter[1]})
    //         }
    //     } else if (!isPolygon) {
    //         this.game.context.arc((r * Math.sin(omega)) + starCenter.x, (r * Math.cos(omega)) + starCenter.y, 5, 0 , Math.PI * 2)
    //     }

    //     // this.game.context.arc((r * Math.sin(omega)) + starXY[0], (r * Math.cos(omega)) + starXY[1], 5, 0 , Math.PI * 2)
    //     // this.game.context.save();
    //     // context.globalAlpha = 0.5;
    //     // this.game.context.fillStyle = 'blue'
    //     // context.fill();
    //     // this.game.context.restore();
    //     // this.game.context.stroke()

    // }
    // this.game.context.closePath()
    // this.game.context.stroke()

    // this.starMovement()

    // console.log(`The target is: ${targetX} and ${targetY}`)
    // console.log(`The Width of the game is: ${this.game.width} and the height is: ${this.game.height}`)
    // console.log(this.collisionX)
  }

  // Agent controls:
  // The agent will have a pointer similar to the human and there will be a direction and distance depending on the force.

  applyForce(force) {
    // Add the acceleration to the movements of the agent.
    // this.acc.add(force)
    this.accX += force.x;
    this.accY += force.y;
  }

  setRhythm() {}

  setTarget() {}

  // linearly maps value from the range (a..b) to (c..d)
  mapRange(value, a, b, c, d) {
    // first map value from (a..b) to (0..1)
    value = (value - a) / (b - a);
    // then map it from (0..1) to (c..d) and return it
    return c + value * (d - c);
  }

  circleMovement() {
    let times = 0;
    while (this.currentAngle < this.maxCirclePoints) {
      this.initialAngle = (this.initialAngle + 1) % 360;
      this.currentAngle = this.currentAngle + 1;

      let radians = this.initialAngle;
      // console.log(`The initial angle is: ${this.initialAngle} The current angle is: ${this.currentAngle} The radians are: ${radians}`)
      let x = this.center.x + this.radius * Math.cos(radians);
      let y = this.center.y + this.radius * Math.sin(radians);
      // console.log(`The point in x is: ${x} and the point in y: ${y}`)
      // this.circlePoints.push({x: x, y: y});
      this.trajectoryMovement.push({ x: x, y: y });

      times++;
    }
    console.log(`THE END OF THE CIRCLE`);

    // console.log(`The amount of times is: ${times}`)

    this.currentAngle = 0;
    // this.initialAngle = (this.initialAngle + 1) % 360;
    // this.currentAngle = (this.currentAngle + 1);

    // let radians = this.initialAngle;
    // let x =  this.center.x + this.radius * Math.cos(radians);
    // let y = this.center.y + this.radius * Math.sin(radians);

    // return {x: x, y: y}

    // this.collisionX = x;
    // this.collisionY = y;
  }

  debuggingMode() {}

  starMovement(alpha, radius, isPolygon, numberPoints) {
    // this.game.context.beginPath()

    for (let i = numberPoints; i !== 0; i--) {
      let r = (radius * ((i % 2) + 1)) / 2;
      var omega = alpha * i;
      // this.game.context.lineTo((r * Math.sin(omega)) + starXY[0], (r * Math.cos(omega)) + starXY[1]);
      if (isPolygon) {
        if (i % 2 !== 0) {
          // this.game.context.arc((r * Math.sin(omega)) + starCenter[0], (r * Math.cos(omega)) + starCenter[1], 5, 0 , Math.PI * 2)
          this.trajectoryMovement.push({
            x: r * Math.sin(omega) + this.starCenter.x,
            y: r * Math.cos(omega) + this.starCenter.y,
          });
        }
      } else if (!isPolygon) {
        // this.game.context.arc((r * Math.sin(omega)) + starCenter.x, (r * Math.cos(omega)) + starCenter.y, 5, 0 , Math.PI * 2)
        this.trajectoryMovement.push({
          x: r * Math.sin(omega) + this.starCenter.x,
          y: r * Math.cos(omega) + this.starCenter.y,
        });
      }

      // this.game.context.arc((r * Math.sin(omega)) + starXY[0], (r * Math.cos(omega)) + starXY[1], 5, 0 , Math.PI * 2)
      // this.game.context.save();
      // context.globalAlpha = 0.5;
      // this.game.context.fillStyle = 'blue'
      // context.fill();
      // this.game.context.restore();
      // this.game.context.stroke()
    }
    // console.log(this.trajectoryMov)
    // this.game.context.closePath()
    // this.game.context.stroke()
  }

  BezierCurveMovement(currentPosition, point1Bezier, point2Bezier, endPoint) {
    let points = [currentPosition, point1Bezier, point2Bezier, endPoint];
    let [p0, p1, p2, p3] = points;
    //Calculate the coefficients based on where the ball currently is in the animation
    let cx = 3 * (p1.x - p0.x);
    let bx = 3 * (p2.x - p1.x) - cx;
    let ax = p3.x - p0.x - cx - bx;

    let cy = 3 * (p1.y - p0.y);
    let by = 3 * (p2.y - p1.y) - cy;
    let ay = p3.y - p0.y - cy - by;

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

    let xt =
      ax *
        (this.percentagePositionX *
          this.percentagePositionX *
          this.percentagePositionX) +
      bx * (this.percentagePositionX * this.percentagePositionX) +
      cx * this.percentagePositionX +
      p0.x;
    let yt =
      ay *
        (this.percentagePositionY *
          this.percentagePositionY *
          this.percentagePositionY) +
      by * (this.percentagePositionY * this.percentagePositionY) +
      cy * this.percentagePositionY +
      p0.y;

    // console.log(`The percentage of the movement in X is: ${this.percentagePositionX} and in Y: ${this.percentagePositionY}`)
    // console.log(`The speed in X is: ${Math.abs(this.collisionX - xt)} and in Y: ${Math.abs(this.collisionY - yt)}`)

    // this.collisionX = xt;
    // this.collisionY = yt;

    this.initialBezier.x = xt;
    this.initialBezier.y = yt;

    // console.log(Math.hypot(this.speedY, this.speedX))
    // console.log(`The percentage of the movement in X is: ${this.percentagePositionX} and in Y: ${this.percentagePositionY}`)
    // console.log(`The points are Ax: ${}`)
    // console.log(`The current position in X: ${this.collisionX} and in Y: ${this.collisionY}`)
    // if(ball.t > 1){
    //     ball.t=1;
    // }

    //We draw the ball to the canvas in the new location
    // ball.x = xt;
    // ball.y = yt;
    // drawBall();
  }

  lineMovement() {
    this.trajectoryMovement.push(this.initialLinePoint);
    for (let i = 1; i < 6; i++) {
      if (i >= 1 && this.left === false) {
        this.trajectoryMovement.push({
          x: this.trajectoryMovement[i - 1].x + 100,
          y: this.trajectoryMovement[i - 1].y,
        });
      } else if (i >= 1 && this.left === true) {
        this.trajectoryMovement.push({
          x: this.trajectoryMovement[i - 1].x - 100,
          y: this.trajectoryMovement[i - 1].y,
        });
      }
    }
    if (this.left === false) {
      this.left = true;
    } else if (this.left === true) {
      this.left = false;
    }
    this.initialLinePoint =
      this.trajectoryMovement[this.trajectoryMovement.length - 1];
  }

  // Possible movements: Following/Mirroring the player, Circle, Square, Triangle, Polygon, BezierCurve

  decideMovement() {
    // Algorithm to decide what movement is going to be performed.
    // let decideMovement = Math.floor(Math.random())
    // this.currentMovementDecision = 2;

    // this.currentMovementDecision = Math.floor(Math.random() * 3)
    // this.currentMovementDecision = this.movementOrder

    // this.currentMovementDecision = 1
    this.currentMovementDecision = 0;
    // Decide the parameters depending on the movement desired.

    if (this.currentMovementDecision == 0) {
      // Bezier Curve Parametrization

      // this.initialBezier = {x: this.collisionX, y: this.collisionY}
      // this.initialBezier = this.initialBezier_zero;
      this.trajectoryMovement.push(this.initialBezier);
      let times = 0;
      // Decide coordinates for the Bezier Curve based on a metric of length.
      // this.p1Bezier = {x:300, y:500}
      // this.p2Bezier = {x:425, y:295}
      // this.endBezier = {x:750, y:300}
      // Random decision on where to place the coordinates for the Bezier curve
      // this.p1Bezier = {x: Math.floor(Math.random() * this.game.width), y: Math.floor(Math.random() * this.game.height)}

      this.p1Bezier = {
        x: Math.floor(this.game.width / 4),
        y: Math.floor(this.game.height / 2),
      };

      // while (this.p1Bezier.x + this.collisionRadius + 50 > this.game.width || this.p1Bezier.x - this.collisionRadius - 50 < 0) {
      //     this.p1Bezier.x = Math.floor(Math.random() * this.game.width)
      //     times ++;
      // }
      // while (this.p1Bezier.y + this.collisionRadius + 50 > this.game.height || this.p1Bezier.y - this.collisionRadius - 50 < 0) {
      //     this.p1Bezier.y = Math.floor(Math.random() * this.game.height)
      //     times ++;
      // }

      // this.p2Bezier = {x: Math.floor(Math.random() * this.game.width), y: Math.floor(Math.random() * this.game.height)}

      this.p2Bezier = {
        x: Math.floor(this.game.width / 2),
        y: Math.floor(this.game.height / 2),
      };

      // while (this.p2Bezier.x + this.collisionRadius + 50 > this.game.width || this.p2Bezier.x - this.collisionRadius - 50 < 0) {
      //     this.p2Bezier.x = Math.floor(Math.random() * this.game.width)
      //     times ++;
      // }
      // while (this.p2Bezier.y + this.collisionRadius + 50> this.game.height || this.p2Bezier.y - this.collisionRadius - 50 < 0) {
      //     this.p1Bezier.y = Math.floor(Math.random() * this.game.height)
      //     times ++;
      // }

      // this.endBezier = {x: Math.floor(Math.random() * this.game.width), y: Math.floor(Math.random() * this.game.height)}

      this.endBezier = { x: 100, y: 600 };

      if (this.endBezier.x > this.game.width - this.collisionRadius - 20) {
        this.endBezier.x = this.game.width - this.collisionRadius - 20;
      } else if (this.endBezier.x < this.collisionRadius + 20) {
        this.endBezier.x = this.collisionRadius + 20;
      }

      if (this.endBezier.y > this.game.height - this.collisionRadius - 20) {
        this.endBezier.y = this.game.height - this.collisionRadius - 20;
      } else if (this.endBezier.y < this.collisionRadius + 20) {
        this.endBezier.y = this.collisionRadius + 20;
      }

      // while (this.endBezier.x  > this.game.width - this.collisionRadius - 20 || this.endBezier.x  <  this.collisionRadius + 20) {
      //     this.endBezier.x = Math.floor(Math.random() * this.game.width)
      //     times ++;
      // }
      // while (this.endBezier.y  > this.game.height - this.collisionRadius - 20 || this.endBezier.y < this.collisionRadius + 20) {
      //     this.endBezier.y = Math.floor(Math.random() * this.game.height)
      //     times ++;
      // }
      // this.endBezier = {x: Math.floor(Math.random() * this.game.width), y: Math.floor(Math.random() * this.game.height)}
      this.movementDecision = true;
      // console.log(`The beginning point is ${this.initialBezier.x} and ${this.initialBezier.y} and end point: ${this.endBezier.x} and ${this.endBezier.y}`)
      // console.log(`The width of the game is: ${this.game.width} and the height of the game: ${this.game.height}`)
      // console.log(`The amount of times in the method is: ${times}`)

      this.bezierMoveExecution();

      // Algorithm for better decision making...
    } else if (this.currentMovementDecision == 1) {
      // Development of a plane with straight lines. Maybe some curves because of the drag.

      // Polygon Parametrization
      // this.numberSides =  5;
      // this.size = 200;
      // this.totalAngle = (180 * (this.numberSides - 2)) * (Math.PI / 180);
      // this.initialPolygon = {x: this.collisionX, y: this.collisionY};
      //this.trajectoryMovementPolygon.push(this.initialPolygon)

      // Decisions for the parameters

      // Figure of the star or polygon
      // let random = Math.floor((Math.random() * 18) + 1)
      let random = 14;
      let alpha = (2 * Math.PI) / random;
      let numberPoints = random - 1;
      let radius = 50;
      // this.starCenter.x = Math.random() * this.game.width
      this.starCenter.x = this.game.width / 2;
      // while (this.starCenter.x- radius < 0 || this.starCenter.x + radius > this.game.width) {
      //     this.starCenter.x = Math.random() * this.game.width
      // }
      // this.starCenter.y = Math.random() * this.game.height
      this.starCenter.y = this.game.height / 2;
      // while (this.starCenter.y - radius < 0 || this.starCenter.y + radius > this.game.height) {
      //     this.starCenter.y = Math.random() * this.game.height
      // }

      if (
        this.starCenter.x >
        this.game.width - radius - this.collisionRadius - 20
      ) {
        this.starCenter.x =
          this.game.width - radius - this.collisionRadius - 20;
      } else if (this.starCenter.x < this.collisionRadius + radius + 20) {
        this.starCenter.x = this.collisionRadius + radius + 20;
      }

      if (
        this.starCenter.y >
        this.game.height - radius - this.collisionRadius - 20
      ) {
        this.starCenter.y =
          this.game.height - radius - this.collisionRadius - 20;
      } else if (this.starCenter.y < this.collisionRadius + radius + 20) {
        this.starCenter.y = this.collisionRadius + radius + 20;
      }
      // console.log(this.starCenter)
      // console.log(`The width of the game is: ${this.game.width} and the height of the game is: ${this.game.height}`)
      // console.log(`The requirement for width is: ${this.starCenter.x - radius}`)
      // let starCenter = {x: this.collisionX, y: this.collisionY};
      let isPolygon = true;
      this.starMovement(alpha, radius, isPolygon, numberPoints);
    } else if (this.currentMovementDecision == 2) {
      // Circle Drawing
      this.radius = (Math.random() * this.game.height) / 4;

      this.center.x = Math.random() * this.game.width;
      while (
        this.center.x - this.radius - 50 < 0 ||
        this.center.x + this.radius + 50 > this.game.width
      ) {
        this.center.x = Math.random() * this.game.width;
      }
      this.center.y = Math.random() * this.game.height;
      while (
        this.center.y - this.radius - 50 < 0 ||
        this.center.y + this.radius + 50 > this.game.height
      ) {
        this.center.y = Math.random() * this.game.height;
      }

      this.initialAngle = 0;
      this.circleMovement();
      // console.log(this.center)
    } else if (this.currentMovementDecision == 3) {
      // Line Movement
      this.lineMovement();
    } else if (this.currentMovementDecision == 4) {
      // Wait for player to move
    }
  }

  bezierMoveExecution() {
    while (this.paintMovementDecision) {
      // this.speedX = 0.1;
      // this.speedY = 0.1;
      this.percentageSpeedX = 0.1;
      this.percentageSpeedY = 0.1;
      // console.log(`The speed of X: ${this.speedX} and of Y: ${this.speedY}`)
      // console.log(`The coordinates of the agent are in X: ${this.collisionX} and Y: ${this.collisionY}`)
      this.BezierCurveMovement(
        this.initialBezier,
        this.p1Bezier,
        this.p2Bezier,
        this.endBezier
      );
      if (
        this.initialBezier.x <= this.game.width - this.collisionRadius &&
        this.initialBezier.x >= this.collisionRadius &&
        this.initialBezier.y <= this.game.width - this.collisionRadius &&
        this.initialBezier.y >= this.collisionRadius
      ) {
        this.trajectoryMovement.push({
          x: this.initialBezier.x,
          y: this.initialBezier.y,
        });
        // console.log(`The bezier point is: ${this.initialBezier.x} and ${this.initialBezier.y}`)
      } else {
        // console.log(`The last point was: ${this.initialBezier.x} and ${this.initialBezier.y}`)
        this.percentagePositionX = 1;
        this.percentagePositionY = 1;
      }

      // console.log(`The current position in X: ${this.collisionX} and in Y: ${this.collisionY}`)
      if (this.percentagePositionX >= 1 && this.percentagePositionY >= 1) {
        this.currentMovementDecision = 3;
        this.percentagePositionX = 0;
        this.percentagePositionY = 0;
        this.paintMovementDecision = false;
        this.percentageSpeedX = 0;
        this.percentageSpeedY = 0;
        this.trajectoryMovement.pop();
        this.trajectoryMovement.push({
          x: this.endBezier.x,
          y: this.endBezier.y,
        });
        // console.log(this.points)
      }
    }
    this.trajectoryMovement.shift();
    this.initialBezier = {
      x: this.game.width * 0.5,
      y: this.game.height * 0.5,
    };

    // console.log(this.trajectoryMovement)
  }

  characterizationOfMovement() {}

  defineMagnitude(x, y) {
    return Math.sqrt(x ** 2 + y ** 2);
  }

  normalize(x, y) {
    let m = this.defineMagnitude(x, y);
    if (m > 0) {
      return { x: x / m, y: y / m };
    }
    if (m === 0) {
      return { x: 0, y: 0 };
    }
  }

  // velocityProfile(){

  // }

  accelerate() {
    let force = {
      x: this.target.x - this.collisionX,
      y: this.target.y - this.collisionY,
    };
    let accelerationRadius = 50;
    let d = this.defineMagnitude(force.x, force.y);

    if (d > accelerationRadius) {
      let desiredSpeed = this.mapRange(
        0,
        d,
        accelerationRadius,
        0,
        this.maxSpeed
      );
      force = this.normalize(force.x, force.y);
      force.x = force.x * desiredSpeed;
      force.y = force.y * desiredSpeed;
    } else {
      force = this.normalize(force.x, force.y);
      force.x = force.x * this.maxSpeed;
      force.y = force.y * this.maxSpeed;
    }

    force = { x: force.x - this.speedX, y: force.y - this.speedY };

    if (force.x > this.maxForce) {
      force.x = this.maxForce;
    } else if (force.x < -this.maxForce) {
      force.x = -this.maxForce;
    }

    if (force.y > this.maxForce) {
      force.y = this.maxForce;
    } else if (force.y < -this.maxForce) {
      force.y = -this.maxForce;
    }

    return force;
  }

  arrive() {
    let force = {
      x: this.target.x - this.collisionX,
      y: this.target.y - this.collisionY,
    };
    let slowRadius = 100;
    let d = this.defineMagnitude(force.x, force.y);

    if (d < slowRadius) {
      let desiredSpeed = this.mapRange(d, 0, slowRadius, 0, this.maxSpeed);
      force = this.normalize(force.x, force.y);
      force.x = force.x * desiredSpeed;
      force.y = force.y * desiredSpeed;
    } else {
      force = this.normalize(force.x, force.y);
      force.x = force.x * this.maxSpeed;
      force.y = force.y * this.maxSpeed;
    }

    // force = normalize(force.x, force.y)
    // force.x = force.x * this.maxSpeed
    // force.y = force.y * this.maxSpeed

    force = { x: force.x - this.speedX, y: force.y - this.speedY };

    if (force.x > this.maxForce) {
      force.x = this.maxForce;
    } else if (force.x < -this.maxForce) {
      force.x = -this.maxForce;
    }

    if (force.y > this.maxForce) {
      force.y = this.maxForce;
    } else if (force.y < -this.maxForce) {
      force.y = -this.maxForce;
    }

    return force;
  }

  seek(arrival = false) {
    let force = {
      x: this.target.x - this.collisionX,
      y: this.target.y - this.collisionY,
    };
    force = this.normalize(force.x, force.y);
    force.x = force.x * this.maxSpeed;
    force.y = force.y * this.maxSpeed;

    force = { x: force.x - this.speedX, y: force.y - this.speedY };

    if (force.x > this.maxForce) {
      force.x = this.maxForce;
    } else if (force.x < -this.maxForce) {
      force.x = -this.maxForce;
    }

    if (force.y > this.maxForce) {
      force.y = this.maxForce;
    } else if (force.y < -this.maxForce) {
      force.y = -this.maxForce;
    }

    return force;
  }

  SecondOrderDynamics(f, z, r, x0) {
    // Compute constants
    this.k1 = z / (Math.PI * f);
    this.k2 = 1 / (2 * Math.PI * f * (2 * Math.PI * f));
    this.k3 = (r * z) / (2 * Math.PI * f);
    // Initialize Variables
    this.previousInput = x0;
    this.outputVectorY = x0;
    this.outputVectorYVel = { x: 0, y: 0 };
  }

  followerMovement(socket, room, slider) {
    // this.target = {x: this.player.collisionX, y: this.player.collisionY}
    if (
      (this.player.movementDecision ||
        (!this.player.movementDecision &&
          this.defineMagnitude(
            this.target.x - this.collisionX,
            this.target.y - this.collisionY
          ) <= 20)) &&
      !this.movementDecision
    ) {
      this.target = { x: this.player.collisionX, y: this.player.collisionY };
      let steering = this.seek();

      this.moveErrorX = Math.abs(getNormallyDistributedRandomNumber(0, 1));
      this.moveErrorY = Math.abs(getNormallyDistributedRandomNumber(0, 1));
      this.applyForce(steering);

      this.speedX += this.accX;
      this.speedY += this.accY;
      this.collisionX += this.speedX * this.moveErrorX;
      this.collisionY += this.speedY * this.moveErrorY;

      this.accX = 0;
      this.accY = 0;
    } else {
      // CONDITION TO SEE IF THE AGENT DECIDED ON A MOVEMENT
      this.prevMoveDec = this.movementDecision;
      if (!this.movementDecision) {
        this.paintMovementDecision = true;
        this.decideMovement();
        socket.emit(
          "movementDecisionAgent",
          room,
          this.maxSpeed,
          this.trajectoryMovement.length - 1
        );

        this.movementOrder++;
        if (this.movementOrder > 3) {
          this.movementOrder = 0;
        }
        this.movementDecision = true;
        this.movementCounter++;
        this.target = this.trajectoryMovement[this.counterTarget];
        if (this.velocityProfile[this.counterTarget] !== undefined) {
          this.speedXPoint = this.velocityProfile[this.counterTarget];
          this.speedYPoint = this.velocityProfile[this.counterTarget];
          // console.log(`The speed at point X: ${this.speedXPoint} and Y: ${this.speedYPoint}`)
        }
      }

      // CONDITION TO SEE IF THE AGENT ARRIVED TO THE TARGET POINT
      if (
        Math.abs(Math.floor(this.collisionX) - Math.floor(this.target.x)) <=
          20 &&
        Math.abs(Math.floor(this.collisionY) - Math.floor(this.target.y)) <= 20
      ) {
        this.hasArrived = true;
        // console.log('Is the same position as target')
      }

      // CHANGE THE TARGET TO A NEW TARGET
      if (this.hasArrived === true) {
        this.counterTarget++;
        if (this.counterTarget < this.trajectoryMovement.length) {
          this.target = this.trajectoryMovement[this.counterTarget];
          if (this.velocityProfile[this.counterTarget] !== undefined) {
            this.speedXPoint = this.velocityProfile[this.counterTarget].y;
            this.speedYPoint = this.velocityProfile[this.counterTarget].y;
          }
          // console.log(this.velocityProfile[this.counterTarget])
          // this.speedXPoint = this.velocityProfile[this.counterTarget].y
          // this.speedYPoint = this.velocityProfile[this.counterTarget].y
          this.moveErrorX = Math.abs(getNormallyDistributedRandomNumber(0, 1));
          this.moveErrorY = Math.abs(getNormallyDistributedRandomNumber(0, 1));
        }

        if (this.counterTarget >= this.trajectoryMovement.length) {
          this.counterTarget = 0;
          this.movementDecision = false;
          this.trajectoryMovement = [];
          this.speedXPoint = 0;
          this.speedYPoint = 0;
          this.velocityProfile = [];
          this.moveErrorX = Math.abs(getNormallyDistributedRandomNumber(0, 1));
          this.moveErrorY = Math.abs(getNormallyDistributedRandomNumber(0, 1));
        }
        // console.log(this.target)
        this.hasArrived = false;
      }

      // FORCE DEFINITION AND APPLICATION TO GO TO THE CURRENT TARGET
      let steering = this.seek();

      this.applyForce(steering);

      // this.frequency = value;

      let currentInput = { x: this.seek().x, y: this.seek().y };
      let nextInput = {
        x: this.seek().x + this.speedX,
        y: this.seek().y + this.speedY,
      };
      // if (nextInput == null) { // Estimate velocity
      nextInput.x = (currentInput.x - this.previousInput.x) / 16.66;
      nextInput.y = (currentInput.y - this.previousInput.y) / 16.66;
      this.previousInput = currentInput;
      // }
      this.frequency = 10;
      let sliderValue = slider;
      // console.log(`The value of the slider is: ${sliderValue}`)
      this.SecondOrderDynamics(this.frequency, 7, 20, nextInput);

      this.outputVectorY.x = this.outputVectorY.x + this.outputVectorYVel.x; // integrate position by velocity
      this.outputVectorYVel.x =
        this.outputVectorYVel.x +
        (currentInput.x +
          this.k3 * nextInput.x -
          this.outputVectorY.x -
          this.k1 * this.outputVectorYVel.x); // Integrate velocity by acceleration

      this.outputVectorY.y = this.outputVectorY.y + this.outputVectorYVel.y; // integrate position by velocity
      this.outputVectorYVel.y =
        this.outputVectorYVel.y +
        (currentInput.y +
          this.k3 * nextInput.y -
          this.outputVectorY.y -
          this.k1 * this.outputVectorYVel.y); // Integrate velocity by acceleration

      this.previousInput.x = steering.x;
      this.previousInput.y = steering.y;

      this.speedX += this.accX + this.outputVectorY.x;
      this.speedY += this.accY + this.outputVectorY.y;

      this.prevAccX = this.accX;
      this.prevAccY = this.accY;

      if (this.speedX > this.maxSpeed) {
        this.speedX = this.maxSpeed;
        // console.log('Entered in Speed X')
      } else if (this.speedX < -this.maxSpeed) {
        this.speedX = -this.maxSpeed;
      }

      if (this.speedY > this.maxSpeed) {
        this.speedY = this.maxSpeed;
        // console.log('Entered in Speed Y')
      } else if (this.speedY < -this.maxSpeed) {
        this.speedY = -this.maxSpeed;
      }

      let distancePoints = this.defineMagnitude(
        this.target.x - this.collisionX,
        this.target.y - this.collisionY
      );

      if (steering.x < 0) {
        this.speedXPoint = -this.speedXPoint;
      } else {
        this.speedXPoint = this.speedXPoint;
      }

      if (steering.y < 0) {
        this.speedYPoint = -this.speedYPoint;
      } else {
        this.speedYPoint = this.speedYPoint;
      }

      this.moveErrorX = 0;
      this.moveErrorY = 0;

      if (this.velocityProfile[this.counterTarget] !== undefined) {
        // this.speedX += this.accX + this.speedX * (this.speedXPoint/this.maxSpeed)
        // this.speedY += this.accY + this.speedY *  (this.speedYPoint/this.maxSpeed)
        // console.log(`The speed X: ${this.speedX} and speedY: ${this.speedY}`)
        // console.log(`The speed in X: ${this.speedXPoint} and the speed in Y: ${this.speedYPoint}`)
      }

      this.collisionX += this.speedX;
      this.collisionY += this.speedY;

      this.accX = 0;
      this.accY = 0;
    }
  }

  LeaderMovement(socket, room, slider) {
    this.prevMoveDec = this.movementDecision;

    if (!this.movementDecision) {
      // console.log('ENTERED THE FUNCTION')
      // Choose a movement to do
      this.paintMovementDecision = true;
      this.decideMovement();
      socket.emit(
        "movementDecisionAgent",
        room,
        this.maxSpeed,
        this.trajectoryMovement.length - 1
      );

      this.movementOrder++;
      if (this.movementOrder > 3) {
        this.movementOrder = 0;
      }
      this.movementDecision = true;
      this.movementCounter++;
      this.target = this.trajectoryMovement[this.counterTarget];
      // console.log(`The target is X: ${this.target.x} and Y: ${this.target.y}`)
      if (this.velocityProfile[this.counterTarget] !== undefined) {
        this.speedXPoint = this.velocityProfile[this.counterTarget];
        this.speedYPoint = this.velocityProfile[this.counterTarget];
        // console.log(`The speed at point X: ${this.speedXPoint} and Y: ${this.speedYPoint}`)
      }

      // console.log('Initial Target')
      // console.log(this.target)
    }

    if (
      Math.abs(Math.floor(this.collisionX) - Math.floor(this.target.x)) <= 20 &&
      Math.abs(Math.floor(this.collisionY) - Math.floor(this.target.y)) <= 20
    ) {
      this.hasArrived = true;
      // console.log('Is the same position as target')
    }

    if (this.hasArrived === true) {
      this.counterTarget++;
      if (this.counterTarget < this.trajectoryMovement.length) {
        this.target = this.trajectoryMovement[this.counterTarget];
        if (this.velocityProfile[this.counterTarget] !== undefined) {
          this.speedXPoint = this.velocityProfile[this.counterTarget].y;
          this.speedYPoint = this.velocityProfile[this.counterTarget].y;
        }
        // console.log(this.velocityProfile[this.counterTarget])
        // this.speedXPoint = this.velocityProfile[this.counterTarget].y
        // this.speedYPoint = this.velocityProfile[this.counterTarget].y
        this.moveErrorX = Math.abs(getNormallyDistributedRandomNumber(0, 1));
        this.moveErrorY = Math.abs(getNormallyDistributedRandomNumber(0, 1));
      }

      if (this.counterTarget >= this.trajectoryMovement.length) {
        this.counterTarget = 0;
        this.movementDecision = false;
        this.trajectoryMovement = [];
        this.speedXPoint = 0;
        this.speedYPoint = 0;
        this.velocityProfile = [];
        this.moveErrorX = Math.abs(getNormallyDistributedRandomNumber(0, 1));
        this.moveErrorY = Math.abs(getNormallyDistributedRandomNumber(0, 1));
      }
      // console.log(this.target)
      this.hasArrived = false;
      // console.log('This should have entered')
      // console.log(this.hasArrived)
    }

    let steering = this.seek();

    this.applyForce(steering);

    // this.frequency = value;

    let currentInput = { x: this.seek().x, y: this.seek().y };
    let nextInput = {
      x: this.seek().x + this.speedX,
      y: this.seek().y + this.speedY,
    };
    // if (nextInput == null) { // Estimate velocity
    nextInput.x = (currentInput.x - this.previousInput.x) / 16.66;
    nextInput.y = (currentInput.y - this.previousInput.y) / 16.66;
    this.previousInput = currentInput;
    // }
    this.frequency = 10;
    // console.log(value)
    let sliderValue = slider;
    // console.log(Number.isInteger(sliderValue))
    // this.frequency = sliderValue;
    // console.log(`The value of the slider is: ${sliderValue}`)
    this.SecondOrderDynamics(this.frequency, 7, 20, nextInput);

    this.outputVectorY.x = this.outputVectorY.x + this.outputVectorYVel.x; // integrate position by velocity
    this.outputVectorYVel.x =
      this.outputVectorYVel.x +
      (currentInput.x +
        this.k3 * nextInput.x -
        this.outputVectorY.x -
        this.k1 * this.outputVectorYVel.x); // Integrate velocity by acceleration

    this.outputVectorY.y = this.outputVectorY.y + this.outputVectorYVel.y; // integrate position by velocity
    this.outputVectorYVel.y =
      this.outputVectorYVel.y +
      (currentInput.y +
        this.k3 * nextInput.y -
        this.outputVectorY.y -
        this.k1 * this.outputVectorYVel.y); // Integrate velocity by acceleration

    // console.log(`The value is: ${this.outputVectorY.x} and ${this.outputVectorY.y}`)
    // console.log(`The value of the speed is: ${this.outputVectorYVel.x} and ${this.outputVectorYVel.y}`)

    // console.log(`The values of the constants are k1: ${this.k1} k2:${this.k2} k3:${this.k3}`)

    this.previousInput.x = steering.x;
    this.previousInput.y = steering.y;

    // this.speedX += this.accX + this.outputVectorY.x
    // this.speedY += this.accY + this.outputVectorY.y

    this.speedX += this.accX;
    this.speedY += this.accY;

    console.log(`The speed  X is: ${this.speedX} and Y: ${this.speedY}`);

    this.prevAccX = this.accX;
    this.prevAccY = this.accY;

    if (this.speedX > this.maxSpeed) {
      this.speedX = this.maxSpeed;
      // console.log('Entered in Speed X')
    } else if (this.speedX < -this.maxSpeed) {
      this.speedX = -this.maxSpeed;
    }

    if (this.speedY > this.maxSpeed) {
      this.speedY = this.maxSpeed;
      // console.log('Entered in Speed Y')
    } else if (this.speedY < -this.maxSpeed) {
      this.speedY = -this.maxSpeed;
    }

    let distancePoints = this.defineMagnitude(
      this.target.x - this.collisionX,
      this.target.y - this.collisionY
    );

    if (steering.x < 0) {
      this.speedXPoint = -this.speedXPoint;
    } else {
      this.speedXPoint = this.speedXPoint;
    }

    if (steering.y < 0) {
      this.speedYPoint = -this.speedYPoint;
    } else {
      this.speedYPoint = this.speedYPoint;
    }

    this.collisionX += this.speedX;
    this.collisionY += this.speedY;
  }

  update(random, targetX, targetY, socket, room, slider) {
    if (this.follower) {
      // this.target = {x: this.player.collisionX, y: this.player.collisionY}
      this.followerMovement(socket, room, slider);
    } else {
      this.LeaderMovement(socket, room, slider);
      //     let steering = this.seek()

      //     this.applyForce(steering)

      //     // this.frequency = value;

      //     let currentInput = {x:this.seek().x, y: this.seek().y}
      //     let nextInput = {x: this.seek().x + this.speedX, y: this.seek().y + this.speedY};
      // // if (nextInput == null) { // Estimate velocity
      //     nextInput.x = (currentInput.x - this.previousInput.x)/16.66;
      //     nextInput.y = (currentInput.y - this.previousInput.y)/16.66;
      //     this.previousInput = currentInput;
      // // }
      //     this.frequency = 10;
      //     // console.log(value)
      //     let sliderValue = slider;
      //     // console.log(Number.isInteger(sliderValue))
      //     // this.frequency = sliderValue;
      //     console.log(`The value of the slider is: ${sliderValue}`)
      //     this.SecondOrderDynamics(this.frequency, 7, 20, nextInput);

      //     this.outputVectorY.x = this.outputVectorY.x + this.outputVectorYVel.x; // integrate position by velocity
      //     this.outputVectorYVel.x = this.outputVectorYVel.x + (currentInput.x + this.k3 * nextInput.x - this.outputVectorY.x - this.k1 * this.outputVectorYVel.x) // Integrate velocity by acceleration

      //     this.outputVectorY.y = this.outputVectorY.y + this.outputVectorYVel.y; // integrate position by velocity
      //     this.outputVectorYVel.y = this.outputVectorYVel.y + (currentInput.y + this.k3*nextInput.y - this.outputVectorY.y - this.k1 * this.outputVectorYVel.y) // Integrate velocity by acceleration

      //     // console.log(`The value is: ${this.outputVectorY.x} and ${this.outputVectorY.y}`)
      //     // console.log(`The value of the speed is: ${this.outputVectorYVel.x} and ${this.outputVectorYVel.y}`)

      //     // console.log(`The values of the constants are k1: ${this.k1} k2:${this.k2} k3:${this.k3}`)

      //     this.previousInput.x = steering.x;
      //     this.previousInput.y = steering.y;

      //     // console.log(this.hasArrived)

      //     // console.log(`The dx: ${this.collisionX - this.target.x} and dy: ${this.collisionY - this.target.y}`)

      //     // let force = this.seek(target)
      //     // console.log(`The steering force is: ${force.x} and ${force.y}`)
      //     // this.applyForce(force)

      //     // let force = {x: this.target.x - this.collisionX, y: this.target.y - this.collisionY}

      //     // let desiredSpeed = this.maxSpeed

      //     // let desiredSpeed = {x: 0, y: 0}

      //     // let slowRadius = 100

      //     // let distance =  Math.hypot(force.x, force.y)

      //     // if (distance < slowRadius) {
      //         // desiredSpeed = {x: this.mapRange(distance, 0, slowRadius, 0, this.maxSpeed), y: this.mapRange(distance, 0, slowRadius, 0, this.maxSpeed)}
      //     //    desiredSpeed = this.mapRange(distance, 0, slowRadius, 0, this.maxSpeed)
      //     // } else {
      //     //     desiredSpeed = 1
      //     // }

      //     // console.log(` The desired speed is ${desiredSpeed.x} and ${desiredSpeed.y}`)
      //     // let variable = this.mapRange(distance, 0, slowRadius, 0, this.maxSpeed)
      //     // console.log(variable)

      //     // let lengthVector = Math.sqrt(((force.x ** 2) - 0) + ((force.y ** 2) - 0))
      //     // let lengthVector =  Math.hypot(force.x, force.y)
      //     // force.x = force.x / lengthVector;
      //     // force.y = force.y / lengthVector;

      //     // force.x = force.x * desiredSpeed;
      //     // force.y = force.y * desiredSpeed;

      //     // console.log(`The force in x is: ${force.x} and in y: ${force.y}`)

      //     // if (this.speedX === 0 && this.speedY === 0) {
      //     //     this.timerDecision ++
      //     // }

      //     // if (this.speedX !== 0 || this.speedY !== 0) {
      //     //     this.timerDecision = 0
      //     //     this.movementDecision = true
      //     // }

      //     // if (this.timerDecision >= 1) {
      //     //     this.movementDecision = false
      //     //     // console.log(`The movement was registered as a stop.`)
      //     // }

      // // console.log(steering)

      // // console.log(`The acceleration in X is: ${this.accX} and in Y: ${this.accY}`)
      // // this.accX = this.target.x - this.collisionX
      // // this.accY = this.target.y - this.collisionY

      // // if (this.accX > this.maxAcceleration) {
      // //     this.accX = this.maxAcceleration;
      // // } else if (this.accX < -this.maxAcceleration) {
      // //     this.accX = - this.maxAcceleration;
      // // }
      // // if (this.accY > this.maxAcceleration) {
      // //     this.accY = this.maxAcceleration;
      // // } else if (this.accY < -this.maxAcceleration) {
      // //     this.accY = - this.maxAcceleration;
      // // }

      // // if (this.accX > this.maxAcceleration) {
      // //     this.accX = Math.floor(Math.random() * this.maxAcceleration)
      // // }

      // // if (this.accY > this.maxAcceleration) {
      // //     this.accY = Math.floor(Math.random() * this.maxAcceleration)
      // // }

      // this.speedX += this.accX + this.outputVectorY.x
      // this.speedY += this.accY + this.outputVectorY.y

      // // this.speedX += this.outputVectorY.x;
      // // this.speedY += this.outputVectorY.y;

      // // this.speedX = 1;
      // // this.speedY = 0;

      // // this.speedX += this.accX
      // // this.speedY += this.accY

      // // console.log(`The speed in x: ${this.outputVectorY.x} and in y: ${this.outputVectorY.y}`)

      // this.prevAccX = this.accX
      // this.prevAccY = this.accY

      // // this.speedX = this.target.x - this.collisionX
      // // this.speedY = this.target.y - this.collisionY

      // // this.speedX = this.speedX / 20
      // // this.speedY = this.speedY / 20

      // if (this.speedX > this.maxSpeed) {
      //     this.speedX = this.maxSpeed
      //     // console.log('Entered in Speed X')
      // } else if (this.speedX < -this.maxSpeed){
      //     this.speedX = -this.maxSpeed
      // }

      // if (this.speedY > this.maxSpeed) {
      //     this.speedY = this.maxSpeed
      //     // console.log('Entered in Speed Y')
      // } else if (this.speedY < -this.maxSpeed){
      //     this.speedY = -this.maxSpeed
      // }

      // let distancePoints = this.defineMagnitude(this.target.x - this.collisionX, this.target.y - this.collisionY);

      // // if (distancePoints >= 200) {
      // //     this.moveErrorX = 0;
      // //     this.moveErrorY = 0;
      // // }

      // // console.log(`The force is: ${steering.x} and in Y: ${steering.y}`)

      // if (steering.x < 0) {
      //     this.speedXPoint = - this.speedXPoint;
      // } else {
      //     this.speedXPoint = this.speedXPoint;
      // }

      // if (steering.y < 0) {
      //     this.speedYPoint = - this.speedYPoint;
      // } else {
      //     this.speedYPoint = this.speedYPoint;
      // }
    }

    // socket.on('movementVelocityProfile', (speedAcc, speedDecc) => {
    //     this.velocityProfile = speedAcc;
    //     console.log(this.velocityProfile)
    // })
    // console.log(this.velocityProfile)
    // this.prevMoveDec = this.movementDecision;

    // if (!this.movementDecision) {
    //     // console.log('ENTERED THE FUNCTION')
    //     // Choose a movement to do
    //     this.paintMovementDecision = true;
    //     this.decideMovement();
    //     socket.emit('movementDecisionAgent', room, this.maxSpeed, this.trajectoryMovement.length - 1);

    //     this.movementOrder ++
    //     if (this.movementOrder > 3) {
    //         this.movementOrder = 0
    //     }
    //     this.movementDecision = true;
    //     this.movementCounter ++
    //     this.target = this.trajectoryMovement[this.counterTarget]
    //     if (this.velocityProfile[this.counterTarget] !== undefined) {
    //         this.speedXPoint = this.velocityProfile[this.counterTarget]
    //         this.speedYPoint = this.velocityProfile[this.counterTarget]
    //         // console.log(`The speed at point X: ${this.speedXPoint} and Y: ${this.speedYPoint}`)
    //     }

    //     // console.log('Initial Target')
    //     // console.log(this.target)
    // }

    // // console.log(`The points are: ${this.collisionX} and ${this.collisionY}`)

    // // Algorithm for following the targets defined by the path.

    // // if (this.currentMovementDecision == 0) {

    //     // this.bezierMoveExecution()
    //     // if (this.movementDecision) {
    //     //     // this.speedX = 0.1;
    //     //     // this.speedY = 0.1;
    //     //     this.percentageSpeedX = 0.12;
    //     //     this.percentageSpeedY = 0.12;
    //     //     // console.log(`The speed of X: ${this.speedX} and of Y: ${this.speedY}`)
    //     //     // console.log(`The coordinates of the agent are in X: ${this.collisionX} and Y: ${this.collisionY}`)
    //     //     this.BezierCurveMovement(this.initialBezier, this.p1Bezier, this.p2Bezier, this.endBezier)
    //     //     this.trajectoryMovement.push({x:this.initialBezier.x, y: this.initialBezier.y})
    //     //     // console.log(`The current position in X: ${this.collisionX} and in Y: ${this.collisionY}`)
    //     //     if (this.percentagePositionX >= 1 || this.percentagePositionY >= 1) {
    //     //         this.currentMovementDecision = 3;
    //     //         this.percentagePositionX = 0;
    //     //         this.percentagePositionY = 0;
    //     //         this.movementDecision = true;
    //     //         this.percentageSpeedX = 0;
    //     //         this.percentageSpeedY = 0;
    //     //         // console.log(this.points)
    //     //     }

    //     // }

    // // } else if (this.currentMovementDecision == 1) {

    // //     if (this.movementDecision) {
    //         // this.percentageSpeedX = 0.12;
    //         // this.percentageSpeedY = 0.12;
    //         // if (this.currentSide < this.numberSides) {
    //         //     this.polygonMovement(this.currentSide)
    //         //     this.currentSide++;
    //         //     // console.log(this.currentSide)
    //         // } else {
    //         //     this.currentSide = 0;
    //         //     this.currentMovementDecision = 3;
    //         //     this.movementDecision = true;
    //         //     // console.log(this.trajectoryMovementPolygon)
    //         //     // console.log(this.totalAngle)
    //         //     console.log(this.trajectoryMovementPolygon)
    //         // }
    //         // this.polygonMovement()
    //         // console.log(this.trajectoryMovementPolygon)
    //         // this.currentMovementDecision = 3;
    //         // this.movementDecision = true;

    //     // }

    // // } else if (this.currentMovementDecision == 2) {
    //      // this.circlePoints.push(this.circleMovement());
    //      // console.log(this.currentAngle)

    //     //  if (this.currentAngle >= 20) {
    //         // this.currentMovementDecision = 3;
    //     //  }
    // // }
    // // console.log(`The Width of the game is: ${this.game.width} and the height is: ${this.game.height}`)
    // // let targetxdim = targetX
    // // let targetydim = targetY
    // // console.log(`The target of the agent is: ${targetX} and ${targetY}`)
    // // console.log(`The collision in X is: ${this.collisionX} and in Y: ${this.collisionY}`)
    // // console.log(`The dx is: ${targetX - this.collisionX} and dy: ${targetY - this.collisionY}`)
    // // console.log(`The dx is: ${this.dx} and dy: ${this.dy}`)
    // // this.dx = targetxdim - this.collisionX
    // // this.dx = targetydim - this.collisionY
    // // this.dy++

    // //Mirroring and not the player
    // // if (random >= 0.5) {
    // //     this.dx = -this.player.dx
    // //     this.dy =  -this.player.dy
    // // } else {
    // //     this.dx = this.player.dx
    // //     this.dy =  this.player.dy
    // // }

    // // this.collisionX = 200
    // // this.collisionY = 200
    // // this.dx = random
    // // this.dy = random
    // // this.dx = targetX

    // // this.dx = this.player.dx;
    // // this.dy = this.player.dy;
    // // this.dx = (targetX) - this.collisionX;
    // // this.dy = (targetY) - this.collisionY;
    // // console.log(this.collisionX)
    //  // console.log(`The value of the dx is: ${this.dx} and of dy is: ${this.dy}`)
    // // Constant speed
    // // const distance = Math.hypot(this.dy, this.dx);
    // // this.speedX = this.dx/distance || 0;
    // // this.speedY = this.dy/distance || 0;

    // // Create a Curve with a movement

    // // let target = {x: 300, y: 300}
    // // console.log(this.counterTarget)

    // // console.log(`The current target in X: ${this.target.x} and in Y: ${this.target.y}`)
    // // console.log(`The center of the movement in X: ${this.starCenter.x} and in Y: ${this.starCenter.y}`)

    // if (Math.abs(Math.floor(this.collisionX) - Math.floor(this.target.x)) <= 20 && Math.abs(Math.floor(this.collisionY) - Math.floor(this.target.y)) <= 20) {
    //     this.hasArrived = true;
    //     // console.log('Is the same position as target')
    // }

    // // if (Math.floor(this.collisionX) + 10 == Math.floor(this.target.x) || Math.floor(this.collisionX) - 10 == Math.floor(this.target.x)  &&
    // // (Math.floor(this.collisionY) + 10 == Math.floor(this.target.y) || Math.floor(this.collisionY) - 10 == Math.floor(this.target.y))) {
    // //     this.hasArrived = true;
    // //     console.log('Is the same position as target')
    // // }

    // if (this.hasArrived === true) {
    //     this.counterTarget++
    //     if (this.counterTarget < this.trajectoryMovement.length) {
    //         this.target = this.trajectoryMovement[this.counterTarget]
    //         if (this.velocityProfile[this.counterTarget] !== undefined) {
    //             this.speedXPoint = this.velocityProfile[this.counterTarget].y
    //             this.speedYPoint = this.velocityProfile[this.counterTarget].y
    //         }
    //         // console.log(this.velocityProfile[this.counterTarget])
    //         // this.speedXPoint = this.velocityProfile[this.counterTarget].y
    //         // this.speedYPoint = this.velocityProfile[this.counterTarget].y
    //         this.moveErrorX = Math.abs(getNormallyDistributedRandomNumber(0,1));
    //         this.moveErrorY = Math.abs(getNormallyDistributedRandomNumber(0, 1));
    //     }

    //     if (this.counterTarget >= this.trajectoryMovement.length) {
    //         this.counterTarget = 0;
    //         this.movementDecision = false;
    //         this.trajectoryMovement = []
    //         this.speedXPoint = 0;
    //         this.speedYPoint = 0;
    //         this.velocityProfile = []
    //         this.moveErrorX = Math.abs(getNormallyDistributedRandomNumber(0,1));
    //         this.moveErrorY = Math.abs(getNormallyDistributedRandomNumber(0, 1));
    //     }
    //     // console.log(this.target)
    //     this.hasArrived = false
    //     // console.log('This should have entered')
    //     // console.log(this.hasArrived)
    // }

    // let steering = this.seek()

    // this.applyForce(steering)

    // // this.frequency = value;

    // let currentInput = {x:this.seek().x, y: this.seek().y}
    // let nextInput = {x: this.seek().x + this.speedX, y: this.seek().y + this.speedY};
    // // if (nextInput == null) { // Estimate velocity
    //     nextInput.x = (currentInput.x - this.previousInput.x)/16.66;
    //     nextInput.y = (currentInput.y - this.previousInput.y)/16.66;
    //     this.previousInput = currentInput;
    // // }
    // this.frequency = 10;
    // // console.log(value)
    // let sliderValue = slider;
    // // console.log(Number.isInteger(sliderValue))
    // // this.frequency = sliderValue;
    // console.log(`The value of the slider is: ${sliderValue}`)
    // this.SecondOrderDynamics(this.frequency, 7, 20, nextInput);

    // this.outputVectorY.x = this.outputVectorY.x + this.outputVectorYVel.x; // integrate position by velocity
    // this.outputVectorYVel.x = this.outputVectorYVel.x + (currentInput.x + this.k3 * nextInput.x - this.outputVectorY.x - this.k1 * this.outputVectorYVel.x) // Integrate velocity by acceleration

    // this.outputVectorY.y = this.outputVectorY.y + this.outputVectorYVel.y; // integrate position by velocity
    // this.outputVectorYVel.y = this.outputVectorYVel.y + (currentInput.y + this.k3*nextInput.y - this.outputVectorY.y - this.k1 * this.outputVectorYVel.y) // Integrate velocity by acceleration

    // // console.log(`The value is: ${this.outputVectorY.x} and ${this.outputVectorY.y}`)
    // // console.log(`The value of the speed is: ${this.outputVectorYVel.x} and ${this.outputVectorYVel.y}`)

    // // console.log(`The values of the constants are k1: ${this.k1} k2:${this.k2} k3:${this.k3}`)

    // this.previousInput.x = steering.x;
    // this.previousInput.y = steering.y;

    // // console.log(this.hasArrived)

    // // console.log(`The dx: ${this.collisionX - this.target.x} and dy: ${this.collisionY - this.target.y}`)

    // // let force = this.seek(target)
    // // console.log(`The steering force is: ${force.x} and ${force.y}`)
    // // this.applyForce(force)

    // // let force = {x: this.target.x - this.collisionX, y: this.target.y - this.collisionY}

    // // let desiredSpeed = this.maxSpeed

    // // let desiredSpeed = {x: 0, y: 0}

    // // let slowRadius = 100

    // // let distance =  Math.hypot(force.x, force.y)

    // // if (distance < slowRadius) {
    //     // desiredSpeed = {x: this.mapRange(distance, 0, slowRadius, 0, this.maxSpeed), y: this.mapRange(distance, 0, slowRadius, 0, this.maxSpeed)}
    // //    desiredSpeed = this.mapRange(distance, 0, slowRadius, 0, this.maxSpeed)
    // // } else {
    // //     desiredSpeed = 1
    // // }

    // // console.log(` The desired speed is ${desiredSpeed.x} and ${desiredSpeed.y}`)
    // // let variable = this.mapRange(distance, 0, slowRadius, 0, this.maxSpeed)
    // // console.log(variable)

    // // let lengthVector = Math.sqrt(((force.x ** 2) - 0) + ((force.y ** 2) - 0))
    // // let lengthVector =  Math.hypot(force.x, force.y)
    // // force.x = force.x / lengthVector;
    // // force.y = force.y / lengthVector;

    // // force.x = force.x * desiredSpeed;
    // // force.y = force.y * desiredSpeed;

    // // console.log(`The force in x is: ${force.x} and in y: ${force.y}`)

    // // if (this.speedX === 0 && this.speedY === 0) {
    // //     this.timerDecision ++
    // // }

    // // if (this.speedX !== 0 || this.speedY !== 0) {
    // //     this.timerDecision = 0
    // //     this.movementDecision = true
    // // }

    // // if (this.timerDecision >= 1) {
    // //     this.movementDecision = false
    // //     // console.log(`The movement was registered as a stop.`)
    // // }

    // // console.log(steering)

    // // console.log(`The acceleration in X is: ${this.accX} and in Y: ${this.accY}`)
    // // this.accX = this.target.x - this.collisionX
    // // this.accY = this.target.y - this.collisionY

    // // if (this.accX > this.maxAcceleration) {
    // //     this.accX = this.maxAcceleration;
    // // } else if (this.accX < -this.maxAcceleration) {
    // //     this.accX = - this.maxAcceleration;
    // // }
    // // if (this.accY > this.maxAcceleration) {
    // //     this.accY = this.maxAcceleration;
    // // } else if (this.accY < -this.maxAcceleration) {
    // //     this.accY = - this.maxAcceleration;
    // // }

    // // if (this.accX > this.maxAcceleration) {
    // //     this.accX = Math.floor(Math.random() * this.maxAcceleration)
    // // }

    // // if (this.accY > this.maxAcceleration) {
    // //     this.accY = Math.floor(Math.random() * this.maxAcceleration)
    // // }

    // this.speedX += this.accX + this.outputVectorY.x
    // this.speedY += this.accY + this.outputVectorY.y

    // // this.speedX += this.outputVectorY.x;
    // // this.speedY += this.outputVectorY.y;

    // // this.speedX = 1;
    // // this.speedY = 0;

    // // this.speedX += this.accX
    // // this.speedY += this.accY

    // // console.log(`The speed in x: ${this.outputVectorY.x} and in y: ${this.outputVectorY.y}`)

    // this.prevAccX = this.accX
    // this.prevAccY = this.accY

    // // this.speedX = this.target.x - this.collisionX
    // // this.speedY = this.target.y - this.collisionY

    // // this.speedX = this.speedX / 20
    // // this.speedY = this.speedY / 20

    // if (this.speedX > this.maxSpeed) {
    //     this.speedX = this.maxSpeed
    //     // console.log('Entered in Speed X')
    // } else if (this.speedX < -this.maxSpeed){
    //     this.speedX = -this.maxSpeed
    // }

    // if (this.speedY > this.maxSpeed) {
    //     this.speedY = this.maxSpeed
    //     // console.log('Entered in Speed Y')
    // } else if (this.speedY < -this.maxSpeed){
    //     this.speedY = -this.maxSpeed
    // }

    // let distancePoints = this.defineMagnitude(this.target.x - this.collisionX, this.target.y - this.collisionY);

    // // if (distancePoints >= 200) {
    // //     this.moveErrorX = 0;
    // //     this.moveErrorY = 0;
    // // }

    // // console.log(`The force is: ${steering.x} and in Y: ${steering.y}`)

    // if (steering.x < 0) {
    //     this.speedXPoint = - this.speedXPoint;
    // } else {
    //     this.speedXPoint = this.speedXPoint;
    // }

    // if (steering.y < 0) {
    //     this.speedYPoint = - this.speedYPoint;
    // } else {
    //     this.speedYPoint = this.speedYPoint;
    // }

    // // this.speedX += this.speedX * Math.cos(this.degreeVel);
    // // this.speedY += this.speedY * Math.sin(this.degreeVel);

    // // let error = getNormallyDistributedRandomNumber(0, 1)

    // // this.moveErrorX = getNormallyDistributedRandomNumber(0,1);
    // // this.moveErrorY = getNormallyDistributedRandomNumber(0,1);

    // this.moveErrorX = 0;
    // this.moveErrorY = 0;

    // // console.log(`The velocity in X is: ${this.speedXPoint} and Y: ${this.speedYPoint}`)

    // // this.speedX += this.speedX * this.moveErrorX;
    // // this.speedY += this.speedY * this.moveErrorY;
    // // console.log(this.velocityProfile[this.counterTarget])
    // // console.log(`The steering in X: ${steering.x} and Y: ${steering.y}`)
    // if (this.velocityProfile[this.counterTarget] !== undefined) {
    //     // this.speedX += this.accX + this.speedX * (this.speedXPoint/this.maxSpeed)
    //     // this.speedY += this.accY + this.speedY *  (this.speedYPoint/this.maxSpeed)
    //     // console.log(`The speed X: ${this.speedX} and speedY: ${this.speedY}`)
    //     // console.log(`The speed in X: ${this.speedXPoint} and the speed in Y: ${this.speedYPoint}`)
    // }

    // // console.log(`The speed in X: ${this.speedX} and speed in Y: ${this.speedY} and max speed: ${this.maxSpeed}`)

    // // this.degreeVel += 0.1

    // // if (this.degreeVel > 1) {
    // //     this.degreeVel = 0;
    // // }

    // // console.log(`Speed in X is: ${this.speedX} and Speed in Y is: ${this.speedY}`)

    // this.collisionX += this.speedX;
    // this.collisionY += this.speedY;

    // // console.log(`The acceleration in X:  ${this.accX} and Y: ${this.accY}`)

    // this.accX = 0
    // this.accY = 0

    // // console.log(`The position in X: ${this.collisionX} and in Y: ${this.collisionY}`)

    // // Speed proportional to the distance between mouse and center of circle.
    // // this.speedX = (this.dx) /20;
    // // this.speedY = (this.dy) /20;

    // // if (this.speedX > this.maxSpeed) {
    // //     this.speedX = this.maxSpeed
    // //     // console.log('Entered in Speed X')
    // // } else if (this.speedX < -this.maxSpeed){
    // //     this.speedX = -this.maxSpeed
    // // }

    // // if (this.speedY > this.maxSpeed) {
    // //     this.speedY = this.maxSpeed
    // //     // console.log('Entered in Speed Y')
    // // } else if (this.speedY < -this.maxSpeed){
    // //     this.speedY = -this.maxSpeed
    // // }
    // // console.log(`Speed in X is: ${this.speedX} and Speed in Y is: ${this.speedY}`)
    // // this.collisionX += this.speedX;
    // // this.collisionY += this.speedY;

    // }

    // Detect Side Walls
    if (this.collisionX + this.collisionRadius > this.game.width) {
      this.collisionX = this.game.width - this.collisionRadius;
    }

    if (this.collisionX - this.collisionRadius < 0) {
      this.collisionX = this.collisionRadius;
    }

    // Detect top and bottom walls
    if (this.collisionY + this.collisionRadius > this.game.height) {
      this.collisionY = this.game.height - this.collisionRadius;
    }

    if (this.collisionY - this.collisionRadius < 0) {
      this.collisionY = this.collisionRadius;
    }
  }
}
