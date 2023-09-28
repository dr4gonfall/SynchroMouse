class AgentSimulation {
  constructor(game, agent, isBot) {
    this.game = game;
    this.agentBot = agent;
    this.isBot = isBot;
    // Position of the agent.
    this.collisionX = this.game.width * 0.5;
    this.collisionY = this.game.height * 0.5;
    this.prevCollisionX = this.collisionX;
    this.prevCollisionY = this.collisionY;
    this.collisionRadius = 20;
    this.frequency = 1;
    // Speed of the Agent (Changes depend on Competence).
    this.speedX = 0;
    this.speedY = 0;
    this.speedXPoint = 0;
    this.speedYPoint = 0;

    this.prevRotation = 0;
    this.differenceRotation = 0;


    this.speedXCurvature = 0;
    this.speedYCurvature = 0;

    this.accXCurvature = 0;
    this.accYCurvature = 0;

    this.maxSpeed = 5;
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
    this.competence = true;
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

    this.bezierProfile = 0;
    // Area Parameters Prototype
    this.minCoordinateX = 0;
    this.minCoordinateY = 0;
    this.maxCoordinateX = 0;
    this.maxCoordinateY = 0;
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
    this.slowRadiusAgent = 50;

    this.paintMovementDecision = false;

    this.scoreSpeedXSimilarityAgent = 0;
    this.scoreSpeedYSimilarityAgent = 0;
    this.scoreRotationSimilarityAgent = 0;
    this.rotation = 0;
    this.rotationSum = 0;
    

    this.currentCuadrant = 0;

    this.thinkingTime = randIntervalFromIntervalInteger(200, 500);

    // Line Parameters
    this.initialLinePoint = { x: this.collisionX, y: this.collisionY };
    this.left = false;

    this.movementOrder = 0;
    this.counterBezier = 0;

    this.followerBehaviorType = 0;

    //Player of the Game
    // this.player = this.game.player;
    // Decision to change the type of movement base on the score.
    this.role = 0;
    // Type of movement for the Joint Improvisation Condition
    this.follower = false;
    // Decision of the agent to commit to a movement.
    this.movementDecision = false;
    // Type of movement the agent will perform.
    this.currentMovementDecision = 0;
    // Guiding points for following the movement
    this.trajectoryMovement = [];
    this.trajectoryMovementPolygon = [];
    this.isPlanning = true;
    this.trajectoryMov = [];
    this.trajectoryMovementSampleAgent = [];
    // End point array for the Bezier curve based on the player position
    this.agentEndPoint = { x: this.agent.collisionX, y: this.agent.collisionY };
    // Current target of the agent.
    this.target = { x: 500, y: 200 };
    // Current target based on position of the player.
    this.targetSampleAgent = { x: this.agent.collisionX, y: this.agent.collisionY }
    // Verify the agent has arrived to a given target.
    this.hasArrived = false;
    this.hasArrivedSampleAgent = false;
    // Counter for the current target in the trayectory.
    this.counterTarget = 0;
    // Counter for the target in the follower movement.
    this.counterTargetAgentSample = 0;
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

    this.initialTrajectoryLength = 0;

    this.prevMoveDec = this.movementDecision;
    this.agentDesiredSpeedX =  randIntervalFromInterval(0, this.maxSpeed);
    this.agentDesiredSpeedY = randIntervalFromInterval(0, this.maxSpeed);
    this.velocityVector = {x: 0, y: 0};

    this.velocityProfile = [];
    this.amountOfSharpTurnsAgent = 0;
    this.amountOfSmoothTurnsAgent = 0;

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
    context.arc(this.initialBezier.x, this.initialBezier.y, 5, 0, Math.PI * 2);
    context.save();
    context.globalAlpha = 0.5;
    context.fillStyle = "purple";
    context.fill();
    context.restore();
    context.stroke();

    // Painting of the first control point in Bezier Curve
    context.beginPath()
    context.arc(this.p1Bezier.x, this.p1Bezier.y, 5, 0, Math.PI * 2)
    context.save();
    context.globalAlpha = 0.5;
    context.fillStyle = 'blue'
    context.fill();
    context.restore();
    context.stroke()

    // Painting of the second control point in Bezier Curve
    context.beginPath()
    context.arc(this.p2Bezier.x, this.p2Bezier.y, 5, 0, Math.PI * 2)
    context.save();
    context.globalAlpha = 0.5;
    context.fillStyle = 'blue'
    context.fill();
    context.restore();
    context.stroke()

    // Painting of the end point in Bezier Curve
    context.beginPath();
    context.arc(this.endBezier.x, this.endBezier.y, 5, 0, Math.PI * 2);
    context.save();
    // context.globalAlpha = 0.5;
    // context.fillStyle = "black";
    context.fill();
    context.restore();
    // context.stroke()

    context.beginPath();
    context.moveTo(this.collisionX, this.collisionY);
    context.lineTo(this.targetSampleAgent.x, this.targetSampleAgent.y);
    context.stroke();

    for (let i = 0; i < this.trajectoryMovement.length - 1; i++) {
      context.beginPath();
      context.arc(
        this.trajectoryMovementSampleAgent[i].x,
        this.trajectoryMovementSampleAgent[i].y,
        5,
        0,
        Math.PI * 2
      );
      if (i >= 1) {
        context.moveTo(
          this.trajectoryMovementSampleAgent[i].x,
          this.trajectoryMovementSampleAgent[i].y
        );
        context.lineTo(
          this.trajectoryMovementSampleAgent[i - 1].x,
          this.trajectoryMovementSampleAgent[i - 1].y
        );
      }

      context.save();
      // context.globalAlpha = 0.5;
      context.fillStyle = "red";
      context.fill();
      context.restore();
      context.stroke();

    }
  }

  // Agent controls:
  // The agent will have a pointer similar to the human and there will be a direction and distance depending on the force.

  applyForce(force) {
    // Add the acceleration to the movements of the agent.
    this.accX += force.x;
    this.accY += force.y;
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

  debuggingMode() { }

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

  scoreSimilarityNoLeader() {
    if (Math.abs(this.player.speedX) === Math.abs(this.speedX)) {
      this.scoreSpeedXSimilarityAgent ++;
    }

    if (Math.abs(this.player.speedY) === Math.abs(this.speedY)) {
      this.scoreSpeedYSimilarityAgent ++;
    }
    if (Math.abs(this.player.rotation) === Math.abs(this.rotation)) {
      this.scoreRotationSimilarityAgent ++;
    }
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

  decideMovement(currentMovementType) {
    // Algorithm to decide what movement is going to be performed.

    // let decideMovement = Math.floor(Math.random())
    // this.currentMovementDecision = 0;
    // Decide the parameters depending on the movement desired.

    if (currentMovementType == 0) {
      // Bezier Curve Parametrization
      this.trajectoryMovementSampleAgent.push(this.initialBezier);

      let times = 0;
      // Decide coordinates for the Bezier Curve based on a metric of length.


      if (this.predictability) {
        // Definition of the First Parameter of Bezier Curve
        this.p1Bezier = {
          x: linearInterpolation(this.initialBezier.x, this.endBezier.x, 1 / 3),
          y: linearInterpolation(this.initialBezier.y, this.endBezier.y, 1 / 3),
        };

        // Definition of the Second Parameter of Bezier Curve
        this.p2Bezier = {
          x: linearInterpolation(this.initialBezier.x, this.endBezier.x, 2 / 3),
          y: linearInterpolation(this.initialBezier.y, this.endBezier.y, 2 / 3),
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
          x: Math.floor(Math.random() * (this.game.width - this.collisionRadius) + this.collisionRadius),
          y: Math.floor(Math.random() * (this.game.height - this.collisionRadius) + this.collisionRadius)
        }
        // console.log(`The value of the end point is: ${this.endBezier}`)
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

      this.bezierProfile = 1;

      this.bezierMoveExecutionAlternative(this.bezierProfile);

      // Algorithm for better decision making...
    } else if (currentMovementType == 1) {
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
    } else if (currentMovementType == 2) {
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
    } else if (currentMovementType == 3) {
      // Line Movement
      this.lineMovement();



      // WORKING ON THIS PART FOR LEADER/FOLLOWER MOVEMENT
    } else if (currentMovementType == 4) {
      // Wait for player to move

      this.initialBezier = {
        x: this.collisionX,
        y: this.collisionY
      }

      

      this.endBezier = {
        x: this.player.collisionX + (this.player.speedX * (40)),
        y: this.player.collisionY + (this.player.speedY * (40))
      }

      if (this.endBezier.x < this.collisionRadius) {
        this.endBezier.x = this.collisionRadius;
      } else if (this.endBezier.x > this.game.width - this.collisionRadius) {
        this.endBezier.x = this.game.width - this.collisionRadius;
      }

      if (this.endBezier.y < this.collisionRadius) {
        this.endBezier.y = this.collisionRadius;
      } else if (this.endBezier.y > this.game.height - this.collisionRadius) {
        this.endBezier.y = this.game.height - this.collisionRadius;
      }

      // this.trajectoryMovementSampleAgent.push(this.initialBezier);

      // Definition of p1Bezier

      // Decide coordinates for the Bezier Curve based on a metric of length.


      if (this.predictability) {
        // Definition of the First Parameter of Bezier Curve
        this.p1Bezier = {
          x: linearInterpolation(this.initialBezier.x, this.endBezier.x, 1 / 3),
          y: linearInterpolation(this.initialBezier.y, this.endBezier.y, 1 / 3),
        };

        // Alternative Definition of the First Parameter of Bezier Curve

        // this.p1Bezier = {
        //   x: 0,
        //   y:0,
        // }



        // Definition of the Second Parameter of Bezier Curve
        // this.p2Bezier = {
        //   x: linearInterpolation(this.initialBezier.x, this.endBezier.x, 2 / 3),
        //   y: linearInterpolation(this.initialBezier.y, this.endBezier.y, 2 / 3),
        // };

        this.p2Bezier = {
          x:0,
          y:0,
        }

        if (this.initialBezier.x < this.endBezier.x) {
          this.p2Bezier.x = randIntervalFromIntervalInteger(this.initialBezier.x, this.endBezier.x)
        } else if (this.initialBezier.x >= this.endBezier.x) {
          this.p2Bezier.x = randIntervalFromIntervalInteger(this.endBezier.x, this.initialBezier.x)
        }

        if (this.initialBezier.y < this.endBezier.y) {
          this.p2Bezier.y = randIntervalFromIntervalInteger(this.initialBezier.y, this.endBezier.y)
        } else if (this.initialBezier.y >= this.endBezier.y) {
          this.p2Bezier.y = randIntervalFromIntervalInteger(this.endBezier.y, this.initialBezier.y)
        }





      } else if (!this.predictability) {

        // Math.floor(Math.random() * ((this.game.width - this.collisionRadius)) + this.collisionRadius)
        this.p1Bezier = {
          x: 0,
          y: 0,
        };


        
        
        // Definition of the First Parameter of Bezier Curve
        if (this.initialBezier.x < this.endBezier.x) {
          this.p1Bezier.x = randIntervalFromIntervalInteger(this.initialBezier.x, this.endBezier.x)
        } else if (this.initialBezier.x >= this.endBezier.x) {
          this.p1Bezier.x = randIntervalFromIntervalInteger(this.endBezier.x, this.initialBezier.x)
        }

        if (this.initialBezier.y < this.endBezier.y) {
          this.p1Bezier.y = randIntervalFromIntervalInteger(this.initialBezier.y, this.endBezier.y)
        } else if (this.initialBezier.y >= this.endBezier.y) {
          this.p1Bezier.y = randIntervalFromIntervalInteger(this.endBezier.y, this.initialBezier.y)
        }
        

        // console.log(this.p1Bezier)

        // Definition of the Second Parameter of Bezier Curve


        this.p2Bezier = {
          x: randIntervalFromIntervalInteger(this.collisionRadius, this.game.width - this.collisionRadius),
          y: randIntervalFromIntervalInteger(this.collisionRadius, this.game.height - this.collisionRadius)
        }
        
        // this.p2Bezier = {
        //   x:0,
        //   y:0,
        // }

        // if (this.initialBezier.x < this.endBezier.x) {
        //   this.p2Bezier.x = randIntervalFromIntervalInteger(this.initialBezier.x, this.endBezier.x)
        // } else if (this.initialBezier.x >= this.endBezier.x) {
        //   this.p2Bezier.x = randIntervalFromIntervalInteger(this.endBezier.x, this.initialBezier.x)
        // }

        // if (this.initialBezier.y < this.endBezier.y) {
        //   this.p2Bezier.y = randIntervalFromIntervalInteger(this.initialBezier.y, this.endBezier.y)
        // } else if (this.initialBezier.y >= this.endBezier.y) {
        //   this.p2Bezier.y = randIntervalFromIntervalInteger(this.endBezier.y, this.initialBezier.y)
        // }

      }

      this.movementDecision = true;
      this.bezierProfile = 1;
      this.bezierMoveExecutionAlternative(this.bezierProfile);
      // console.log(`The length of the trajectory is: ${this.trajectoryMovementSampleAgent.length}`)


    } else if (currentMovementType === 5) {
      
      // Wait for player to move

      this.initialBezier = {
        x: this.collisionX,
        y: this.collisionY
      }

      // this.trajectoryMovementSampleAgent.push(this.initialBezier);

      // Definition of p1Bezier

      // Decide coordinates for the Bezier Curve based on a metric of length.


      if (this.predictability) {

        if (this.currentCuadrant < 3) {
          this.currentCuadrant ++;
        } else if (this.currentCuadrant === 3) {
          this.currentCuadrant = 0;
        }
        


        if (this.currentCuadrant === 0) {
          this.endBezier = {
            x: randIntervalFromIntervalInteger(0, (this.game.width / 2) - this.collisionRadius),
            y: randIntervalFromIntervalInteger(0, (this.game.height / 2) - this.collisionRadius)
          }
        } else if (this.currentCuadrant === 1) {
          this.endBezier = {
            x: randIntervalFromIntervalInteger((this.game.width/2), (this.game.width)- this.collisionRadius),
            y: randIntervalFromIntervalInteger(0, (this.game.height / 2) - this.collisionRadius)
          }
        } else if (this.currentCuadrant === 2) {
          this.endBezier = {
            x: randIntervalFromIntervalInteger(0, (this.game.width / 2) - this.collisionRadius),
            y: randIntervalFromIntervalInteger((this.game.height / 2), (this.game.height)- this.collisionRadius)
          }
        } else if (this.currentCuadrant === 3) {
          this.endBezier = {
            x: randIntervalFromIntervalInteger((this.game.width/2), (this.game.width)- this.collisionRadius),
            y: randIntervalFromIntervalInteger((this.game.height / 2), (this.game.height)- this.collisionRadius)
          }
        }
        

        


        // Definition of the First Parameter of Bezier Curve
        this.p1Bezier = {
          x: linearInterpolation(this.initialBezier.x, this.endBezier.x, 1 / 3),
          y: linearInterpolation(this.initialBezier.y, this.endBezier.y, 1 / 3),
        };

        // Definition of the Second Parameter of Bezier Curve
        this.p2Bezier = {
          x: linearInterpolation(this.initialBezier.x, this.endBezier.x, 2 / 3),
          y: linearInterpolation(this.initialBezier.y, this.endBezier.y, 2 / 3),
        };


      } else if (!this.predictability) {


        this.currentCuadrant = randIntervalFromIntervalInteger(0,3);


        if (this.currentCuadrant === 0) {
          this.endBezier = {
            x: randIntervalFromIntervalInteger(0, (this.game.width / 2) - this.collisionRadius),
            y: randIntervalFromIntervalInteger(0, (this.game.height / 2) - this.collisionRadius)
          }
        } else if (this.currentCuadrant === 1) {
          this.endBezier = {
            x: randIntervalFromIntervalInteger((this.game.width/2), (this.game.width)- this.collisionRadius),
            y: randIntervalFromIntervalInteger(0, (this.game.height / 2) - this.collisionRadius)
          }
        } else if (this.currentCuadrant === 2) {
          this.endBezier = {
            x: randIntervalFromIntervalInteger(0, (this.game.width / 2) - this.collisionRadius),
            y: randIntervalFromIntervalInteger((this.game.height / 2), (this.game.height)- this.collisionRadius)
          }
        } else if (this.currentCuadrant === 3) {
          this.endBezier = {
            x: randIntervalFromIntervalInteger((this.game.width/2), (this.game.width)- this.collisionRadius),
            y: randIntervalFromIntervalInteger((this.game.height / 2), (this.game.height)- this.collisionRadius)
          }
        }

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

      }



      this.movementDecision = true;
      this.bezierProfile = 1

      this.bezierMoveExecutionAlternative(this.bezierProfile);


    }
  }

  // Alternative of the Bezier Curve Points ======================================

  bezierMoveExecutionAlternative(profile) {
    while (this.paintMovementDecision) {
      // console.log(`The current state of Bezier is: ${this.percentagePositionX} and ${this.percentagePositionY}`)
      
      if (profile === 0) {
        this.percentageSpeedX = 0.05;
        this.percentageSpeedY = 0.05;
        // this.initialTrajectoryLength = 1 / 0.05
      } else if (profile === 1) {
        this.percentageSpeedX = 0.1;
        this.percentageSpeedY = 0.1;
        // this.initialTrajectoryLength = 1 / 0.1
      } else if (profile === 2) {
        this.percentageSpeedX = 0.2;
        this.percentageSpeedY = 0.2;
        // this.initialTrajectoryLength = 1/ 0.2
      } else if (profile === 3) {
        this.percentageSpeedX = 0.5;
        this.percentageSpeedY = 0.5;
        // this.initialTrajectoryLength = 1 / 0.5;
      }
      // this.percentageSpeedX = 0.5;
      // this.percentageSpeedY = 0.5;
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
        // console.log(`ENTERED INTO BEZIER INITIAL FUNCTION`)
        this.trajectoryMovementSampleAgent.push({
          x: this.initialBezier.x,
          y: this.initialBezier.y,
        });
        // console.log(`The initial point is: ${this.trajectoryMovementSampleAgent[0].x} and ${this.trajectoryMovementSampleAgent[0].y}`)
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
        this.trajectoryMovementSampleAgent.pop();
        this.trajectoryMovementSampleAgent.push({
          x: this.endBezier.x,
          y: this.endBezier.y,
        });
        // console.log(this.points)
      }
    }
  }

  // Execution of the Bezier Curve Points =========================================

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
        // console.log(`ENTERED INTO BEZIER INITIAL FUNCTION`)
        this.trajectoryMovementSampleAgent.push({
          x: this.initialBezier.x,
          y: this.initialBezier.y,
        });
        console.log(`The initial point is: ${this.trajectoryMovementSampleAgent[0].x} and ${this.trajectoryMovementSampleAgent[0].y}`)
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
        this.trajectoryMovementSampleAgent.pop();
        this.trajectoryMovementSampleAgent.push({
          x: this.endBezier.x,
          y: this.endBezier.y,
        });
        // console.log(this.points)
      }


    }

    // this.targetSampleAgent = this.trajectoryMovementSampleAgent[0];
    // trajectory.shift();
    // console.log(`The trajectory is: ${trajectory[2].x} and ${trajectory[2].y}`)

    // this.trajectoryMovementSampleAgent.forEach(element => {
    //    console.log(`The element is: ${element.x} and ${element.y}`)
    // });
    // Setting Bezier Curve Initial Point

    //   this.initialBezier = {
    //   x: this.game.width * 0.5,
    //   y: this.game.height * 0.5,
    // };

    // if (this.predictability) {
    //   // Highly predictable agent
    //   this.initialBezier = {
    //   x: this.game.width * 0.5,
    //   y: this.game.height * 0.5,
    // };
    // } else if (!this.predictability) {
    //   // Lowly predictable agent
    //   this.initialBezier = {
    //     x: Math.floor(Math.random() * ((this.game.width - this.collisionRadius)) + this.collisionRadius),
    //     y: Math.floor(Math.random() * (this.game.height - this.collisionRadius) + this.collisionRadius),
    //   }
    //   // console.log(`This is the initial Bezier: ${this.initialBezier}`)
    // }

    // console.log(this.trajectoryMovement)

    // Highly predictable agent
    // this.initialBezier = {
    //   x: this.game.width * 0.5,
    //   y: this.game.height * 0.5,
    // };

    // console.log(this.trajectoryMovement)


    // console.log(this.trajectoryMovementSampleAgent)
  }


  // defineMagnitude(x, y) {
  //   return Math.sqrt(x ** 2 + y ** 2);
  // }

  // normalize(x, y) {
  //   let m = defineMagnitude(x, y);
  //   if (m > 0) {
  //     return { x: x / m, y: y / m };
  //   }
  //   if (m === 0) {
  //     return { x: 0, y: 0 };
  //   }
  // }

  // velocityProfile(){

  // }

  accelerate() {
    let force = {
      x: this.target.x - this.collisionX,
      y: this.target.y - this.collisionY,
    };
    let accelerationRadius = 50;
    let d = defineMagnitude(force.x, force.y);

    if (d > accelerationRadius) {
      let desiredSpeed = mapRange(
        0,
        d,
        accelerationRadius,
        0,
        this.maxSpeed
      );
      force = normalize(force.x, force.y);
      force.x = force.x * desiredSpeed;
      force.y = force.y * desiredSpeed;
    } else {
      force = normalize(force.x, force.y);
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



  movementAgent() {
    let force = {
      x: this.targetSampleAgent.x - this.collisionX,
      y: this.targetSampleAgent.y - this.collisionY,
    };

    let d = defineMagnitude(force.x, force.y);
    // this.slowRadiusAgent = Math.random()

    if (d < this.slowRadiusAgent) {
      let desiredSpeed = mapRange(d, 0, this.slowRadiusAgent, 0, this.maxSpeed);
      force = normalize(force.x, force.y);
      force.x = force.x * desiredSpeed;
      force.y = force.y * desiredSpeed;
    } else {
      force = normalize(force.x, force.y);

      if (!this.competence) {
        force.x = force.x * (this.agentDesiredSpeedX);
        force.y = force.y * (this.agentDesiredSpeedY);
        // console.log(`The desired speed is: ${this.agentDesiredSpeedX} and ${this.agentDesiredSpeedY}`)
        
        // console.log(`The force is: ${force.x} and ${force.y}`)


      } else if(this.competence) {
        force.x = force.x * this.maxSpeed;
        force.y = force.y * this.maxSpeed;
      }


      // force.x = force.x * this.maxSpeed;
      // force.y = force.y * this.maxSpeed;
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

    // console.log(` The force is: ${force.x} and ${force.y}`)

    return force;



  }

  arrive() {
    let force = {
      x: this.target.x - this.collisionX,
      y: this.target.y - this.collisionY,
    };
    let slowRadius = 50;
    let d = defineMagnitude(force.x, force.y);

    if (d < slowRadius) {
      let desiredSpeed = mapRange(d, 0, slowRadius, 0, this.maxSpeed);
      force = normalize(force.x, force.y);
      force.x = force.x * desiredSpeed;
      force.y = force.y * desiredSpeed;
    } else {
      force = normalize(force.x, force.y);
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
    forceSeek = normalize(forceSeek.x, forceSeek.y);
    forceSeek.x = forceSeek.x * this.maxSpeed;
    forceSeek.y = forceSeek.y * this.maxSpeed;

    forceSeek.x = forceSeek.x - this.speedX;
    forceSeek.y = forceSeek.y - this.speedY;

    let dampingForce = {
      x: (-this.dampingRatioX * this.speedX - this.stiffnessX * this.collisionX) / this.mass,
      y: (-this.dampingRatioY * this.speedY - this.stiffnessY * this.collisionY) / this.mass,
    }

    dampingForce.x = dampingForce.x * this.deltaTime;
    dampingForce.y = dampingForce.y * this.deltaTime;
    dampingForce = normalize(dampingForce.x, dampingForce.y);

    let newForcev2 = {
      x: (-this.dampingRatioX * forceSeek.x - this.stiffnessX * this.collisionX) / this.mass,
      y: (-this.dampingRatioY * forceSeek.y - this.stiffnessY * this.collisionY) / this.mass,
    }

    let totalForce = {
      x: forceSeek.x - dampingForce.x,
      y: forceSeek.y - dampingForce.y
    }

    return newForcev2;

  }

  seek(arrival = false) {
    let force = {
      x: this.targetSampleAgent.x - this.collisionX,
      y: this.targetSampleAgent.y - this.collisionY,
    };
    force = normalize(force.x, force.y);
    // console.log(`The force in X: ${force.x} and Y: ${force.y}`)

    if (!this.competence) {
      force.x = force.x * (this.agentDesiredSpeedX);
      force.y = force.y * (this.agentDesiredSpeedY);
      // console.log(`The desired speed is: ${this.agentDesiredSpeedX} and ${this.agentDesiredSpeedY}`)
      
      // force.x = force.x * (this.player.speedX * randIntervalFromIntervalInteger(1, 2));
      // force.y = force.y * (this.player.speedY * randIntervalFromIntervalInteger(1, 2))


      // console.log(`The force is: ${force.x} and ${force.y}`)

      
    } else if(this.competence){
      // if (this.player.speedX / this.player.maxSpeed < 0) {
      //   force.x = this.maxSpeed * (-randIntervalFromInterval(0, Math.abs((this.player.speedX / this.player.maxSpeed))))
      //   // console.log(`A random number is: ${randIntervalFromInterval((this.player.speedX / this.player.maxSpeed), 0)}`)
      // } else if(this.player.speedX / this.player.maxSpeed > 0) {
      //   force.x = this.maxSpeed * (randIntervalFromInterval(0, (this.player.speedX / this.player.maxSpeed)))
      // }

      // if (this.player.speedY / this.player.maxSpeed < 0) {
      //   force.y = this.maxSpeed * (-randIntervalFromInterval(0, Math.abs((this.player.speedY / this.player.maxSpeed))))
      // } else if(this.player.speedY / this.player.maxSpeed > 0) {
      //   force.y = this.maxSpeed * (randIntervalFromInterval(0, (this.player.speedY / this.player.maxSpeed)))
      // }
      // force.x = this.maxSpeed * ( randIntervalFromInterval(0, (this.player.speedX / this.player.maxSpeed)));
      // force.y = this.maxSpeed * ( (this.player.speedY / this.player.maxSpeed));
      // force.x = force.x * (linearInterpolation(1, this.maxSpeed, this.initialTrajectoryLength));
      // force.y = force.y * (linearInterpolation(1, this.maxSpeed, this.initialTrajectoryLength));
      force.x = force.x * this.maxSpeed;
      force.y = force.y * this.maxSpeed;
      // force.x = this.player.speedX * randIntervalFromInterval(0.1, 1);
      // force.y = this.player.speedY * randIntervalFromInterval(0.1, 1);
      // console.log(`The percentage of speed: ${this.player.speedX / this.player.maxSpeed} and Y: ${this.player.speedY / this.player.maxSpeed}`);
    }

    console.log(`The length of trajectory: ${this.initialTrajectoryLength}`)

    // console.log(`Initial trajectory: ${this.initialTrajectoryLength}`)
    // console.log(`The force is X: ${force.x} and Y: ${force.y}`)

    // force.x = force.x * this.maxSpeed;
    // force.y = force.y * this.maxSpeed;

    force = { x: force.x - this.speedX, y: force.y - this.speedY };

    // console.log(`The force is X: ${force.x} and Y: ${force.y}`)

    // if (force.x > this.maxForce) {
    //   force.x = this.maxForce;
    // } else if (force.x < -this.maxForce) {
    //   force.x = -this.maxForce;
    // }

    // if (force.y > this.maxForce) {
    //   force.y = this.maxForce;
    // } else if (force.y < -this.maxForce) {
    //   force.y = -this.maxForce;
    // }

    
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

  // Get Target sequence after a certain time.
  // MAYBE??

  getTargetValuesPlayer() {
    // console.log(`The function entered at time: ${performance.now()}`)

    // this.trajectoryMovementSampleAgent.push({x: this.player.collisionX, y: this.player.collisionY })
    // this.playerEndPoint.x = this.player.collisionX;
    // this.playerEndPoint.y = this.player.collisionY;


  }

  // MOVEMENT OF THE NO LEADER AGENT=========================================================

  noLeaderMovement(socket, room) {

    if (this.follower) {
      this.followerMovement(socket, room)
    } else if (!this.follower) {
      this.LeaderMovement(socket, room)
    }

  }

  // MOVEMENT OF THE FOLLOWER AGENT==========================================================

  followerMovement(socket, room) {
    // Decide competence for the movement
    // if (this.competence) {
    //   this.maxJitter = 0;
    // } else {
    //   this.maxJitter = 10;
    // }
    this.maxJitter = 0;
    // console.log(`The target is ${this.targetSampleAgent.x} and ${this.targetSampleAgent.y}`)

    if (Math.abs(this.player.rotation) >= 90) {
      this.amountOfSharpTurnsPlayer ++;
    } else if (Math.abs(this.agent.rotation) < 90 && this.amountOfSharpTurnsPlayer > 0) {
      this.amountOfSmoothTurnsPlayer ++;
    
    }

    if (this.amountOfSharpTurnsPlayer >= 10 && this.amountOfSmoothTurnsPlayer <= 10) {
      this.movementDecision = false;
      this.trajectoryMovementSampleAgent = [this.targetSampleAgent]
      // this.amountOfSharpTurnsPlayer = 0;

    }

    if (this.amountOfSmoothTurnsPlayer >= 10) {
      this.amountOfSharpTurnsPlayer = 0;
      this.amountOfSmoothTurnsPlayer = 0;
    }

    // console.log(`The amount of sharp turns is: ${this.amountOfSharpTurnsPlayer}`)
    
    
    
    if (!this.predictability) {
      
      if (this.initialTrajectoryLength > 1) {
        this.initialTrajectoryLength = 0;
      }
      // If there is a distance greater than a 100 and the agent has not decided a movement.
      if (defineMagnitude(this.agent.collisionX - this.collisionX, this.agent.collisionY - this.collisionY) >= 50 &&
        !this.movementDecision) {
        this.paintMovementDecision = true;
        this.decideMovement(4);
        // The movement is decided and the counter is increased
        this.movementDecision = true;
        this.targetSampleAgent.x = this.trajectoryMovementSampleAgent[0].x;
        this.targetSampleAgent.y = this.trajectoryMovementSampleAgent[0].y;
        if (this.bezierProfile === 0) {
          this.initialTrajectoryLength += 0.05
        } else if (this.bezierProfile === 1) {
          this.initialTrajectoryLength += 0.1
        } else if (this.bezierProfile === 2) {
          this.initialTrajectoryLength += 0.2
        } else if (this.bezierProfile === 3) {
          this.initialTrajectoryLength +=0.5
        }
        // this.initialTrajectoryLength += 
        this.hasArrivedSamplePlayer = false;
        
        

      }

      // CONDITION TO SEE IF THE AGENT ARRIVED TO THE TARGET POINT
      if (
        Math.abs(Math.floor(this.collisionX) - Math.floor(this.targetSampleAgent.x)) <=
        20 &&
        Math.abs(Math.floor(this.collisionY) - Math.floor(this.targetSampleAgent.y)) <= 20
      ) {
        this.hasArrivedSamplePlayer = true;
      }

      // CHANGE THE TARGET TO A NEW TARGET==========================================
      if (this.hasArrivedSamplePlayer) {
        // Time to think when the trajectory is over what to do next.
        if (this.trajectoryMovementSampleAgent.length === 1) {
          this.trajectoryMovementSampleAgent.shift();
          setTimeout(() => {
            this.movementDecision = false;
            this.thinkingTime = randIntervalFromIntervalInteger(50, 200)
          }, this.thinkingTime);
          this.initialTrajectoryLength = 0;
        }


        if (this.trajectoryMovementSampleAgent.length > 1) {
          this.trajectoryMovementSampleAgent.shift();
          this.targetSampleAgent.x = this.trajectoryMovementSampleAgent[0].x;
          this.targetSampleAgent.y = this.trajectoryMovementSampleAgent[0].y;
          this.hasArrivedSamplePlayer = false;
          // Conditions for desired speed for agent incompetence.
          if (!this.competence) {
            this.agentDesiredSpeedX = randIntervalFromIntervalInteger(1, this.maxSpeed);
            this.agentDesiredSpeedY = randIntervalFromIntervalInteger(1, this.maxSpeed);
            this.slowRadiusAgent = 50;
          } else if(this.competence) {
            this.slowRadiusAgent = 50;
          }

          // let steering = this.seek();
         let steering = 0;

          if (this.trajectoryMovementSampleAgent.length > 1) {
            steering = this.seek();
          } else if (this.trajectoryMovementSampleAgent.length === 1) {
            steering = this.movementAgent();
          }

          
          this.applyForce(steering);

          // this.accX += this.getRandomJitter();
          // this.accY += this.getRandomJitter();

          this.speedX += this.accX;
          this.speedY += this.accY;

          this.prevCollisionX = this.collisionX;
          this.prevCollisionY = this.collisionY;

          this.collisionX += this.speedX;
          this.collisionY += this.speedY;

          this.prevRotation = this.rotation

          this.rotation =
          (Math.atan2(
            this.collisionY - this.prevCollisionY,
            this.collisionX - this.prevCollisionX
          ) *
            180.0) /
          Math.PI;

          this.differenceRotation = this.rotation - this.prevRotation;

          this.prevAccX = this.accX;
          this.prevAccY = this.accY;

          if (this.speedX > this.maxSpeed) {
            this.speedX = this.maxSpeed;
          } else if (this.speedX < -this.maxSpeed) {
            this.speedX = -this.maxSpeed;
          }

          if (this.speedY > this.maxSpeed) {
            this.speedY = this.maxSpeed;
          } else if (this.speedY < -this.maxSpeed) {
            this.speedY = -this.maxSpeed;
          }

          this.moveErrorX = 0;
          this.moveErrorY = 0;

          this.accX = 0;
          this.accY = 0;



        } else if (this.trajectoryMovementSampleAgent.length === 0 &&
           this.collisionX - this.agent.collisionX <= 20 && this.collisionY - this.agent.collisionY <= 20) {

          // GUARANTEE SPEED, ACCELERATION AND OTHER FORCES ARE 0
          this.accX = 0;
          this.accY = 0;

          this.speedX = 0;
          this.speedY = 0;

          this.prevCollisionX = this.collisionX;
          this.prevCollisionY = this.collisionY;

          this.collisionX += this.speedX;
          this.collisionY += this.speedY;

          this.prevRotation = this.rotation;

          this.rotation =
          (Math.atan2(
            this.collisionY- this.prevCollisionY,
            this.collisionX - this.prevCollisionX
          ) *
            180.0) /
          Math.PI;

          this.differenceRotation = this.rotation - this.prevRotation;

          this.prevAccX = this.accX;
          this.prevAccY = this.accY;

        }

      // There is still a target that the agent has to follow
      } else if (!this.hasArrivedSamplePlayer) {


        // let steering = this.seek();
        let steering = 0;


          if (this.trajectoryMovementSampleAgent.length > 1) {
            steering = this.seek();
          } else if (this.trajectoryMovementSampleAgent.length === 1) {
            steering = this.movementAgent();
          }

        // let steering = this.movementAgent();
        // console.log(`THE STEERING IS: ${steering.x} AND ${steering.y}`)
        this.applyForce(steering);

        this.speedX += this.accX;
        this.speedY += this.accY;
        
        this.prevCollisionX = this.collisionX;
        this.prevCollisionY = this.collisionY;

        this.collisionX += this.speedX;
        this.collisionY += this.speedY;

        this.prevRotation = this.rotation;

        this.rotation =
          (Math.atan2(
            this.collisionY - this.prevCollisionY,
            this.collisionX - this.prevCollisionX
          ) *
            180.0) /
          Math.PI;

          this.differenceRotation = this.rotation - this.prevRotation;

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
      // ===============================================================================


    // CONDITION AGENT IS PREDICTABLE
    } else if (this.predictability) {

      // Control of the length of points for speed profile.
      if (this.initialTrajectoryLength >1) {
        this.initialTrajectoryLength = 0;
      }

      // Selection of a new series of points for a decision.
      if (!this.movementDecision) {
        this.paintMovementDecision = true;
        this.decideMovement(4);
        // The movement is decided and the counter is increased
        this.movementDecision = true;
        this.targetSampleAgent.x = this.trajectoryMovementSampleAgent[0].x;
        this.targetSampleAgent.y = this.trajectoryMovementSampleAgent[0].y;
        
        
        if (this.bezierProfile === 0) {
          this.initialTrajectoryLength += 0.05
        } else if (this.bezierProfile === 1) {
          this.initialTrajectoryLength += 0.1
        } else if (this.bezierProfile === 2) {
          this.initialTrajectoryLength += 0.2
        } else if (this.bezierProfile === 3) {
          this.initialTrajectoryLength +=0.5
        }
        
        
        this.hasArrivedSamplePlayer = false;
      }

      // condition to see if the agent arrived to the target.
      if (
        Math.abs(Math.floor(this.collisionX) - Math.floor(this.targetSampleAgent.x)) <=
        20 &&
        Math.abs(Math.floor(this.collisionY) - Math.floor(this.targetSampleAgent.y)) <= 20
      ) {
        this.hasArrivedSamplePlayer = true;
      }

      // CONDITION AGENT IS INCOMPETENT
      if (!this.competence) {
        this.agentDesiredSpeedX = randIntervalFromInterval(1, this.maxSpeed);
        this.agentDesiredSpeedY = randIntervalFromInterval(1, this.maxSpeed);
        this.slowRadiusAgent = 50;
      // CONDITION AGENT IS COMPETENT
      } else if (this.competence) {
        this.slowRadiusAgent = 50;
      }


      // CHANGE THE TARGET TO A NEW TARGET==========================================
      if (this.hasArrivedSamplePlayer) {

        // this.counterTarget++;

        if (this.trajectoryMovementSampleAgent.length === 1) {
          this.trajectoryMovementSampleAgent.shift();
          this.initialTrajectoryLength = 0;
          setTimeout(() => {
            this.movementDecision = false;
            this.thinkingTime = randIntervalFromIntervalInteger(200, 500)
          }, 50);
          this.initialTrajectoryLength = 0;
        }


        if (this.trajectoryMovementSampleAgent.length > 1) {

          this.trajectoryMovementSampleAgent.shift();
          this.targetSampleAgent.x = this.trajectoryMovementSampleAgent[0].x;
          this.targetSampleAgent.y = this.trajectoryMovementSampleAgent[0].y;

          this.hasArrivedSamplePlayer = false;

          if (!this.competence) {

            this.agentDesiredSpeedX = randIntervalFromInterval(1, this.maxSpeed);
            this.agentDesiredSpeedY = randIntervalFromInterval(1, this.maxSpeed);
            this.slowRadiusAgent = 50;
          } else if(this.competence) {
            this.slowRadiusAgent = 50;
          }

          // let steering = this.seek();
          let steering = 0;


          if (this.trajectoryMovementSampleAgent.length > 1) {
            steering = this.seek();
          } else if (this.trajectoryMovementSampleAgent.length === 1) {
            steering = this.movementAgent();
          }

          // let steering = this.movementAgent();
          this.applyForce(steering);

          this.speedX += this.accX;
          this.speedY += this.accY;

          

          this.prevCollisionX = this.collisionX;
          this.prevCollisionY = this.collisionY;

          this.collisionX += this.speedX;
          this.collisionY += this.speedY;

          this.prevRotation = this.rotation;

          this.rotation =
          (Math.atan2(
            this.collisionY - this.prevCollisionY,
            this.collisionX - this.prevCollisionX
          ) *
            180.0) /
          Math.PI;

          this.differenceRotation = this.rotation - this.prevRotation;

          this.prevAccX = this.accX;
          this.prevAccY = this.accY;

          if (this.speedX > this.maxSpeed) {
            this.speedX = this.maxSpeed;
          } else if (this.speedX < -this.maxSpeed) {
            this.speedX = -this.maxSpeed;
          }

          if (this.speedY > this.maxSpeed) {
            this.speedY = this.maxSpeed;
          } else if (this.speedY < -this.maxSpeed) {
            this.speedY = -this.maxSpeed;
          }

          this.moveErrorX = 0;
          this.moveErrorY = 0;

          this.accX = 0;
          this.accY = 0;



        } else if (this.trajectoryMovementSampleAgent.length === 0 &&
           this.collisionX - this.agent.collisionX <= 0 && this.collisionY - this.agent.collisionY <= 0) {

          this.accX = 0;
          this.accY = 0;

          this.speedX = 0;
          this.speedY = 0;


          this.prevCollisionX = this.collisionX;
          this.prevCollisionY = this.collisionY;

          this.collisionX += this.speedX;
          this.collisionY += this.speedY;

          this.prevRotation = this.rotation;

          this.rotation =
          (Math.atan2(
            this.collisionY - this.prevCollisionY,
            this.collisionX - this.prevCollisionX
          ) *
            180.0) /
          Math.PI;

          this.differenceRotation = this.rotation - this.prevRotation;

          this.prevAccX = this.accX;
          this.prevAccY = this.accY;

        }


      // There is still a target that the agent has to follow
      } else if (!this.hasArrivedSamplePlayer) {


        // let steering = this.seek();
        let steering = 0;

          if (this.trajectoryMovementSampleAgent.length > 1) {
            steering = this.seek();
          } else if (this.trajectoryMovementSampleAgent.length === 1) {
            steering = this.movementAgent();
          }

          console.log(`The length of the trajectory movement is: ${this.trajectoryMovementSampleAgent.length}`)

        // let steering = this.movementAgent();
        this.applyForce(steering);


        this.speedX += this.accX;
        this.speedY += this.accY;

        

        this.prevCollisionX = this.collisionX;
        this.prevCollisionY = this.collisionY;

        this.collisionX += this.speedX;
        this.collisionY += this.speedY;

        this.prevRotation = this.rotation;

        this.rotation =
          (Math.atan2(
            this.collisionY - this.prevCollisionY,
            this.collisionX - this.prevCollisionX
          ) *
            180.0) /
          Math.PI;

        this.differenceRotation = this.rotation - this.prevRotation;
        

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
  }


  mirroringMovement(socket, room) {


    if (this.agent.speedX !== undefined && this.agent.speedY !== undefined) {
      let force = {
        x: this.agent.speedX,
        y: this.agent.speedY,
      };
      force = normalize(force.x, force.y);
  
  
      if (!this.competence) {
        force.x = force.x * (this.agentDesiredSpeedX + (randIntervalFromInterval(0,this.maxSpeed - this.agent.speedX)));
        force.y = force.y * (this.agentDesiredSpeedY + (randIntervalFromInterval(0, this.maxSpeed - this.agent.speedY)));
        // console.log(`The desired speed is: ${this.agentDesiredSpeedX} and ${this.agentDesiredSpeedY}`)
        
        // console.log(`The force is: ${force.x} and ${force.y}`)
  
  
      } else if (this.competence) {
        force.x = this.agent.speedX;
        force.y = this.agent.speedY;
      }



      this.speedX = force.x;
      this.speedY = force.y;

      this.prevCollisionX = this.collisionX;
      this.prevCollisionY = this.collisionY;
      
      this.collisionX += this.speedX;
      this.collisionY += this.speedY;

      this.prevRotation = this.rotation;


      this.rotation =
          (Math.atan2(
            this.collisionY - this.prevCollisionY,
            this.collisionX - this.prevCollisionX
          ) *
            180.0) /
          Math.PI;

      this.differenceRotation = this.rotation - this.differenceRotation;


    } else {

      this.speedX = 0;
      this.speedY = 0;

      this.prevCollisionX = this.collisionX;
      this.prevCollisionY = this.collisionY;

      this.collisionX += this.speedX;
      this.collisionY += this.speedY;

      this.prevRotation = this.rotation;

      this.rotation =
          (Math.atan2(
            this.collisionY - this.prevCollisionY,
            this.collisionX - this.prevCollisionX
          ) *
            180.0) /
          Math.PI;

      this.differenceRotation = this.rotation - this.prevRotation;

    }

    

    // force.x = force.x * this.maxSpeed;
    // force.y = force.y * this.maxSpeed;

    // force = { x: force.x - this.speedX, y: force.y - this.speedY };

    // if (force.x > this.maxForce) {
    //   force.x = this.maxForce;
    // } else if (force.x < -this.maxForce) {
    //   force.x = -this.maxForce;
    // }

    // if (force.y > this.maxForce) {
    //   force.y = this.maxForce;
    // } else if (force.y < -this.maxForce) {
    //   force.y = -this.maxForce;
    // }



    
    if (this.player.speedX !== undefined && this.player.speedY !== undefined) {
      this.velocityVector = {x: this.player.speedX, y: this.player.speedY}

      this.speedX = this.velocityVector.x;
      this.speedY = this.velocityVector.y;

      
      
      this.prevCollisionX = this.collisionX;
      this.prevCollisionY = this.collisionY;

      this.collisionX += this.speedX;
      this.collisionY += this.speedY;

      this.prevRotation = this.rotation;

      this.rotation =
          (Math.atan2(
            this.collisionY - this.prevCollisionY,
            this.collisionX - this.prevCollisionX
          ) *
            180.0) /
          Math.PI;

      this.differenceRotation = this.rotation - this.prevRotation;
    } else {
      this.speedX = 0;
      this.speedY = 0;

      this.prevCollisionX = this.collisionX;
      this.prevCollisionY = this.collisionY;

      this.collisionX += this.speedX;
      this.collisionY += this.speedY;

      this.prevRotation = this.rotation;

      this.rotation =
          (Math.atan2(
            this.collisionY - this.prevCollisionY,
            this.collisionX - this.prevCollisionX
          ) *
            180.0) /
          Math.PI;

      this.differenceRotation = this.rotation - this.prevRotation;

    }

    if (!this.player.movementDecision) {
      // console.log('PLAYER STOPPED MOVING!!')
    }
    // this.velocityVector = { x: this.player.collisionX, y: this.player.collisionY };
    
    //   // let steering = this.seek();
    //   let steering = this.movementAgent()
    //   // let steering = this.arrive();
    //   this.applyForce(steering);

    //   this.accX += this.getRandomJitter();
    //   this.accY += this.getRandomJitter();

    //   this.speedX += this.accX;
    //   this.speedY += this.accY;

    //   this.collisionX += this.speedX;
    //   this.collisionY += this.speedY;

    //   this.accX = 0;
    //   this.accY = 0;
    
  }
  mirroringInverseMovement(socket, room) {

    if (this.player.speedX !== undefined && this.player.speedY !== undefined) {
      this.velocityVector = {x: -this.player.speedX, y: -this.player.speedY}

      this.speedX = this.velocityVector.x;
      this.speedY = this.velocityVector.y;

      
      
      this.prevCollisionX = this.collisionX;
      this.prevCollisionY = this.collisionY;

      this.collisionX += this.speedX;
      this.collisionY += this.speedY;

      this.prevRotation = this.rotation;

      this.rotation =
          (Math.atan2(
            this.collisionY - this.prevCollisionY,
            this.collisionX - this.prevCollisionX
          ) *
            180.0) /
          Math.PI;

      this.differenceRotation = this.rotation - this.prevRotation;
    } else {
      this.speedX = 0;
      this.speedY = 0;

      this.prevCollisionX = this.collisionX;
      this.prevCollisionY = this.collisionY;

      this.collisionX += this.speedX;
      this.collisionY += this.speedY;


      this.prevRotation = this.rotation;


      this.rotation =
          (Math.atan2(
            this.collisionY - this.prevCollisionY,
            this.collisionX - this.prevCollisionX
          ) *
            180.0) /
          Math.PI;

      this.differenceRotation = this.rotation - this.prevRotation;


    }

    if (!this.player.movementDecision) {
      // console.log('PLAYER STOPPED MOVING!!')
    }
    // this.velocityVector = { x: this.player.collisionX, y: this.player.collisionY };
    
    //   // let steering = this.seek();
    //   let steering = this.movementAgent()
    //   // let steering = this.arrive();
    //   this.applyForce(steering);

    //   this.accX += this.getRandomJitter();
    //   this.accY += this.getRandomJitter();

    //   this.speedX += this.accX;
    //   this.speedY += this.accY;

    //   this.collisionX += this.speedX;
    //   this.collisionY += this.speedY;

    //   this.accX = 0;
    //   this.accY = 0;

  }

  

  LeaderMovement(socket, room) {



    // Decide competence for the movement
    // if (this.competence) {
    //   this.maxJitter = 0;
    // } else {
    //   this.maxJitter = 10;
    // }
    this.maxJitter = 0;
    // console.log(`The target is ${this.targetSampleAgent.x} and ${this.targetSampleAgent.y}`)

    if (!this.predictability) {


      if (!this.movementDecision) {
        this.paintMovementDecision = true;
        this.decideMovement(5);
        // The movement is decided and the counter is increased
        this.movementDecision = true;
        // this.movementCounter++;
        // this.targetSampleAgent = trajectoryMovementSampleAgent[0];
        // console.log(this.trajectory)
        this.targetSampleAgent.x = this.trajectoryMovementSampleAgent[0].x;
        this.targetSampleAgent.y = this.trajectoryMovementSampleAgent[0].y;
        this.hasArrivedSamplePlayer = false;
      }


      // CONDITION TO SEE IF THE AGENT ARRIVED TO THE TARGET POINT
      if (
        Math.abs(Math.floor(this.collisionX) - Math.floor(this.targetSampleAgent.x)) <=
        20 &&
        Math.abs(Math.floor(this.collisionY) - Math.floor(this.targetSampleAgent.y)) <= 20
      ) {
        this.hasArrivedSamplePlayer = true;
      }

      // CHANGE THE TARGET TO A NEW TARGET==========================================
      if (this.hasArrivedSamplePlayer) {

        // this.counterTarget++;

        if (this.trajectoryMovementSampleAgent.length === 1) {
          this.trajectoryMovementSampleAgent.shift();
          setTimeout(() => {
            this.movementDecision = false;
            this.thinkingTime =  randIntervalFromIntervalInteger(200, 500)
          }, this.thinkingTime);
          
        }


        if (this.trajectoryMovementSampleAgent.length > 1) {

          this.trajectoryMovementSampleAgent.shift();
          this.targetSampleAgent.x = this.trajectoryMovementSampleAgent[0].x;
          this.targetSampleAgent.y = this.trajectoryMovementSampleAgent[0].y;

          // console.log(`The new target is: ${this.targetSampleAgent.x} and ${this.targetSampleAgent.y}`)

          this.hasArrivedSamplePlayer = false;

          if (!this.competence) {

            this.agentDesiredSpeedX = randIntervalFromInterval(0, this.maxSpeed);
            this.agentDesiredSpeedY = randIntervalFromInterval(0, this.maxSpeed);
            // console.log(`THE AGENT SPEED SELECTION IS: ${this.agentDesiredSpeedX} and ${this.agentDesiredSpeedY}`)
            this.slowRadiusAgent = randIntervalFromInterval(0, 50);
          } else if(this.competence) {
            this.slowRadiusAgent = 50;
          }

          // let steering = this.seek();
          let steering = 0;

          if (this.trajectoryMovementSampleAgent.length > 1) {
            steering = this.seek();
          } else if (this.trajectoryMovementSampleAgent.length === 1) {
            steering = this.movementAgent();
          }

          // let steering = this.movementAgent();
          this.applyForce(steering);


          this.speedX += this.accX;
          this.speedY += this.accY;

          this.prevCollisionX = this.collisionX;
          this.prevCollisionY = this.collisionY;

          this.collisionX += this.speedX;
          this.collisionY += this.speedY;

          this.prevRotation = this.rotation;

          this.rotation =
          (Math.atan2(
            this.collisionY - this.prevCollisionY,
            this.collisionX - this.prevCollisionX
          ) *
            180.0) /
          Math.PI;

          this.differenceRotation = this.rotation - this.prevRotation;
          

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


        } // else if (this.trajectoryMovementSampleAgent.length === 0 && this.collisionX - this.player.collisionX > 20 && this.collisionY - this.player.collisionY > 20) {
          // this.decideMovement(4);
          // this.movementDecision = true;
        //}


      // There is still a target that the agent has to follow
      } else if (!this.hasArrivedSamplePlayer) {

        // let steering = this.seek();
        let steering = 0;

          if (this.trajectoryMovementSampleAgent.length > 1) {
            steering = this.seek();
          } else if (this.trajectoryMovementSampleAgent.length === 1) {
            steering = this.movementAgent();
          }


        // let steering = this.movementAgent();
        // console.log(`THE STEERING IS: ${steering.x} AND ${steering.y}`)
        this.applyForce(steering);


        this.speedX += this.accX;
        this.speedY += this.accY;
        
        this.prevCollisionX = this.collisionX;
        this.prevCollisionY = this.collisionY;

        this.collisionX += this.speedX;
        this.collisionY += this.speedY;

        this.prevRotation = this.rotation;

          this.rotation =
          (Math.atan2(
            this.collisionY - this.prevCollisionY,
            this.collisionX - this.prevCollisionX
          ) *
            180.0) /
          Math.PI;

          this.differenceRotation = this.rotation - this.prevRotation;

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
      // ===============================================================================


    // CONDITION AGENT IS PREDICTABLE
    } else if (this.predictability) {

      if (!this.movementDecision) {
        this.paintMovementDecision = true;
        this.decideMovement(5);
        // The movement is decided and the counter is increased
        this.movementDecision = true;
        // this.movementCounter++;
        // this.targetSampleAgent = trajectoryMovementSampleAgent[0];
        // console.log(this.trajectory)
        this.targetSampleAgent.x = this.trajectoryMovementSampleAgent[0].x;
        this.targetSampleAgent.y = this.trajectoryMovementSampleAgent[0].y;
        this.hasArrivedSamplePlayer = false;
      }

      if (
        Math.abs(Math.floor(this.collisionX) - Math.floor(this.targetSampleAgent.x)) <=
        20 &&
        Math.abs(Math.floor(this.collisionY) - Math.floor(this.targetSampleAgent.y)) <= 20
      ) {
        this.hasArrivedSamplePlayer = true;
      }


      // CONDITION AGENT IS INCOMPETENT
      if (!this.competence) {
        this.agentDesiredSpeedX = randIntervalFromInterval(0, this.maxSpeed);
        this.agentDesiredSpeedY = randIntervalFromInterval(0, this.maxSpeed);
        this.slowRadiusAgent = randIntervalFromInterval(0, 50);
        // console.log(`The desired speed is: ${this.agentDesiredSpeedX} and ${this.agentDesiredSpeedY}`)
      // CONDITION AGENT IS COMPETENT
      } else if (this.competence) {
        this.slowRadiusAgent = 50;
      }


      // CHANGE THE TARGET TO A NEW TARGET==========================================
      if (this.hasArrivedSamplePlayer) {

        // this.counterTarget++;

        if (this.trajectoryMovementSampleAgent.length === 1) {
          this.trajectoryMovementSampleAgent.shift();
          setTimeout(() => {
            this.movementDecision = false;
            this.thinkingTime = randIntervalFromIntervalInteger(200, 500)
          }, this.thinkingTime);
          
        }


        if (this.trajectoryMovementSampleAgent.length > 1) {

          this.trajectoryMovementSampleAgent.shift();
          this.targetSampleAgent.x = this.trajectoryMovementSampleAgent[0].x;
          this.targetSampleAgent.y = this.trajectoryMovementSampleAgent[0].y;

          // console.log(`The new target is: ${this.targetSampleAgent.x} and ${this.targetSampleAgent.y}`)

          this.hasArrivedSamplePlayer = false;

          if (!this.competence) {

            this.agentDesiredSpeedX = randIntervalFromInterval(0, this.maxSpeed);
            this.agentDesiredSpeedY = randIntervalFromInterval(0, this.maxSpeed);
            // console.log(`THE AGENT SPEED SELECTION IS: ${this.agentDesiredSpeedX} and ${this.agentDesiredSpeedY}`)
            this.slowRadiusAgent = randIntervalFromInterval(0, 50);
          } else if(this.competence) {
            this.slowRadiusAgent = 50;
          }

          // let steering = this.seek();
          let steering = 0;

          if (this.trajectoryMovementSampleAgent.length > 1) {
            steering = this.seek();
          } else if (this.trajectoryMovementSampleAgent.length === 1) {
            steering = this.movementAgent();
          }

          // let steering = this.movementAgent();
          this.applyForce(steering);

          this.speedX += this.accX;
          this.speedY += this.accY;

          

          this.prevCollisionX = this.collisionX;
          this.prevCollisionY = this.collisionY;

          this.collisionX += this.speedX;
          this.collisionY += this.speedY;

          this.prevRotation = this.rotation;

          this.rotation =
          (Math.atan2(
            this.collisionY - this.prevCollisionY,
            this.collisionX - this.prevCollisionX
          ) *
            180.0) /
          Math.PI;

          this.differenceRotation = this.rotation - this.prevRotation;

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


        } // else if (this.trajectoryMovementSampleAgent.length === 0 && this.collisionX - this.player.collisionX > 20 && this.collisionY - this.player.collisionY > 20) {
          // this.decideMovement(4);
          // this.movementDecision = true;
        //}


      // There is still a target that the agent has to follow
      } else if (!this.hasArrivedSamplePlayer) {


        // let steering = this.seek();
        let steering = 0;

          if (this.trajectoryMovementSampleAgent.length > 1) {
            steering = this.seek();
          } else if (this.trajectoryMovementSamplePlayer.length === 1) {
            steering = this.movementAgent();
          }

        // let steering = this.movementAgent();
        // console.log(`THE STEERING IS: ${steering.x} AND ${steering.y}`)
        this.applyForce(steering);


        this.speedX += this.accX;
        this.speedY += this.accY;

        

        this.prevCollisionX = this.collisionX;
        this.prevCollisionY = this.collisionY;

        this.collisionX += this.speedX;
        this.collisionY += this.speedY;

        this.prevRotation = this.rotation;

          this.rotation =
          (Math.atan2(
            this.collisionY - this.prevCollisionY,
            this.collisionX - this.prevCollisionX
          ) *
            180.0) /
          Math.PI;

          this.differenceRotation = this.rotation - this.prevRotation;

        

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
    // WORK IN PROGRESS =======================================================================================

  }

  updateBot(socket, room) {

  }



  update(random, targetX, targetY, socket, room) {
    if (this.role === 0) {
      // this.target = {x: targetX, y: targetY}
      // this.mirroringMovement(socket, room);
      // his.follower = true;
      // console.log(`THE Value Follow: ${this.follower}`)
      if (this.followerBehaviorType === 0) {
        this.followerMovement(socket,room);
      } else if (this.followerBehaviorType === 1) {
        this.mirroringMovement(socket, room);
      } else if (this.followerBehaviorType === 2) {
        this.mirroringInverseMovement(socket, room)
      }
      

      this.scoreSimilarityNoLeader();
      // console.log(`The score of direction is: ${this.scoreRotationSimilarityAgent}`)
      // console.log(`The rotation of player: ${this.player.rotation} and of the agent: ${this.rotation}`)
      // console.log(`X: P: ${this.prevCollisionX} C: ${this.collisionX} ; P: ${this.prevCollisionY} C: ${this.collisionY}`)
    } else if (this.role === 1) {
      this.follower = false;
      this.LeaderMovement(socket, room);
      // console.log(`The curvature is: ${calculateCurvature(this.speedX,this.speedY, this.prevAccX, this.prevAccY)}`)
    console.log(`The rotation of agent: ${this.differenceRotation}`)
    // console.log(`The rotation and previous is: ${this.rotation} and ${this.prevRotation}`)
    } else if (this.role === 2) {
      this.noLeaderMovement(socket,room);
    }

    // console.log(`The speed of the agent X: ${this.speedX} and Y: ${this.speedY}`)
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
