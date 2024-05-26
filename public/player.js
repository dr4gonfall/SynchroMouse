class Player {
    constructor(game){
        this.game = game;
        this.collisionX = this.game.width * 0.25;
        this.collisionY = this.game.height * 0.25;
        this.prevMouseX = this.collisionX;
        this.prevMouseY = this.collisionY;
        this.collisionRadius = 20;
        this.speedX = 0;
        this.speedY = 0;
        this.rotation = 0;
        this.prevRotation = 0;
        this.differenceRotation = 0;
        this.counterTestSpeed = 0;
        // Acceleration of the Agent.
        this.accX = 0;
        this.accY = 0;
        this.prevAccX = this.accX
        this.prevAccY = this.accY
        this.maxAcceleration = 5;
        // Forces of the Agent.
        this.force = 0;
        this.maxForce = 7.0;
        this.movementDecision = false;
        this.timerDecision = 0;
        // PREVIOUS ACCELERATION
        // this.dx = 0;
        // this.dy = 0;
        this.maxSpeed = 10;
        this.overSpeedX = 0;
        this.overSpeedY = 0;
        // this.maxForce = 100;
        this.movementCounter = 0;
        this.prevMoveDec = this.movementDecision;
        this.rawMouseMoveX = 0;
        this.rawMouseMoveY = 0;
        this.forcePlayerX = 0;
        this.forcePlayerY = 0;
        this.timePrev = performance.now()
        this.timeCurrent = performance.now()
    }

    applyForce(force) {
        // Add the acceleration to the movements of the agent.
        // this.acc.add(force)
        this.accX += force.x
        this.accY += force.y
    }

    seek() {
        
        let force = {x: 0, y: 0}
        if (this.game.mouse.x !== undefined) {
          // force = {x: this.game.mouse.x - this.collisionX, y: this.game.mouse.y - this.collisionY};
          force.x = this.game.mouse.x - this.collisionX
        } else if (this.game.mouse.x === undefined) {
            force.x = this.prevMouseX - this.collisionX
        }

        if (this.game.mouse.y !== undefined) {
            force.y = this.game.mouse.y - this.collisionY
        } else if (this.game.mouse.y === undefined) {
            force.y = this.prevMouseY - this.collisionY
            
        }


        // console.log(`The force in X: ${force.x} and in Y: ${force.y}`)

        if (this.defineMagnitude(force.x, force.y) !== 0) {
            force = this.normalize(force.x, force.y)

        
            force.x = force.x * this.maxSpeed
            force.y = force.y * this.maxSpeed
        } else if (this.defineMagnitude(force.x, force.y) === 0) {
            force.x = 0;
            force.y = 0;
        }
        

        

        

        force = {x: force.x - this.speedX, y: force.y - this.speedY}

        if (force.x > this.maxForce) {
            force.x = this.maxForce
        }

        if (force.y > this.maxForce) {
            force.y = this.maxForce
        }

        // console.log(`The force in X: ${force.x} and in Y: ${force.y}`)
        return force;

    }

    // linearly maps value from the range (a..b) to (c..d)
    mapRange (value, a, b, c, d) {
        // first map value from (a..b) to (0..1)
        value = (value - a) / (b - a);
        // then map it from (0..1) to (c..d) and return it
        return c + value * (d - c);
    }

    arrive() {

        let force = {x: 0, y: 0}
        if (this.game.mouse.x !== undefined) {
          // force = {x: this.game.mouse.x - this.collisionX, y: this.game.mouse.y - this.collisionY};
          force.x = this.game.mouse.x - this.collisionX
        } else if (this.game.mouse.x === undefined) {
            force.x = this.prevMouseX - this.collisionY
  
        }

        if (this.game.mouse.y !== undefined) {
            force.y = this.game.mouse.y - this.collisionY
        } else if (this.game.mouse.y === undefined) {
             force.y = this.prevMouseY - this.collisionY

        }
         
        let slowRadius = 100;
        let d = this.defineMagnitude(force.x, force.y)

        if (d < slowRadius) {
            let desiredSpeed = this.mapRange(d, 0, slowRadius, 0, this.maxSpeed)
            // console.log(force)
            if (this.defineMagnitude(force.x, force.y) !== 0) {
                force = this.normalize(force.x, force.y)
                // console.log(force)
                // console.log(`The force in X is: ${force.x} and in Y: ${force.y}`)
                // console.log(`The previous mouse position in X: ${this.prevMouseX} and in Y: ${this.prevMouseY}`)
                force.x = force.x * desiredSpeed
                force.y = force.y * desiredSpeed  
            } else {
                force.x = 0
                force.y = 0
            }
            
        } else {
            force = this.normalize(force.x, force.y)
            force.x = force.x * this.maxSpeed
            force.y = force.y * this.maxSpeed
        }

        // force = normalize(force.x, force.y)
        // force.x = force.x * this.maxSpeed
        // force.y = force.y * this.maxSpeed

        force = {x: force.x - this.speedX, y: force.y - this.speedY}

        if (force.x > this.maxForce) {
            force.x = this.maxForce
        }

        if (force.y > this.maxForce) {
            force.y = this.maxForce
        }

        
        return force;

    }

    defineMagnitude(x, y) {
        return Math.sqrt(x ** 2 + y ** 2)
    }

    normalize(x, y) {
        let m = this.defineMagnitude(x, y);
        if (m > 0) {
            return {x: x/m, y: y/m}
        }
    }

    draw(context){
        // console.log(`draw: ${this.collisionX} Y: ${this.collisionY}`)
        context.beginPath();
        context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
        context.save();
        context.globalAlpha = 0.5;
        context.fillStyle = 'blue'
        context.fill();
        context.restore();
        context.stroke();
        // context.beginPath();
        // context.moveTo(this.collisionX, this.collisionY);
        // context.lineTo(this.game.mouse.x, this.game.mouse.y);
        // context.stroke()
    }

    // linearly maps value from the range (a..b) to (c..d)
  mapRange(value, a, b, c, d) {
    // first map value from (a..b) to (0..1)
    value = (value - a) / (b - a);
    // then map it from (0..1) to (c..d) and return it
    return c + value * (d - c);
  }

    update(moveX, moveY){
        this.counterTestSpeed += 0.1;

        if (this.counterTestSpeed >=1) {
            this.counterTestSpeed = 0;
        }
        
        this.rawMouseMoveX = moveX;
        this.rawMouseMoveY = moveY;
        this.timeCurrent = performance.now()
        
        this.prevMoveDec = this.movementDecision;

        if (this.speedX === 0 && this.speedY === 0) {
            this.timerDecision ++
        }

        if (this.speedX !== 0 || this.speedY !== 0) {
            this.timerDecision = 0
            this.movementDecision = true
        }

        if (this.timerDecision >= 5) {
            this.movementDecision = false
        }

        this.prevMouseX = this.collisionX;
        this.prevMouseY = this.collisionY;

        this.forcePlayerX = linearInterpolation(0, this.maxSpeed, Math.abs(moveX) / 300);
        this.forcePlayerY = linearInterpolation(0, this.maxSpeed, Math.abs(moveY) / 300);
        
        let forceX = linearInterpolation(0, this.maxSpeed, Math.abs(moveX)/300)
        let forceY = linearInterpolation(0, this.maxSpeed, Math.abs(moveY)/300)


        if (moveX < 0) {
            forceX = - forceX;
            this.forcePlayerX = - this.forcePlayerX;
        }

        if (moveY < 0) {
            forceY = - forceY;
            this.forcePlayerY = - this.forcePlayerY;
        }

        if (forceX > this.maxSpeed) {
            forceX = this.maxSpeed;
            this.forcePlayerX = this.maxSpeed;

        } else if (forceX < -this.maxSpeed) {
            forceX = -this.maxSpeed;
            this.forcePlayerX = -20;
        }

        if (forceY > this.maxSpeed) {
            forceY = this.maxSpeed;
            this.forcePlayerY = this.maxSpeed;
        } else if (forceY < -this.maxSpeed){
            forceY = -this.maxSpeed;
            this.forcePlayerY = this.maxSpeed;
        }
      

        this.collisionX += forceX
        this.collisionY += forceY
        
        

        this.speedX = (this.collisionX - this.prevMouseX)
        this.speedY = (this.collisionY - this.prevMouseY)
        // console.log(`X: P: ${this.prevMouseX} ; C: ${this.collisionX} Y: ${this.collisionY} ; ${this.prevMouseY}`)

        this.prevRotation = this.rotation;


        this.rotation =
        (Math.atan2(this.collisionY - this.prevMouseY, this.collisionX - this.prevMouseX)  *
          180.0) / Math.PI;

        this.timePrev = this.timeCurrent;

        this.differenceRotation = this.rotation - this.prevRotation;

        // Detect Side Walls
        if (this.collisionX + this.collisionRadius > this.game.width) {
            this.collisionX = this.game.width - this.collisionRadius
        }

        if (this.collisionX - this.collisionRadius < 0) {
            this.collisionX = this.collisionRadius
        }


        // Detect top and bottom walls
        if (this.collisionY + this.collisionRadius > this.game.height) {
            this.collisionY = this.game.height -this.collisionRadius
        }

        if (this.collisionY - this.collisionRadius < 0) {
            this.collisionY = this.collisionRadius
        }

        
    }
}