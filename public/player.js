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
        
        // console.log(`For the counter: ${this.counterTestSpeed} the value of function: ${ 10 * easeInSine(this.counterTestSpeed)}`)
        
        // console.log(`The player collision in X: ${this.collisionX} and for Y: ${this.collisionY}`)
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
            // console.log(`The movement was registered as a stop.`)
        }

        this.prevMouseX = this.collisionX;
        this.prevMouseY = this.collisionY;
        // console.log(`The collision in X: ${Math.round(this.collisionX + moveX * dt)} and Y: ${Math.round(this.collisionY + moveY * dt)}`)
        this.forcePlayerX = linearInterpolation(0, 20, Math.abs(moveX) / 300);
        this.forcePlayerY = linearInterpolation(0, 20, Math.abs(moveY) / 300);
        
        let forceX = linearInterpolation(0, 20, Math.abs(moveX)/300)
        let forceY = linearInterpolation(0, 20, Math.abs(moveY)/300)

        // console.log(`The rotation and previous is: ${this.rotation} and ${this.prevRotation}`)
        // console.log(`The rotation difference is: ${this.differenceRotation}`)

        // if (forceX > 20 || forceX < -20) {
        //     this.overSpeedX++
        // }
        // if (forceY > 20 || forceX < -20) {
        //     this.overSpeedY++
        // }

        // console.log(`The amount of times it went over speed is: ${this.overSpeedX} and ${this.overSpeedY}`)

        if (moveX < 0) {
            forceX = - forceX;
            this.forcePlayerX = - this.forcePlayerX;
        }

        if (moveY < 0) {
            forceY = - forceY;
            this.forcePlayerY = - this.forcePlayerY;
        }

        if (forceX > 20) {
            forceX = 20;
            this.forcePlayerX = 20;

        } else if (forceX < -20) {
            forceX = -20;
            this.forcePlayerX = -20;
        }

        if (forceY > 20) {
            forceY = 20;
            this.forcePlayerY = 20;
        } else if (forceY < -20){
            forceY = -20;
            this.forcePlayerY = 20;
        }

        // console.log(`The forces are in X: ${forceX} and Y: ${forceY}`)

        // this.collisionX += moveX;
        // this.collisionY += moveY;

       

        this.collisionX += forceX
        this.collisionY += forceY


        // this.collisionX = Math.round(this.collisionX + moveX * dt);
        // this.collisionY = Math.round(this.collisionY + moveY * dt);
        // if (moveX !== 0) {
        //     this.collisionX += moveX * dt
        // } else if (moveX === NaN) {
        //     this.collisionX = 200
        //     console.log(`Entered Function NaN in X`)
        // }

        // if (moveY !== 0) {
        //     this.collisionY += moveY * dt
        // } else if (moveY === NaN) {
        //     this.collisionY = 200
        //     console.log(`Entered Function NaN in Y`)
        // }
        

        // this.collisionX += moveX * dt
        // this.collisionY += moveY * dt

        // this.collisionX += moveX * dt
        // this.collisionY += moveY * dt
        // if (moveX <=1 && moveX >=-1) {
        //     moveX = 0;
        // }

        // if (moveY <= 1 && moveY >=-1) {
        //     moveY = 0;
        // }

        // if (moveX >= this.maxSpeed) {
        //     this.collisionX += this.maxSpeed  
        // } else if (moveX < - this.maxSpeed) {
        //     this.collisionX += - this.maxSpeed
        // } else {
        //     this.collisionX += moveX * dt;
        // }

        // if (moveY > this.maxSpeed) {
        //     this.collisionY += this.maxSpeed  
        // } else if (moveY < - this.maxSpeed) {
        //     this.collisionY +=  - this.maxSpeed
        // } else {
        //     this.collisionY += moveY * dt;
        // }




        
        // console.log(`The movement of the mouse in x: ${moveX} and in y: ${moveY}`)

        // this.speedX = (this.collisionX - this.prevMouseX) / (this.timeCurrent - this.timePrev);
        // this.speedY = (this.collisionY - this.prevMouseY) / (this.timeCurrent - this.timePrev);

        this.speedX = (this.collisionX - this.prevMouseX)
        this.speedY = (this.collisionY - this.prevMouseY)
        // console.log(`X: P: ${this.prevMouseX} ; C: ${this.collisionX} Y: ${this.collisionY} ; ${this.prevMouseY}`)

        this.prevRotation = this.rotation;


        this.rotation =
        (Math.atan2(this.collisionY - this.prevMouseY, this.collisionX - this.prevMouseX)  *
          180.0) / Math.PI;

        this.timePrev = this.timeCurrent;

        this.differenceRotation = this.rotation - this.prevRotation;


        // console.log(`The rotation is: ${this.rotation}`)

        // console.log(`The rotation of the player is: ${this.rotation}`)

        // console.log(`The speed in X: ${this.collisionX - this.prevMouseX} and in Y: ${this.collisionY - this.prevMouseY}`)




        // this.collisionX += e.movementX;
        // this.collisionY += e.movementY;


        // this.speedX += this.accX
        // this.speedY += this.accY

        // this.prevAccX = this.accX
        // this.prevAccY = this.accY

        // if (this.game.mouse.x !== undefined) {
        //     this.prevMouseX = this.game.mouse.x
            
        // }

        // if (this.game.mouse.y !== undefined) {
        //     this.prevMouseY = this.game.mouse.y
        // }
        

        
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

        // this.collisionX += this.speedX;
        // this.collisionY += this.speedY;

        // this.accX = 0
        // this.accY = 0

        // console.log(`Speed in X is: ${this.speedX} and Speed in Y is: ${this.speedY}`)
        // this.collisionX += this.speedX;
        // this.collisionY += this.speedY;

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