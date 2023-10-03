class TutorialBot {
    constructor(game, player) {
      this.game = game;
      this.player = player;
      this.tutorialCondition = 0; 
      this.radians = 0;
      this.velocityCircle = 0.01;
      this.radiusCircle = 10;
      // Position of the agent.
      this.collisionX = this.game.width * 2/4;
      this.collisionY = this.game.height * 0.5;
      this.prevCollisionX = this.collisionX;
      this.prevCollisionY = this.collisionY;
      this.collisionRadius = 20;
      this.frequency = 1;
      this.velocityFunctionStep = 0.01;
      this.percentageFunction = 0;
      // Speed of the Agent (Changes depend on Competence).
      this.speedX = 0;
      this.speedY = 0;
      this.speedXPoint = 0;
      this.speedYPoint = 0;
      this.degreesVariationX = 0;
      this.degreesVariationY = 0;
  
      this.prevRotation = 0;
      this.differenceRotation = 0;
      this.hasArrivedEndBezier = false;
      this.pendingEndBezier = [{x: this.player.collisionX, y: this.player.collisionY}];
  
      this.velocityFunctionProfile = 0;
  
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
      this.playerNotMovingCounter = 0;
  
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
      this.player = this.game.player;
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
      this.trajectoryMovementSamplePlayer = [];
      // End point array for the Bezier curve based on the player position
      this.playerEndPoint = { x: this.player.collisionX, y: this.player.collisionY };
      // Current target of the agent.
      this.target = { x: 500, y: 200 };
      // Current target based on position of the player.
      this.targetSamplePlayer = { x: this.player.collisionX, y: this.player.collisionY }
      // Verify the agent has arrived to a given target.
      this.hasArrived = false;
      this.hasArrivedSamplePlayer = false;
      // Counter for the current target in the trayectory.
      this.counterTarget = 0;
      // Counter for the target in the follower movement.
      this.counterTargetPlayerSample = 0;
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
      this.amountOfSharpTurnsPlayer = 0;
      this.amountOfSmoothTurnsPlayer = 0;
  
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
  
    }
  
    // Agent controls:
    // The agent will have a pointer similar to the human and there will be a direction and distance depending on the force.
  
    applyForce(force) {
      // Add the acceleration to the movements of the agent.
      this.accX += force.x;
      this.accY += force.y;
    }
  

  
    // Execution of the Bezier Curve Points =========================================

  
    arrive() {
      let force = {
        x: this.player.collisionX - this.collisionX,
        y: this.player.collisionY - this.collisionY,
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


  
    seek(arrival = false) {
      let force = {
        x: this.player.collisionX - this.collisionX,
        y: this.player.collisionY - this.collisionY,
      };
      force = normalize(force.x, force.y);
      // console.log(`The force in X: ${force.x} and Y: ${force.y}`)
  
      force.x = force.x * this.maxSpeed;
      force.y = force.y * this.maxSpeed;
  
      force = { x: force.x - this.speedX, y: force.y - this.speedY };
  
      return force;
    }
  
    getRandomJitter() {
      return (Math.random() - 0.5) * 2 * this.maxJitter;
    }
  
  
    mirroringMovement(socket, room) {
  
      
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
    }
  
  
  
    update(random, targetX, targetY, socket, room) {
      

        if(this.tutorialCondition === 0){
            this.speedX = 0;
            this.speedY = 0;

            this.collisionX += this.speedX;
            this.collisionY += this.speedY;
        } else if (this.tutorialCondition === 1) {
            this.radians += 0.01;
            // this.speedX = Math.cos(this.radians) * 180;
            // this.speedY = Math.sin(this.radians) * 180;


            this.collisionX += Math.cos(this.radians);
            this.collisionY += Math.sin(this.radians);
            // console.log(`The collision in X: ${this.collisionX} and Y: ${this.collisionY}`)
        } else if (this.tutorialCondition === 2) {
            let steering = this.arrive()
            this.applyForce(steering);

            this.speedX += this.accX;
            this.speedY += this.accY;

            
            this.collisionX += this.speedX;
            this.collisionY += this.speedY;

            this.accX = 0;
            this.accY = 0;
        }
  
  
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