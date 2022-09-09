// const { request } = require("express");
// import {Player} from './classes'



function toggleScreen(id, toggle) {
    let element = document.getElementById(id)
    let display = (toggle) ? 'block': 'none';
    element.style.display = display
}

function startInstructions() {
    toggleScreen('start-screen', false)
    toggleScreen('tutorial-screen', true)
}

function startGameMode() {
    toggleScreen('tutorial-screen', false)
    toggleScreen('select-mode-screen', true)
}

function startTutorial() {
    
}

function startGameHumanTeam() {
    toggleScreen('select-mode-screen', false)
    toggleScreen('wrapper', true)
    init()
}

function startGameHAT() {
    toggleScreen('select-mode-screen', false)
    toggleScreen('wrapper-HAT', true)
    HATGame()
}

function HATGame() {
    const canvas = document.getElementById("canvas-HAT");
    // console.log(document.getElementById("canvas-HAT"))
    const ctx = canvas.getContext("2d");

    canvas.width = 1024;
    canvas.height = 576;

    let xpos
    let ypos

    class Player {
        constructor({ position, velocity, angle, maxVelocity, rotationVel, acceleration, color = "red" }) {
          this.position = position;
          this.velocity = velocity
          this.angle = angle
          this.maxVelocity =  maxVelocity
          this.rotationVel = rotationVel
          this.acceleration = acceleration
        //   this.minVelocity = minVelocity;
        //   this.maxVelocity = maxVelocity;
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
            // ctx.translate(this.position.x, this.position.y)
            ctx.beginPath()
            ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2)
            ctx.fill()
            // ctx.restore()
        }
          
        update() {
            // ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
            this.draw();
            
            // this.position.x += this.minVelocity;
            // this.position.y += this.minVelocity;
            
            // console.log(this.position.x + ', ' + this.position.y)

            this.position.x += this.velocity.x * Math.sin(this.angle);
            this.position.y += this.velocity.x * Math.cos(this.angle)

            console.log('The position is: ' + this.position.x + " The velocity is: " + this.velocity.x)

            // ctx.translate(this.position.x, this.position.y)
            // this.position.y += this.velocity;

            // Detect Side Walls
            if (this.position.x + this.size > canvas.width) {
                this.position.x = canvas.width - this.size
            }
    
            if (this.position.x - this.size < 0) {
                this.position.x = this.size
            }

    
            // Detect top and bottom walls
            if (this.position.y + this.size > canvas.height) {
                this.position.y = canvas.height -this.size
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

    const player = new Player({
        position: {
          x: 200,
          y: 200,
        },
        maxVelocity: 5,
        acceleration: 0.1,
        rotationVel: 0.1,
        // velocity: 0,
        angle: 0,
        // minVelocity: 5,
        // maxVelocity:15,
         velocity: {
           x: 0,
           y: 0,
         },
      });
    console.log(player)
    // MOUSE MOVEMENTS
    // canvas.addEventListener('mousemove', function (event) {
    //     let mouseX = event.pageX - canvas.offsetLeft
    //     let mouseY = event.pageY - canvas.offsetTop
    //     document.getElementById("objectCoords-HAT").innerHTML = mouseX  + ", " + mouseY;
    //     xpos = mouseX
    //     ypos = mouseY
    //     return {
    //         x: mouseX,
    //         y: mouseY
    //     }
    // })
    
// EVENT LISTENERS FOR KEYS
window.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "d":
            keys.d.pressed = true;
            player.lastKey = "d";
            break;
        case "a":
            keys.a.pressed = true;
            player.lastKey = "a"
            break;
        case "s":
            keys.s.pressed = true;
            player.lastKey = "s"
            break;
        case "w":
            keys.w.pressed = true;
            player.lastKey = "w"
            break;
    }
});

window.addEventListener("keyup", (event) => {
    // Player Key Press
    switch (event.key) {
        case "d":
            keys.d.pressed = false;
            break;
        case "a":
            keys.a.pressed = false;
            break;
        case "s":
            keys.s.pressed = false;
            break;
        case "w":
            keys.w.pressed = false;
            break;
        default:
            break;
    }
})
    const keys = {
        d: {
            pressed: false,
        },
        a: {
            pressed: false,
        },
        w: {
            pressed: false,
        },
        s: {
            pressed: false,
        },
  };

    // document.getElementById("objectCoords-HAT").innerHTML = xpos + ", " + ypos;

    // const circle = {
    //     x: 200,
    //     y: 200,
    //     size: 15,
    // }

    // function drawCircle() {
    //     ctx.beginPath()
    //     ctx.arc(circle.x, circle.y, circle.size, 0, Math.PI * 2)
    //     ctx.fillStyle = "red"
    //     ctx.fill()
    // }

    function animate() {

        window.requestAnimationFrame(animate);
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // player.position.x = xpos + player.minVelocity
        // player.position.y = ypos + player.minVelocity
        player.update();
        
        // enemy.update();

        // player.velocity = 0
         // player.velocity.x = 0;
         // player.velocity.y = 0;

        console.log('The last key pressed was: ' + player.lastKey)

        // Player Movement
        if (keys.d.pressed) {
            player.angle -= player.rotationVel
            console.log('Angle: ' + player.angle)
        } else if (keys.a.pressed) {
            player.angle += player.rotationVel
            console.log('Angle: ' + player.angle)
        } else if (keys.s.pressed) {

        } else if (keys.w.pressed) {
            player.velocity.x = Math.min(player.velocity.x + player.acceleration, player.maxVelocity)
            // console.log('Acceleration: ' + player.acceleration + ' Velocity: ' + player.velocity.x)
        }

        if (!keys.w.pressed) {
            player.velocity.x = Math.max(player.velocity.x - player.acceleration, 0)
            // console.log('Acceleration: ' + player.acceleration + ' Velocity: ' + player.velocity.x)
        } 

        // if (!keys.s.pressed) {
        //     player.velocity.x = Math.min(player.velocity.x + player.acceleration, 0)
        //     console.log('Acceleration: ' + player.acceleration + ' Velocity: ' + player.velocity.x)
        // }
        
        // if (!keys.a.pressed) {
        //     player.angle = Math.max(player.angle - player.rotationVel, 0)
        // }

        // if (!keys.d.pressed && player.lastKey == "d") {
        //     player.angle = Math.min(player.angle + (player.rotationVel / 10), 0)
        //     console.log('Angle not pressed Input d: ' + player.angle - player.rotationVel)
        // }

        // if (!keys.a.pressed && player.lastKey == "a") {
        //     player.angle = Math.max(player.angle - (player.rotationVel / 10), 0)
        //     console.log('Angle not pressed Input a: ' + player.angle - player.rotationVel)
        // }

        // player.velocity.x = 0;
        // enemy.velocity.x = 0;

        // Player Movement
        // if (keys.a.pressed && player.lastKey === "a") {
        //     player.velocity.x = -5;
        // } else if (keys.d.pressed && player.lastKey === "d") {
        //     player.velocity.x = 5;
        // }



        // ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
            
        // drawCircle()
        // // Change position
        // circle.x = xpos;
        // circle.y = ypos;

        // // Detect Side Walls
        // if (circle.x + circle.size > canvas.width) {
        //     circle.x = canvas.width -circle.size
        // }

        // if (circle.x - circle.size < 0) {
        //     circle.x = circle.size
        // }

        // // Detect top and bottom walls
        // if (circle.y + circle.size > canvas.height) {
        //     circle.y = canvas.height
        // }

        // if (circle.y - circle.size < 0) {
        //     circle.y = circle.size
        // }

        // requestAnimationFrame(animate)
    }

    


    animate()

    


}

function getMousePos(canvas, event) {
    let mouseX = event.pageX - canvas.offsetLeft
    let mouseY = event.pageY - canvas.offsetTop
    return {
        x: mouseX,
        y: mouseY
    }
}

var init = function() {
    var socket = io();
    var room = '';
    var game = document.getElementById('game');
    var prevX = 0;
    var prevY = 0;
    var rotation = 0;
    var admin = false;
    var hiscore = 0;
    var startTimer = undefined;
    var scaleFactor = 1.0;

    // -------------------------CANVAS CREATION----------------
    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    canvas.width = 1024
    canvas.height = 576

    function findObjCoords(mouseEvent) {
        let obj = document.getElementById("canvas")
        let obj_left = 0;
        let obj_top = 0;
        let xpos;
        let ypos;

        while (obj.offsetParent) {
            obj_left += obj.offsetLeft
            obj_top += obj.offsetTop
            obj = obj.offsetParent
        }

        if (mouseEvent) {
            // Firefox
            xpos = mouseEvent.pageX
            ypos = mouseEvent.pageY

        } else {
            //IE
            xpos= window.event.x + document.body.scrollLeft - 2;
            ypos = window.event.y + document.body.scrollTop - 2;
        }
        xpos -= obj_left;
        ypos -= obj_top;

        document.getElementById("objectCoords").innerHTML = xpos + ", " + ypos;

        const circle = {
            x: 200,
            y: 200,
            size: 15,
        }

        function drawCircle() {
            ctx.beginPath()
            ctx.arc(circle.x, circle.y, circle.size, 0, Math.PI * 2)
            ctx.fillStyle = "red"
            ctx.fill()
        }

        function update1() {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
            
            drawCircle()

            // Change position
            circle.x = xpos;
            circle.y = ypos;

            // Detect Side Walls
            if (circle.x + circle.size > canvas.width) {
                circle.x = canvas.width -circle.size
            }

            if (circle.x - circle.size < 0) {
                circle.x = circle.size
            }

            // Detect top and bottom walls
            if (circle.y + circle.size > canvas.height) {
                circle.y = canvas.height
            }

            if (circle.y - circle.size < 0) {
                circle.y = circle.size
            }

            requestAnimationFrame(update1)
        }

        update1()


        
    }

    ctx.canvas.onmousemove = findObjCoords

    socket.on('begin', function() {
        //Parsing the value of the room.
        var urlParams = new URLSearchParams(window.location.search);

        if(urlParams.has('room')) {
            room = urlParams.get('room');
            // Possibility of removing given new configuration.
            // Is the user entering an admin or a player.
            if(urlParams.has('admin')) {
                admin = true;
                socket.emit('join_admin', room);
                document.getElementById('cursor').style.display = 'none';
                var start_button = document.createElement('div');
                start_button.style.backgroundColor = 'red';
                start_button.innerHTML = 'START';
                start_button.onclick = function() {
                    console.log("START");
                    socket.emit('start', room);
                }
                document.getElementsByClassName('wrapper')[0].insertBefore(start_button, game);
                game.style.top = 30;
            }
            else {            
                socket.emit('join_room', room);
            }
        }
        // Tutorial page.
        if(urlParams.has('playground')) {
            document.getElementById('info').style.opacity = '0';

            function windowSizeChanged() {
                var width = document.getElementById('game').offsetWidth;
                var height = document.getElementById('game').offsetHeight;
                scaleFactor = Math.min(window.innerWidth / width, window.innerHeight / height);
                document.getElementById('game').style.transform = 'scale(' + scaleFactor + ')';
              }
              
              window.onresize = windowSizeChanged;
              windowSizeChanged();
        }
    });

    socket.on('location', function(socketId, x, y, rot) {
        // Identify the player based on the id that is placed on the socket.
        var player = document.getElementById(socketId);
        x *= game.offsetWidth;
        y *= game.offsetHeight;
        // Initization of the player.
        if(player === null) {
            player = document.createElement('div');
            player.classList.add('player');
            player.id = socketId;
            game.insertBefore(player, document.getElementById('cursor'));
        }
        player.style.left = game.offsetLeft + x - player.offsetWidth * 0.5;
        player.style.top = game.offsetTop + y - player.offsetHeight * 0.5;
        player.style.transform = 'rotate(' + rot + 'deg)';
    });

    socket.on('disconnected', function(socketId) {
        game.removeChild(document.getElementById(socketId));
    });
    // Change the background depending on the score of the players.
    socket.on('score', function(score) {
        score = Math.min(1, score);
        var blue = 255 * (1 - score);
        var green = 191 * (1 - 0.7 * score);// * (1 - score);
        var red = 255 * score;
        game.style.backgroundColor = 'rgb(' + red + ',' + green + ',' + blue + ')';
    });
    // Initial style opacity.
    socket.on('start', function() {
        console.log('start');
        document.getElementById('info').style.opacity = '0';
    });
    // Process when the game ends.
    socket.on('end', function(score, finish) {
        document.getElementById('info').style.opacity = 1;
        // Setup the current score.
        if(score > hiscore) hiscore = score;
        document.getElementById('previous_score').innerHTML = '' + Math.round(score);
        document.getElementById('high_score').innerHTML = '' + Math.round(hiscore);
        // Setup of the end of the game.

        // Setup to change the time to "X".
        if(finish) {
            document.getElementById('time').innerHTML = 'X';
        }
        else {
            var seconds = 10;
            document.getElementById('time').innerHTML = seconds;
            if(startTimer !== undefined) clearInterval(startTimer);
            startTimer = setInterval(function() {
                seconds--;
                if(seconds < 0) {
                    clearInterval(startTimer);
                    startTimer = undefined;
                }
                else document.getElementById('time').innerHTML = seconds;
            }, 1000);
        }
    });
    // Movement of the cursor definition.
    game.onmousemove = function(evt) {
        if(!admin) {
            //var x = evt.pageX - game.offsetLeft;
            //var y = evt.pageY - game.offsetTop;
            var x = (evt.pageX - game.offsetLeft) / scaleFactor;
            var y = (evt.pageY - game.offsetTop) / scaleFactor;

            if(x > 0 && y > 0 && x < game.offsetWidth && y < game.offsetHeight && (x !== prevX || y !== prevY)) {
                var rot = Math.atan2(y - prevY, x - prevX) * 180.0 / Math.PI;
                var dist = Math.sqrt(Math.pow(y - prevY, 2) + Math.pow(x - prevX, 2));
                prevX = x;
                prevY = y;
                while(rotation - rot > 180) {
                    rotation -= 360;
                }
                while(rot - rotation > 180) {
                    rotation += 360;
                }
                var smooth = Math.min(1, dist/50);
                rotation = smooth * rot + (1 - smooth) * rotation;
                socket.emit('location', room, x / (game.offsetWidth), y / (game.offsetHeight), rotation);
                var cursor = document.getElementById('cursor');
                cursor.style.left = x - 16;
                cursor.style.top = y - 16;
                cursor.style.transform = 'rotate(' + rotation +'deg)';
            }
        }
    }
}
