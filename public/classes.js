export class Player {
    constructor({ position, minVelocity, maxVelocity, color = "red" }) {
      this.position = position;
      this.minVelocity = minVelocity;
      this.maxVelocity = maxVelocity;
    //   this.height = 150;
    //   this.width = 50;
      this.size = 15;
    //   this.attackBox = {
    //     position: {
    //       x: this.position.x,
    //       y: this.position.y,
    //     },
    //       offset,
    //       width: 100,
    //       height: 50,
    //     };
        this.color = color;
    }
      
    draw() {
        ctx.fillStyle = this.color;
        // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2)
        ctx.fill()
    }
      
    update() {
        // ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
        this.draw();
        
        this.position.x += this.minVelocity;
        this.position.y += this.minVelocity;

        // Detect Side Walls
        if (this.position.x + this.size > canvas.width) {
            this.position.x = canvas.width - this.size
        }

        if (this.position.x - this.size < 0) {
            this.position.x = this.size
        }

        // Detect top and bottom walls
        if (this.position.y + this.size > canvas.height) {
            this.position.y = canvas.height
        }

        if (this.position.y - this.size < 0) {
            this.position.y = this.size
        }
      
        // this.position.x += this.minVelocity;
        // this.position.y += this.minVelocity;
      
        // if (this.position.y + this.height + this.velocity.y >= canvas.height -96) {
        //  this.velocity.y = 0;
        //  } else {
        //  this.velocity.y += gravity;
        //  }
    }
  }