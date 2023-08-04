class Agent {
  constructor(game, player) {
    this.game = game;
    this.player = player;
    // Position of the agent.
    this.collisionX = this.game.width * 0.5;
    this.collisionY = this.game.height * 0.5;
    this.collisionRadius = 20;
    this.frequency = 1;
    // Speed of the Agent (Changes depend on Competence).
    this.speedX = 0;
    this.speedY = 0;
    this.speedXPoint = 0;
    this.speedYPoint = 0;
    this.maxSpeed = 2;
    this.minSpeed = 0;
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
    this.competence = false;
    this.predictability = true;
    // Game repetitions
    // this.gameRound = 0;
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
    // Variables related to second order system.
    this.mass = 1;
    this.dampingRatioX = 0.1;
    this.dampingRatioY = 0.1;
    this.stiffnessX = 1;
    this.stiffnessY = 1;
    this.deltaTime = 0.1; // Time in seconds

    this.maxJitter = 5;
    this.currentTime = performance.now();

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

    // context.beginPath();
    // context.arc(
    //   this.game.width - 50,
    //   this.game.height - 50,
    //   this.collisionRadius,
    //   0,
    //   Math.PI * 2
    // );
    // context.save();
    // context.globalAlpha = 0.5;
    // context.fill();
    // context.restore();
    // context.stroke();

    context.beginPath();
    // context.arc(300, 300, 5, 0, Math.PI * 2);
    context.save();
    // context.globalAlpha = 0.5;
    context.fill();
    context.restore();
    // context.stroke();

    context.beginPath();
    // context.arc(this.initialBezier.x, this.initialBezier.y, 5, 0, Math.PI * 2);
    context.save();
    // context.globalAlpha = 0.5;
    // context.fillStyle = "purple";
    // context.fill();
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

    // context.beginPath();
    // context.arc(this.endBezier.x, this.endBezier.y, 5, 0, Math.PI * 2);
    // context.save();
    // // context.globalAlpha = 0.5;
    // // context.fillStyle = "black";
    // context.fill();
    // context.restore();
    // // context.stroke()

    // context.beginPath();
    // context.moveTo(this.collisionX, this.collisionY);
    // context.lineTo(this.target.x, this.target.y);
    // context.stroke();

    // for (let i = 0; i < this.trajectoryMovement.length - 1; i++) {
    //   context.beginPath();
    //   context.arc(
    //     this.trajectoryMovement[i].x,
    //     this.trajectoryMovement[i].y,
    //     5,
    //     0,
    //     Math.PI * 2
    //   );
    //   if (i >= 1) {
    //     context.moveTo(
    //       this.trajectoryMovement[i].x,
    //       this.trajectoryMovement[i].y
    //     );
    //     context.lineTo(
    //       this.trajectoryMovement[i - 1].x,
    //       this.trajectoryMovement[i - 1].y
    //     );
    //   }

    //   context.save();
    //   // context.globalAlpha = 0.5;
    //   context.fillStyle = "red";
    //   context.fill();
    //   context.restore();
    //   context.stroke();

    // }
  }

  // Agent controls:
  // The agent will have a pointer similar to the human and there will be a direction and distance depending on the force.

  applyForce(force) {
    // Add the acceleration to the movements of the agent.
    this.accX += force.x;
    this.accY += force.y;
  }

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
      let x = this.center.x + this.radius * Math.cos(radians);
      let y = this.center.y + this.radius * Math.sin(radians);
      this.trajectoryMovement.push({ x: x, y: y });

      times++;
    }
    console.log(`THE END OF THE CIRCLE`);

    this.currentAngle = 0;
  }

  debuggingMode() {}

  starMovement(alpha, radius, isPolygon, numberPoints) {
    // this.game.context.beginPath()

    for (let i = numberPoints; i !== 0; i--) {
      let r = (radius * ((i % 2) + 1)) / 2;
      var omega = alpha * i;
      if (isPolygon) {
        if (i % 2 !== 0) {
          this.trajectoryMovement.push({
            x: r * Math.sin(omega) + this.starCenter.x,
            y: r * Math.cos(omega) + this.starCenter.y,
          });
        }
      } else if (!isPolygon) {
        this.trajectoryMovement.push({
          x: r * Math.sin(omega) + this.starCenter.x,
          y: r * Math.cos(omega) + this.starCenter.y,
        });
      }
    }
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

    this.percentagePositionX += this.percentageSpeedX;
    this.percentagePositionY += this.percentageSpeedY;

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

    this.initialBezier.x = xt;
    this.initialBezier.y = yt;

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
    this.currentMovementDecision = 0;
    // Decide the parameters depending on the movement desired.

    if (this.currentMovementDecision == 0) {
      // Bezier Curve Parametrization
      this.trajectoryMovement.push(this.initialBezier);
      
      let times = 0;
      // Decide coordinates for the Bezier Curve based on a metric of length.

      
      if (this.predictability) {
        // Definition of the First Parameter of Bezier Curve
        this.p1Bezier = {
          x: Math.floor(this.game.width / 4),
          y: Math.floor(this.game.height / 2),
        };

        // Definition of the Second Parameter of Bezier Curve
        this.p2Bezier = {
          x: Math.floor(this.game.width / 2),
          y: Math.floor(this.game.height / 2),
        };
      } else if (!this.predictability) {

        // Definition of the First Parameter of Bezier Curve
        this.p1Bezier = {
          x: Math.floor(Math.random() * ((this.game.width - this.collisionRadius)) + this.collisionRadius),
          y: Math.floor(Math.random() * (this.game.height - this.collisionRadius) + this.collisionRadius),
        };

        // console.log(this.p1Bezier)

        // Definition of the Second Parameter of Bezier Curve
        this.p2Bezier = {
          x: Math.floor(Math.random() * ((this.game.width - this.collisionRadius)) + this.collisionRadius),
          y: Math.floor(Math.random() * (this.game.height - this.collisionRadius) + this.collisionRadius),
        };

        // console.log(this.p2Bezier)

      }
      // Definition of end point
      if (this.predictability) {
        this.endBezier = { x: 100, y: 300 };
      } else if (!this.predictability) {
        this.endBezier = {
          x: Math.floor(Math.random() * (this.game.width - this.collisionRadius) + this. collisionRadius),
          y: Math.floor(Math.random() * (this.game.height - this.collisionRadius) + this. collisionRadius)
        }
        console.log(`The value of the end point is: ${this.endBezier}`)
      }
      

      // if (this.endBezier.x > this.game.width - this.collisionRadius - 20) {
      //   this.endBezier.x = this.game.width - this.collisionRadius - 20;
      // } else if (this.endBezier.x < this.collisionRadius + 20) {
      //   this.endBezier.x = this.collisionRadius + 20;
      // }

      // if (this.endBezier.y > this.game.height - this.collisionRadius - 20) {
      //   this.endBezier.y = this.game.height - this.collisionRadius - 20;
      // } else if (this.endBezier.y < this.collisionRadius + 20) {
      //   this.endBezier.y = this.collisionRadius + 20;
      // }

      this.movementDecision = true;
      
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
      this.percentageSpeedX = 0.1;
      this.percentageSpeedY = 0.1;
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
        // console.log(this.trajectoryMovement)
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

    // Setting Bezier Curve Initial Point
    
    //   this.initialBezier = {
    //   x: this.game.width * 0.5,
    //   y: this.game.height * 0.5,
    // };

    if (this.predictability) {
      // Highly predictable agent
      this.initialBezier = {
      x: this.game.width * 0.5,
      y: this.game.height * 0.5,
    };
    } else if (!this.predictability) {
      // Lowly predictable agent
      this.initialBezier = {
        x: Math.floor(Math.random() * ((this.game.width - this.collisionRadius)) + this.collisionRadius),
        y: Math.floor(Math.random() * (this.game.height - this.collisionRadius) + this.collisionRadius),
      }
      // console.log(`This is the initial Bezier: ${this.initialBezier}`)
    }

    // console.log(this.trajectoryMovement)

    // Highly predictable agent
    // this.initialBezier = {
    //   x: this.game.width * 0.5,
    //   y: this.game.height * 0.5,
    // };

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

  secondOrderForces() {
    let forceSeek = {
      x: this.target.x - this.collisionX,
      y: this.target.y - this.collisionY,
    };
    forceSeek = this.normalize(forceSeek.x, forceSeek.y);
    forceSeek.x = forceSeek.x * this.maxSpeed;
    forceSeek.y = forceSeek.y * this.maxSpeed;

    forceSeek.x = forceSeek.x - this.speedX;
    forceSeek.y = forceSeek.y - this.speedY;

    let dampingForce = {
      x: (-this.dampingRatioX * this.speedX - this.stiffnessX * this.collisionX)/ this.mass,
      y: (-this.dampingRatioY * this.speedY - this.stiffnessY * this.collisionY)/ this.mass,
    }

    dampingForce.x = dampingForce.x * this.deltaTime;
    dampingForce.y = dampingForce.y * this.deltaTime;
    dampingForce = this.normalize(dampingForce.x, dampingForce.y);

    let newForcev2 = {
      x: (-this.dampingRatioX * forceSeek.x - this.stiffnessX * this.collisionX)/ this.mass,
      y: (-this.dampingRatioY * forceSeek.y - this.stiffnessY * this.collisionY)/ this.mass,
    }
    
    let totalForce ={
      x: forceSeek.x - dampingForce.x,
      y: forceSeek.y - dampingForce.y
    }

    return newForcev2;

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

  getRandomJitter() {
    return (Math.random() - 0.5) * 2 * this.maxJitter;
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

  // MOVEMENT OF THE FOLLOWER AGENT

  followerMovement(socket, room) {
    if (this.competence) {
      this.maxJitter =0;
    } else {
      this.maxJitter = 5;
    }
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
      this.applyForce(steering);

      this.accX += this.getRandomJitter();
      this.accY += this.getRandomJitter();

      this.speedX += this.accX;
      this.speedY += this.accY;
      
      this.collisionX += this.speedX;
      this.collisionY += this.speedY;

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

        // this.movementOrder++;
        // if (this.movementOrder > 3) {
        //   this.movementOrder = 0;
        // }
        this.movementDecision = true;
        this.movementCounter++;
        this.target = this.trajectoryMovement[this.counterTarget];
      }

      // CONDITION TO SEE IF THE AGENT ARRIVED TO THE TARGET POINT
      if (
        Math.abs(Math.floor(this.collisionX) - Math.floor(this.target.x)) <=
          20 &&
        Math.abs(Math.floor(this.collisionY) - Math.floor(this.target.y)) <= 20
      ) {
        this.hasArrived = true;
      }

      // CHANGE THE TARGET TO A NEW TARGET
      if (this.hasArrived === true) {
        this.counterTarget++;
        if (this.counterTarget < this.trajectoryMovement.length) {
          this.target = this.trajectoryMovement[this.counterTarget];
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
      // console.log(this.target)
      // FORCE DEFINITION AND APPLICATION TO GO TO THE CURRENT TARGET
      let steering = this.seek();

      this.applyForce(steering);
      

      this.accX += this.getRandomJitter();
      this.accY += this.getRandomJitter();

      this.speedX += this.accX;
      this.speedY += this.accY;

      this.collisionX += this.speedX;
      this.collisionY += this.speedY;

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

      this.moveErrorX = 0;
      this.moveErrorY = 0;
      
      this.accX = 0;
      this.accY = 0;

    }
  }

  LeaderMovement(socket, room) {

    if (this.competence) {
      this.maxJitter = 0;
    } else {
      this.maxJitter = 5;
    }

    const newTime = performance.now();
    const dt = (newTime - this.currentTime) / 1000; // Convert to seconds
    this.currentTime = newTime;


    this.prevMoveDec = this.movementDecision;

    if (!this.movementDecision) {

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
      console.log(this.trajectoryMovement)
    }

    if (
      Math.abs(Math.floor(this.collisionX) - Math.floor(this.target.x)) <= 20 &&
      Math.abs(Math.floor(this.collisionY) - Math.floor(this.target.y)) <= 20
    ) {
      this.hasArrived = true;
    }

    if (this.hasArrived === true) {
      this.counterTarget++;
      if (this.counterTarget < this.trajectoryMovement.length) {
        this.target = this.trajectoryMovement[this.counterTarget];
      }

      if (this.counterTarget >= this.trajectoryMovement.length) {
        this.counterTarget = 0;
        this.movementDecision = false;
        this.trajectoryMovement = [];
      }

      this.hasArrived = false;
    }

    let steering = this.seek();
    this.applyForce(steering);

    this.accX += this.getRandomJitter();
    this.accY += this.getRandomJitter();


    this.speedX += this.accX;
    this.speedY += this.accY;


    this.prevAccX = this.accX;
    this.prevAccY = this.accY;

    this.collisionX += this.speedX;
    this.collisionY += this.speedY;

    this.accX = 0;
    this.accY = 0;
  }

  update(random, targetX, targetY, socket, room) {
    if (this.follower) {
      // this.target = {x: targetX, y: targetY}
      this.followerMovement(socket, room);
    } else {
     this.LeaderMovement(socket, room);
    }

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
