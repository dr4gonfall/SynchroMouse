
// ====================SYNCHROMOUSE CODE BEFORE=============================================

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


// ======================== COMMENTS AND METHODS FROM CURRENT SCRIPT.JS VERSION


// function initializeGame() {
    
// }

// function calculateDistVelocityAngle(player, agent) {
//     let distance
//     let angle
//     let velocity

//     distance = Math.sqrt(((player.position.x - agent.position.x) ** 2) + ((player.position.y - agent.position.y) ** 2))
//     angle = Math.atan2(player.position.y - agent.position.y, player.position.x - agent.position.x)
//     velocity =  Math.min(distance, agent.maxVelocity )

//     return {distance, angle, velocity}
// }

// function calculateNoise(meanParamComp, stdDevParamComp, meanParamCompRad, stdDevParamCompRad, meanParamPred, stdDevParamPred) {
//     let noiseFactorCompetenceVelocity = getNormallyDistributedRandomNumber(meanParamComp,stdDevParamComp)
//     let noiseFactorCompetenceAngle = getNormallyDistributedRandomNumber(meanParamCompRad, stdDevParamCompRad)
//     let noiseFactorPredictability = getNormallyDistributedRandomNumber(meanParamPred,stdDevParamPred)

//     return { noiseFactorCompetenceVelocity, noiseFactorCompetenceAngle, noiseFactorPredictability}
// }

// function calculateDistVelocityAngleWithNoise(player, agent, withNoise) {
//     let distance
//     let angle
//     let velocity

//     distance = Math.sqrt(((player.position.x - agent.position.x) ** 2) + ((player.position.y - agent.position.y) ** 2))
//     angle = Math.atan2(player.position.y - agent.position.y, player.position.x - agent.position.x)
//     velocity =  Math.min(distance, agent.maxVelocity )

//     if (withNoise) {
//         // angle -= Math.PI/4
//         // angle = Math.atan2(player.position.y - 0, player.position.x - 0) + Math.PI/4
//         // console.log(angle)
//         // velocity -=5

//     }
   
//     return {distance, angle, velocity}
// }

// function toggleScreen(id, toggle) {
//     let element = document.getElementById(id)
//     let display = (toggle) ? 'block': 'none'
//     element.style.display = display
// }

// function startMenu() {
//     toggleScreen('start-screen', false)
//     toggleScreen('mode-screen', true)

//     // demoGame()
// }

// function startDemo() {
//     toggleScreen('mode-screen', false)
//     toggleScreen('demo', true)

//     socket.on('begin', function() {
//         urlParams = new URLSearchParams(window.location.search);
        


//         if(urlParams.has('room')) {
//             room = urlParams.get('room');
//             // Possibility of removing given new configuration.
//             // Is the user entering an admin or a player.
//              socket.emit('join_room', room)

//         }
//         // Tutorial page.
//         if(urlParams.has('playground')) {
//             // document.getElementById('info').style.opacity = '0';

//             // function windowSizeChanged() {
//             //     var width = document.getElementById('game').offsetWidth;
//             //     var height = document.getElementById('game').offsetHeight;
//             //     scaleFactor = Math.min(window.innerWidth / width, window.innerHeight / height);
//             //     document.getElementById('game').style.transform = 'scale(' + scaleFactor + ')';
//             //   }
              
//             //   window.onresize = windowSizeChanged;
//             //   windowSizeChanged();
//         }
//     })

// }

// function goBackMenu() {

//     toggleScreen('mode-screen', true)
//     toggleScreen('demo', false)
// }

// let playerPosCompX
// let playerPosCompY

// let competenceInterval = setInterval(() => {
//     distance = Math.sqrt(((player.position.x - agent.position.x) ** 2) + ((player.position.y - agent.position.y) ** 2))
//     competencyAmount = getNormallyDistributedRandomNumber(distance,stddevCompetence)
//     competenceValueList.push(competencyAmount)
//     if (competencyAmount !== 0) {
//         idealAngle = Math.atan2(player.position.y - agent.position.y, player.position.x - agent.position.x)
//         agent.angle = idealAngle
//         competenceVelocity =  Math.min(competencyAmount, agent.maxVelocity )
//         agent.velocity = competenceVelocity
//     }

//     // agent.velocity = competencyAmount
// }, 1000)

// competenceInterval

// LOGIC FOR PARAMETERS OF COMPETENCE AND PREDICTABILITY
    // if (!perfect) {
    //     meanCompetence = 0.0
    //     meanPredictability = 0.0
    //     if (comp && pred) {
    //         stddevCompetence = 100.0
    //         stddevPredRad = Math.PI/4
    //     } else if (comp && !pred) {
    //         stddevCompetence = 100.0
    //         stddevPredRad = Math.PI
    //     } else if (!comp && pred) {
    //         stddevCompetence = 300.0
    //         stddevPredRad = Math.PI/4
    //     } else if (!comp && !pred) {
    //         stddevCompetence = 300.0
    //         stddevPredRad = Math.PI
    //     }
    // }

    // let competenceParameter = 700
    // let predictabilityParameter = 700
    // setInterval(() => {
    //     setInterval(() => {
    //         agentDemo.angle = idealAngle + Math.PI/4
    //         agentDemo.velocity = idealVelocity
    //     }, competenceParameter); 
    // }, 1000);


     // setInterval(() => {
    //     testLogic = true
    //     // agentDemo.velocity = total / agentPositions['velocity'].length;
    //     // agentDemo.angle = average(agentPositions['angle'])* Math.random()
    //     // console.log(`The ideal angle is: ${idealAngle}`)
        
    //     // console.log(agentPositions['velocity'])
    //     // console.log(average(agentPositions['velocity']))
    //     // agentDemo.velocity = idealVelocity
    //     // agentDemo.velocity = average(agentPositions['velocity']) * Math.random()
    //     // agentDemo.velocity = getNormallyDistributedRandomNumber(idealVelocity, 5)
    // }, competenceParameter);

    // setInterval(() => {
    //     // agentDemo.angle = getNormallyDistributedRandomNumber(idealAngle, Math.PI/2)
    //     // agentDemo.angle = idealAngle
    //     // console.log(`The difference between the angles is: ${idealAngle-getNormallyDistributedRandomNumber(idealAngle, Math.PI/2)}`)
    // }, predictabilityParameter);


// ANOTHER INTERVAL ALGORITHM === VERSION 4 NOT WORKING

    // let counterPlayerBefore
    // setInterval(() => {
    //     counterPlayerBefore = playerPositions["X"].length-1
    //     console.log("The length of: " + playerPositions["X"].length)
    //     inter= 0
    //     if (competenceActive) {
    //         competenceActive = false
    //     } else {
    //         competenceActive = true
    //         stddevCompetence = 300
    //     let playerPosCompX2 = getNormallyDistributedRandomNumber(player.position.x, stddevCompetence)

    //     let playerPosCompY2 = getNormallyDistributedRandomNumber(player.position.y, stddevCompetence)


    //     let supposedAngle
    //     // let agentPosCompX2 = getNormallyDistributedRandomNumber(agent.position.x,stddevCompetence)
    //     // let agentPosCompY2 = getNormallyDistributedRandomNumber(agent.position.y, stddevCompetence)
    //     distanceComp = Math.sqrt(((playerPosCompX2 - agent.position.x) ** 2) + ((playerPosCompY2 - agent.position.y) ** 2))
    //     competenceVelocity =  Math.min(distanceComp, agent.maxVelocity )
    //     idealAngle = Math.atan2(playerPosCompY2 - agent.position.y, playerPosCompX2 - agent.position.x)
    //     let i = 1000/(33.34/2)
    //     let currentPositionX= agent.position.x
    //     let currentPositionY = agent.position.y
    //     let currentVelocity = competenceVelocity
    //     let currentAngle = idealAngle
    //     let counter2 = 0
        
    //     while (i > 0) {
    //         agentPositionsCompetence["X"].push(currentPositionX +(currentVelocity *Math.cos(currentAngle)))
    //         agentPositionsCompetence["Y"].push(currentPositionY +(currentVelocity *Math.sin(currentAngle)))

    //         currentPositionX = currentPositionX +(currentVelocity *Math.cos(currentAngle))
    //         currentPositionY = currentPositionY +(currentVelocity *Math.sin(currentAngle))

    //         i --
    //         counter2 ++
    //     }
    //     }
    // }, 1000);

    // INTERVAL DEFINED FOR THE ALGORITHM COMPETENCE ====== WORKING
    // randomNumberInterval = Math.random()* 1000
    // setInterval(() => {
        
    //     if (competenceActive) {
    //         competenceActive = false
    //     } else if (!competenceActive) {
    //         competenceActive = true

    //         noiseXCompetence= getNormallyDistributedRandomNumber(meanCompetence,stddevCompetence)
    //         noiseYCompetence = getNormallyDistributedRandomNumber(meanCompetence,stddevCompetence)
    //         // console.log("The noise in x is: "+  noiseXCompetence + " The noise in y is: " + noiseYCompetence)

    //         // playerPosCompX = getNormallyDistributedRandomNumber(player.position.x,stddevCompetence)

    //         // playerPosCompY = getNormallyDistributedRandomNumber(player.position.y,stddevCompetence)

    //         distanceComp = Math.sqrt((((player.position.x + noiseXCompetence) - agent.position.x) ** 2) + (((player.position.y + noiseYCompetence) - agent.position.y) ** 2))
    //         idealAngle = Math.atan2(player.position.y - agent.position.y, player.position.x - agent.position.x)
    //         competenceVelocity =  Math.min(distanceComp, agent.maxVelocity )
    //     }
    //     // console.log("CompetenceActive is: " + competenceActive)
    //     randomNumberInterval = Math.random()* 1000
    //     // console.log("The next interval will be: " + randomNumberInterval)
    // },randomNumberInterval)


    // INTERVAL DEFINED FOR THE PREDICTABILITY ALGORITHM ====== WORKS
    // randomNumberIntervalPredic = Math.random()* 1000
    // setInterval(() => {
        
    //     if (predictabilityActive) {
    //         predictabilityActive = false
    //     } else if (!predictabilityActive) {
    //         predictabilityActive = true
    //         // console.log("Entered to Interval: " + getNormallyDistributedRandomNumber(0, stddevPredRad))
    //         noiseXPredictability= getNormallyDistributedRandomNumber(0,stddevPredRad)
    //         noiseYPredictability = getNormallyDistributedRandomNumber(0,stddevPredRad)
    //         //  console.log("The noise in x is: "+  noiseXPredictability + " The noise in y is: " + noiseYPredictability)

    //         // playerPosCompX = getNormallyDistributedRandomNumber(player.position.x,stddevCompetence)

    //         // playerPosCompY = getNormallyDistributedRandomNumber(player.position.y,stddevCompetence)

    //         // distancePred = Math.sqrt(((player.position.x - agent.position.x) ** 2) + ((player.position.y - agent.position.y) ** 2))
    //         // idealAngle = noiseXPredictability
    //         // idealAngle = Math.atan2((player.position.y + noiseYPredictability) - agent.position.y, (player.position.x + noiseXPredictability) - agent.position.x)
    //         // competenceVelocity =  Math.min(distancePred, agent.maxVelocity )
    //     }
    //     // console.log("CompetenceActive is: " + competenceActive)
    //     randomNumberIntervalPredic = Math.random()* 1000
    //     // console.log("The next interval will be: " + randomNumberInterval)
    // },randomNumberIntervalPredic)

    // TEST THE STOPPING FOR THE HUMAN
    // let NotYet = false
    // setInterval(() => {
    //     NotYet=true
    // }, 10);
    

    // const player = new Player({
    //     position: {
    //       x: 200,
    //       y: 200,
    //     },
    //     maxVelocity: 10,
    //     // minVelocity: 5,
    //     // maxVelocity:15,
    //      velocity: {
    //        x: 0,
    //        y: 0,
    //      },
    //      color: "red",
    //      xpos: xpos,
    //      ypos: ypos,
    //      canvas: canvas,
    //      ctx: ctx
    //   });
    //   const agent = new Agent({
    //   position: {
    //       x: 500,
    //       y: 200,
    //     },
    //     maxVelocity: 10,
    //     acceleration: 0.1,
    //     rotationVel: 0.1,
    //     angle: 0,
    //     // minVelocity: 5,
    //     // maxVelocity:15,
    //      velocity: 0,
    //      angleWave: 0,
    //      color: "blue",
    //      canvas: canvas,
    //      ctx: ctx,
    //      distanceBetween: 1
    //   });

    //   const agentDemo = new Agent({
    //     position: {
    //         x: 500,
    //         y: 200,
    //       },
    //       maxVelocity: 100,
    //       acceleration: 0.1,
    //       rotationVel: 0.1,
    //       angle: 0,
    //       angleWave: 0,
    //        velocity: 0,
    //        color: "purple",
    //        canvas: canvas,
    //        ctx: ctx,
    //        distanceBetween: 1
    //     });
    
    

    

    // function animate() {
        
    //     // Initialization
    //     window.requestAnimationFrame(animate);
    //     ctx.fillStyle = "white";
    //     ctx.fillRect(0, 0, canvas.width, canvas.height);
    //     // player.position.x = xpos + player.minVelocity
    //     // player.position.y = ypos + player.minVelocity
    //     //console.log(agent)
    //     player.update();
    //     if (!isNaN(xpos) ) {
    //         player.position.x = xpos    
    //     }

    //     if (!isNaN(ypos)) {
    //         player.position.y = ypos
    //     }

        

    //     // agentPrevX = agent.position.x
    //     // agentPrevY = agent.position.y

        
        
    //     if (activateWaves) {
    //         agent.updateWaves()
    //     }
    //     else {
    //         agent.update()
    //     }


    //     // if (activateWaves) {
    //     //     agentDemo.updateWaves()
    //     // }
    //     // else {
    //     //     agentDemo.update()
    //     // }
        
    //     agentDemo.update()
        
    //     // console.log("Player: " + player + " Agent: " + agent)
    //     // enemy.update();
    //     // console.log(playerPositions)
    //     // player.velocity = 0
    //      // player.velocity.x = 0;
    //      // player.velocity.y = 0;
    //      agentPositions["angle"].push(agent.angle)
    //      agentPositions["velocity"].push(agent.velocity)
    //       agent.velocity = 0
    //     //   agentDemo.velocity = 0
    //      // console.log(agent.velocity)
    //       agent.angle = 0
          
        

    //     // TRUST PROGRAMMING===============================================================================

    //     // Definitions
    //     anglePlayerSource = Math.atan2(player.position.y - 0, player.position.x - 0)
    //     // anglePlayerSource = Math.atan2(player.position.y - 0, player.position.x - 0)
    //     angleAgentSource = Math.atan2(agent.position.y - 0, agent.position.x - 0)

    //     // Add the values of the actual player positions in x and y coordinates.
    //     playerPositions["X"].push(player.position.x)
    //     playerPositions["Y"].push(player.position.y)
    //     playerPositions["angle"].push(anglePlayerSource)

    //     agentPositions["X"].push(agent.position.x)
    //     agentPositions["Y"].push(agent.position.y)
        
        

    //     // console.log(agentPositions["velocity"][10])
    //     // console.log("The position before was: " + playerPositions["X"][playerPositions["X"].length-2] + " the current position is: " + player.position.x)
    //     if (playerPositions["X"][playerPositions["X"].length-2] !== player.position.x) {
            
    //         counterTest = 0
    //         // console.log("Counter is back to: " + counterTest)
    //     } else {
    //         counterTest ++
    //         // console.log("The positions are the same")
    //         // console.log("The counter is: " +counterTest)
    //     }

    //     if (counterTest >= 10) {
    //         // console.log("STOP!!!!!!!!!!!!!!!")
    //     } else {
    //         // console.log("Currently moving")
    //     }
    //     rotationDifference = ((Math.atan2(player.position.y - prevY, player.position.x - prevX))* 180.0 / Math.PI)
    //     console.log("The angle is: " + ((Math.atan2(player.position.y - prevY, player.position.x - prevX))* 180.0 / Math.PI))
    //     // if (NotYet && !isNaN(playerPositions["X"].length -1)) {
    //     //     if (player.position.x === playerPositions["X"].length - 1) {
    //     //         timer ++
    //     //         console.log("Entered to this if")
    //     //     }
    //     //     console.log("The difference in movement for player is: " + player.position.x - playerPositions["X"].length-2)
    //     //     console.log("The timer is: " + timer)    
    //     // }
        
        
    //     // if (timer >= 1) {
    //     //     console.log("The player has stopped")
    //     //     timer =0
    //     // }

    //     // versionCompetence = 0

    //     // ADD THE VECTORS PLUS THE NOISE
    //     // versionCompetence === 1
    //     // if (perfect) {
    //     //     noiseXCompetence = 0
    //     //     noiseYCompetence = 0
    //     //     noiseXPredictability = 0
    //     //     noiseYPredictability = 0
    //     // } else if (qualityCompetence && versionCompetence === 1) {
    //     //     noiseXCompetence = 0
    //     //     noiseYCompetence = 0
    //     //     if (playerPositions["X"].length >= 30) {
    //     //         // console.log("Player Position: " + playerPositions["X"][playerPositions["X"].length-29])
    //     //         competenceDistance = Math.sqrt(((playerPositions["X"][playerPositions["X"].length-29] - agent.position.x) ** 2) + ((playerPositions["Y"][playerPositions["Y"].length-29] - agent.position.y) ** 2))

    //     //         if (distance !== 0) {
    //     //             competenceAngle = Math.atan2(playerPositions["Y"][playerPositions["Y"].length-29] - agent.position.y, playerPositions["X"][playerPositions["X"].length-29] - agent.position.x)
    //     //             agent.angle = competenceAngle
    //     //             competenceVelocity =  Math.min(competenceDistance, agent.maxVelocity )
    //     //             agent.velocity = competenceVelocity
    //     //         }    
    //     //     } else {
    //     //         distance = Math.sqrt(((player.position.x - agent.position.x) ** 2) + ((player.position.y - agent.position.y) ** 2))

    //     //     if (distance !== 0) {
    //     //         idealAngle = Math.atan2(player.position.y - agent.position.y, player.position.x - agent.position.x)
    //     //         agent.angle = idealAngle
    //     //         idealVelocity =  Math.min(distance, agent.maxVelocity )
    //     //         agent.velocity = idealVelocity
    //     //     }
    //     //     }
    //     // } else if (!qualityCompetence && versionCompetence === 1) {
    //     //     // console.log("Entered no quality version 1")
    //     //     noiseXCompetence = 0
    //     //     noiseYCompetence = 0
    //     //     if (playerPositions["X"].length >= 100) {
    //     //         // console.log("Player Position: " + playerPositions["X"][playerPositions["X"].length-99])
    //     //         competenceDistance = Math.sqrt(((playerPositions["X"][playerPositions["X"].length-99] - agent.position.x) ** 2) + ((playerPositions["Y"][playerPositions["Y"].length-99] - agent.position.y) ** 2))

    //     //         if (distance !== 0) {
    //     //             competenceAngle = Math.atan2(playerPositions["Y"][playerPositions["Y"].length-99] - agent.position.y, playerPositions["X"][playerPositions["X"].length-99] - agent.position.x)
    //     //             agent.angle = competenceAngle
    //     //             competenceVelocity =  Math.min(competenceDistance, agent.maxVelocity )
    //     //             agent.velocity = competenceVelocity
    //     //         }    
    //     //     } else {
    //     //         distance = Math.sqrt(((player.position.x - agent.position.x) ** 2) + ((player.position.y - agent.position.y) ** 2))

    //     //     if (distance !== 0) {
    //     //         idealAngle = Math.atan2(player.position.y - agent.position.y, player.position.x - agent.position.x)
    //     //         agent.angle = idealAngle
    //     //         idealVelocity =  Math.min(distance, agent.maxVelocity )
    //     //         agent.velocity = idealVelocity
    //     //     }
    //     //     }
    //     // }

    //     // BASE VECTOR DEFINITION
        
    //     // VERSION 1: Define the distance and use it to have an angle and velocity associated related to the position of the player.
    //     let distance2
    //     // if (versionCompetence === 1) {
    //     distance = calculateDistVelocityAngleWithNoise(player, agent, true).distance
    //     distance2 = calculateDistVelocityAngleWithNoise(player, agentDemo, true).distance
    //     // distance = Math.sqrt(((player.position.x - agent.position.x) ** 2) + ((player.position.y - agent.position.y) ** 2))
    //     agent.distanceBetween = distance
    //     agentDemo.distanceBetween = distance2
    //     // console.log(`The distance between the agent: ${agent.distanceBetween} and the other: ${agentDemo.distanceBetween}`)
    //     if (distance2 !== 0) {
    //         idealAngle = calculateDistVelocityAngleWithNoise(player, agentDemo,true).angle
    //         agentDemo.angle = idealAngle
    //         // console.log(`The angle in radians is: ${idealAngle}. The angle in degrees is: ${idealAngle* (180 / Math.PI)}`)
    //         idealVelocity =  calculateDistVelocityAngleWithNoise(player, agentDemo, true).velocity
    //         agentDemo.velocity = idealVelocity
    //     }

    //     if (distance === 0) {
    //         agent.velocity= 0
    //     }

    //     if (distance2 === 0) {
    //         agentDemo.velocity = 0
    //     }


    //      if (distance !== 0 && !competenceActive && !perlinNoise && !predictabilityActive) {
    //         // console.log("Entered normal vector")
    //         idealAngle = calculateDistVelocityAngleWithNoise(player, agent,true).angle
    //         agent.angle = idealAngle
    //         // console.log(`The angle in radians is: ${idealAngle}. The angle in degrees is: ${idealAngle* (180 / Math.PI)}`)
    //         idealVelocity =  calculateDistVelocityAngleWithNoise(player, agent, true).velocity
    //         agent.velocity = idealVelocity
    //     }
    //     // }

    //     rotationDifferenceAWaves = Math.atan2(agent.position.y - agentWavesPrevY, agent.position.x - agentWavesPrevX) * 180.0 / Math.PI;
    //     rotationDifferenceAIdeal = Math.atan2(agentDemo.position.y - agentIdealPrevY, agent.position.x - agentIdealPrevX) * 180.0 / Math.PI;

    //     let dist = Math.sqrt(Math.pow(agent.position.y - agentIdealPrevY, 2) + Math.pow(agent.position.x - agentIdealPrevX, 2));
    //     agentWavesPrevX = agent.position.x;
    //     agentWavesPrevY = agent.position.y;

    //     agentIdealPrevX = agentDemo.position.X
    //     agentIdealPrevY = agentDemo.position.y

    //     if (!isNaN(prevY) && !isNaN(prevX)) {
    //         velocityPlayer = (player.position.y - prevY) / (player.position.x - prevX)
    //     }


    //     prevX = player.position.x
    //     prevY = player.position.y
    //     // while(rotation - rot > 180) {
    //     //     rotation -= 360;
    //     // }
    //     // while(rot - rotation > 180) {
    //     //     rotation += 360;
    //     // }
    //     var smooth = Math.min(1, dist/50);
    //     // rotationAgent = smooth * rot + (1 - smooth) * rotationAgent;
    //     socket.emit('locationAgent', room, agent.position.x, agent.position.y, rotationAgent, agentDemo.position.x, agentDemo.position.y, rotationDifferenceAWaves, rotationDifferenceAIdeal, agent.velocity, agentDemo.velocity);
    //     socket.emit('location', room, player.position.x, player.position.y, rotation, rotationDifference, velocityPlayer);
    //     //  console.log(`Position in X: ${agent.position.x} and Position in Y: ${agent.position.y}`)



    //     // COMPETENCE VECTOR DEFINITION

    //     // VERSION 1: CREATE A VARIATION OF THE SPEED AND ANGLE REQUIRED USING A NORMALLY DISTRIBUTED FUNCTION WHICH HAPPENS WITH A RANDOM NUMBER INTERVAL (GAUSSIAN NOISE)
    //     // DO NOT FORGET TURN SETINTERVAL ON

    //     // console.log(playerPositions["X"].length)
    //     // let competenceInterval = setInterval(() => {
    //     //     competencyAmount = getNormallyDistributedRandomNumber(distance,stddevCompetence)
    //     //     competenceValueList.push(competencyAmount)
    //     //     if (competencyAmount !== 0) {
    //     //         idealAngle = Math.atan2(player.position.y - agent.position.y, player.position.x - agent.position.x)
    //     //         agent.angle = idealAngle
    //     //         competenceVelocity =  Math.min(competencyAmount, agent.maxVelocity )
    //     //         agent.velocity = competenceVelocity
    //     //     }

    //     //     // agent.velocity = competencyAmount
    //     // }, 1000)
    //     // console.log("The competency amount is:" + competencyAmount)
    //     // agent.velocity += competencyAmount

        

    //     // playerPosCompX = getNormallyDistributedRandomNumber(player.position.x,stddevCompetence)
    //     // // noiseX = getNormallyDistributedRandomNumber(0, stddevCompetence)
    //     // // noiseY = getNormallyDistributedRandomNumber(0,stddevCompetence)
    //     // // console.log("The noise in x is: " + noiseX + " and the noise in Y is: " + noiseY)
    //     // playerPosCompY = getNormallyDistributedRandomNumber(player.position.y,stddevCompetence)
    //     // // let agentPosCompX = getNormallyDistributedRandomNumber(agent.position.x,stddevCompetence)
    //     // // let agentPosCompY = getNormallyDistributedRandomNumber(agent.position.y, stddevCompetence)

    //     // playerPositionsCompetence["X"].push(playerPosCompX)
    //     // playerPositionsCompetence["Y"].push(playerPosCompY)

    //     // // agentPositionsCompetence["X"].push(agentPosCompX)
    //     // // agentPositionsCompetence["Y"].push(agentPosCompY)

    //     // let randomNumComp
    //     // randomNumComp = Math.random()
    //     // counter = 0
    //     // if (randomNumComp <= 1 && competenceActive) {
    //     //     // console.log("Entered to random competence function with random number: " + randomNumComp)
    //     //     competenceActive = true
    //     //     // distanceComp = Math.sqrt(((playerPosCompX - agent.position.x) ** 2) + ((playerPosCompY - agent.position.y) ** 2))
    //     //     if (distance !== 0) {
    //     //         // idealAngle = Math.atan2(playerPosCompY - agent.position.y, playerPosCompX - agent.position.x)
    //     //         agent.angle = idealAngle
    //     //         // competenceVelocity =  Math.min(distanceComp, agent.maxVelocity )
    //     //         agent.velocity = competenceVelocity
    //     //     }

    //     // } else {
    //     //     distance = Math.sqrt(((player.position.x - agent.position.x) ** 2) + ((player.position.y - agent.position.y) ** 2))

    //     //  if (distance !== 0) {
    //     //     // console.log("Entered normal vector")
    //     //     idealAngle = Math.atan2(player.position.y - agent.position.y, player.position.x - agent.position.x)
    //     //     agent.angle = idealAngle
    //     //     idealVelocity =  Math.min(distance, agent.maxVelocity )
    //     //     agent.velocity = idealVelocity
    //     // }

    //     // }

    //     // VERSION 2: THE AGENT IS FOLLOWING 30 POSITIONS BEFORE THE ACTUAL POSITION OF THE PLAYER
    //     // console.log(!isNaN(playerPositions))
    //     // if (playerPositions["X"].length >= 30) {
    //     //     console.log("Player Position: " + playerPositions["X"][playerPositions["X"].length-29])
    //     //     competenceDistance = Math.sqrt(((playerPositions["X"][playerPositions["X"].length-29] - agent.position.x) ** 2) + ((playerPositions["Y"][playerPositions["Y"].length-29] - agent.position.y) ** 2))

    //     //     if (distance !== 0) {
    //     //         competenceAngle = Math.atan2(playerPositions["Y"][playerPositions["Y"].length-29] - agent.position.y, playerPositions["X"][playerPositions["X"].length-29] - agent.position.x)
    //     //         agent.angle = competenceAngle
    //     //         competenceVelocity =  Math.min(competenceDistance, agent.maxVelocity )
    //     //         agent.velocity = competenceVelocity
    //     //     }    
    //     // } else {
    //     //     distance = Math.sqrt(((player.position.x - agent.position.x) ** 2) + ((player.position.y - agent.position.y) ** 2))

    //     //   if (distance !== 0) {
    //     //      idealAngle = Math.atan2(player.position.y - agent.position.y, player.position.x - agent.position.x)
    //     //      agent.angle = idealAngle
    //     //      idealVelocity =  Math.min(distance, agent.maxVelocity )
    //     //      agent.velocity = idealVelocity
    //     //  }
    //     // }
    //     // // MEASUREMENT OF COMPETENCE: AVERAGE OF DISTANCE OVER TIME
    //     // compMeasurementCounter ++
    //     // compMeasurement += distance / compMeasurementCounter
    //     // console.log(compMeasurement)

    //     // VERSION 3: PERLIN NOISE TEST  ====== NOT WORKING
        
    //     // let noise 
    //     // // let randPerlX
    //     // // let randPerlY
    //     // // randPerlX = Math.random() 
    //     // noise = perlin.get(Math.random(), Math.random())
    //     // console.log("The noise is: " + noise)
    //     // console.log("The position of the player with noise is:"+(player.position.x * noise) +" , "+(player.position.y * noise))
        
    //     // distance = Math.sqrt(((player.position.x * noise - agent.position.x) ** 2) + ((player.position.y * noise - agent.position.y) ** 2))

    //     //  if (distance !== 0 && !competenceActive) {
    //     //     // console.log("Entered normal vector")
    //     //     idealAngle = Math.atan2(player.position.y * noise - agent.position.y, player.position.x * noise - agent.position.x)
    //     //     agent.angle = idealAngle
    //     //     idealVelocity =  Math.min(distance, agent.maxVelocity )
    //     //     agent.velocity = idealVelocity
    //     // }
        

    //     // VERSION 4: LET AGENT DEAL WITH THE VALUES ======== NOT WORKING
    //     // let counterPlayerNow = playerPositions["X"].length-1
    //     // console.log(counterPlayerNow)
    //     // // console.log(counterPlayerBefore)
    //     // if (competenceActive && (counterPlayerNow- counterPlayerBefore)> 0) {
    //     //     agent.position.x = agentPositionsCompetence["X"][inter +(counterPlayerNow- counterPlayerBefore)]
    //     //     agent.position.y = agentPositionsCompetence["Y"][inter +(counterPlayerNow- counterPlayerBefore)]
    //     //     inter ++
    //     // }


    //     // PREDICTABILITY VECTOR

    //     // VERSION 1: USE THE MANIPULATIONS ONLY FOR THE ANGLE AND NOT THE DISTANCE

    //     // playerPosPredX = getNormallyDistributedRandomNumber(player.position.x,stddevCompetence)
    //     // // noiseX = getNormallyDistributedRandomNumber(0, stddevCompetence)
    //     // // noiseY = getNormallyDistributedRandomNumber(0,stddevCompetence)
    //     // // console.log("The noise in x is: " + noiseX + " and the noise in Y is: " + noiseY)
    //     // playerPosPredY = getNormallyDistributedRandomNumber(player.position.y,stddevCompetence)
    //     // // let agentPosCompX = getNormallyDistributedRandomNumber(agent.position.x,stddevCompetence)
    //     // // let agentPosCompY = getNormallyDistributedRandomNumber(agent.position.y, stddevCompetence)

    //     // playerPositionsPredictability["X"].push(playerPosPredX)
    //     // playerPositionsPredictability["Y"].push(playerPosPredY)

    //     // // agentPositionsCompetence["X"].push(agentPosCompX)
    //     // // agentPositionsCompetence["Y"].push(agentPosCompY)


    //     // randomNumPred = Math.random()
    //     // counter = 0
    //     // if (randomNumPred <= 0.8 && predictabilityActive) {
    //     //     // console.log("Entered to random competence function with random number: " + randomNumComp)
    //     //     predictabilityActive = true
    //     //     distancePred = Math.sqrt(((player.position.x - agent.position.x) ** 2) + ((player.position.y - agent.position.y) ** 2))
    //     //     if (distance !== 0) {
    //     //         // idealAngle = Math.atan2(playerPosCompY - agent.position.y, playerPosCompX - agent.position.x)
    //     //         agent.angle = idealAngle
    //     //         competenceVelocity =  Math.min(distancePred, agent.maxVelocity )
    //     //         agent.velocity = competenceVelocity
    //     //     }

    //     // } else {
    //     //     distance = Math.sqrt(((player.position.x - agent.position.x) ** 2) + ((player.position.y - agent.position.y) ** 2))

    //     //  if (distance !== 0) {
    //     //     // console.log("Entered normal vector")
    //     //     idealAngle = Math.atan2(player.position.y - agent.position.y, player.position.x - agent.position.x)
    //     //     agent.angle = idealAngle
    //     //     idealVelocity =  Math.min(distance, agent.maxVelocity )
    //     //     agent.velocity = idealVelocity
    //     // }

    //     // }

    //     // VERSION 2:

    //     // playerPosPredX = getNormallyDistributedRandomNumber(player.position.x,stddevCompetence)
    //     // // noiseX = getNormallyDistributedRandomNumber(0, stddevCompetence)
    //     // // noiseY = getNormallyDistributedRandomNumber(0,stddevCompetence)
    //     // // console.log("The noise in x is: " + noiseX + " and the noise in Y is: " + noiseY)
    //     // playerPosPredY = getNormallyDistributedRandomNumber(player.position.y,stddevCompetence)
    //     // // let agentPosCompX = getNormallyDistributedRandomNumber(agent.position.x,stddevCompetence)
    //     // // let agentPosCompY = getNormallyDistributedRandomNumber(agent.position.y, stddevCompetence)

    //     // playerPositionsPredictability["X"].push(playerPosPredX)
    //     // playerPositionsPredictability["Y"].push(playerPosPredY)

    //     // // agentPositionsCompetence["X"].push(agentPosCompX)
    //     // // agentPositionsCompetence["Y"].push(agentPosCompY)

    //     // randomNumPred = Math.random()
    //     // counter = 0
    //     // if (randomNumPred <= 1 && predictabilityActive) {
    //     //     // console.log("Entered to random competence function with random number: " + randomNumComp)
    //     //     predictabilityActive = true
    //     //     distancePred = Math.sqrt(((player.position.x - agent.position.x) ** 2) + ((player.position.y - agent.position.y) ** 2))
    //     //     if (distance !== 0) {
    //     //         // idealAngle = Math.atan2(playerPosCompY - agent.position.y, playerPosCompX - agent.position.x)
    //     //         agent.angle = idealAngle
    //     //         // competenceVelocity =  Math.min(distancePred, agent.maxVelocity )
    //     //         competenceVelocity = getNormallyDistributedRandomNumber(agent.maxVelocity/2, 5 )
    //     //         agent.velocity = competenceVelocity
    //     //     }

    //     // } else {
    //     //     distance = Math.sqrt(((player.position.x - agent.position.x) ** 2) + ((player.position.y - agent.position.y) ** 2))

    //     //  if (distance !== 0) {
    //     //     // console.log("Entered normal vector")
    //     //     idealAngle = Math.atan2(player.position.y - agent.position.y, player.position.x - agent.position.x)
    //     //     agent.angle = idealAngle
    //     //     idealVelocity =  Math.min(distance, agent.maxVelocity )
    //     //     agent.velocity = idealVelocity
    //     // }

    //     // }

        
    // }

    //  animate() 


// ================================ NO RELATED TO CURRENT VERSION OF THE GAME

















// // ================================PREVIOUS VERSION GAME =============================================

// function HATGame() {
//     const canvas = document.getElementById("canvas-HAT");
//     // console.log(document.getElementById("canvas-HAT"))
//     const ctx = canvas.getContext("2d");

//     canvas.width = 1024;
//     canvas.height = 576;

//     let xpos
//     let ypos

//     class Agent {
//         constructor({ position, velocity, angle, maxVelocity, rotationVel, acceleration, color = "blue" }) {
//             this.position = position;
//             this.velocity = velocity
//             this.angle = angle
//             this.maxVelocity =  maxVelocity
//             this.rotationVel = rotationVel
//             this.acceleration = acceleration
//             this.size = 15;
//             this.color = color;
//         }
          
//         draw() {
//             ctx.fillStyle = this.color;
//             ctx.beginPath()
//             ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2)
//             ctx.fill()
//         }
          
//         update() {
//             this.draw();

//             this.position.x += this.velocity.x * Math.sin(this.angle);
//             this.position.y += this.velocity.x * Math.cos(this.angle)

//             console.log('The position of the agent is: ' + this.position.x + " The velocity of the agent is: " + this.velocity.x)


//             // Detect Side Walls
//             if (this.position.x + this.size > canvas.width) {
//                 this.position.x = canvas.width - this.size
//             }
    
//             if (this.position.x - this.size < 0) {
//                 this.position.x = this.size
//             }

    
//             // Detect top and bottom walls
//             if (this.position.y + this.size > canvas.height) {
//                 this.position.y = canvas.height -this.size
//             }
    
//             if (this.position.y - this.size < 0) {
//                 this.position.y = this.size
//             }
//         }
//       }

//     class Player {
//         constructor({ position, velocity, angle, maxVelocity, rotationVel, acceleration, color = "red" }) {
//           this.position = position;
//           this.velocity = velocity
//           this.angle = angle
//           this.maxVelocity =  maxVelocity
//           this.rotationVel = rotationVel
//           this.acceleration = acceleration
//         //   this.minVelocity = minVelocity;
//         //   this.maxVelocity = maxVelocity;
//         //   this.height = 150;
//         //   this.width = 50;
//           this.size = 15;
//         //   this.attackBox = {
//         //     position: {
//         //       x: this.position.x,
//         //       y: this.position.y,
//         //     },
//         //       offset,
//         //       width: 100,
//         //       height: 50,
//         //     };
//             this.color = color;
//         }
          
//         draw() {
//             ctx.fillStyle = this.color;
//             // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
//             // ctx.translate(this.position.x, this.position.y)
//             ctx.beginPath()
//             ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2)
//             ctx.fill()
//             // ctx.restore()
//         }
          
//         update() {
//             // ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
//             this.draw();
            
//             // this.position.x += this.minVelocity;
//             // this.position.y += this.minVelocity;
            
//             // console.log(this.position.x + ', ' + this.position.y)

//             this.position.x += this.velocity.x * Math.sin(this.angle);
//             this.position.y += this.velocity.x * Math.cos(this.angle)

//             console.log('The position is: ' + this.position.x + " The velocity is: " + this.velocity.x)

//             // ctx.translate(this.position.x, this.position.y)
//             // this.position.y += this.velocity;

//             // Detect Side Walls
//             if (this.position.x + this.size > canvas.width) {
//                 this.position.x = canvas.width - this.size
//             }
    
//             if (this.position.x - this.size < 0) {
//                 this.position.x = this.size
//             }

    
//             // Detect top and bottom walls
//             if (this.position.y + this.size > canvas.height) {
//                 this.position.y = canvas.height -this.size
//             }
    
//             if (this.position.y - this.size < 0) {
//                 this.position.y = this.size
//             }

            
          
//             // this.position.x += this.minVelocity;
//             // this.position.y += this.minVelocity;
          
//             // if (this.position.y + this.height + this.velocity.y >= canvas.height -96) {
//             //  this.velocity.y = 0;
//             //  } else {
//             //  this.velocity.y += gravity;
//             //  }
//         }
//       }

//     const player = new Player({
//         position: {
//           x: 200,
//           y: 200,
//         },
//         maxVelocity: 5,
//         acceleration: 0.1,
//         rotationVel: 0.1,
//         // velocity: 0,
//         angle: 0,
//         // minVelocity: 5,
//         // maxVelocity:15,
//          velocity: {
//            x: 0,
//            y: 0,
//          },
//       });
//       const agent = new Agent({
//         position: {
//           x: 500,
//           y: 200,
//         },
//         maxVelocity: 5,
//         acceleration: 0.1,
//         rotationVel: 0.1,
//         // velocity: 0,
//         angle: 0,
//         // minVelocity: 5,
//         // maxVelocity:15,
//          velocity: {
//            x: 0,
//            y: 0,
//          },
//       });
    
//     console.log(player)
//     // MOUSE MOVEMENTS
//     // canvas.addEventListener('mousemove', function (event) {
//     //     let mouseX = event.pageX - canvas.offsetLeft
//     //     let mouseY = event.pageY - canvas.offsetTop
//     //     document.getElementById("objectCoords-HAT").innerHTML = mouseX  + ", " + mouseY;
//     //     xpos = mouseX
//     //     ypos = mouseY
//     //     return {
//     //         x: mouseX,
//     //         y: mouseY
//     //     }
//     // })
    
// // EVENT LISTENERS FOR KEYS
// window.addEventListener("keydown", (event) => {
//     switch (event.key) {
//         case "d":
//             keys.d.pressed = true;
//             player.lastKey = "d";
//             break;
//         case "a":
//             keys.a.pressed = true;
//             player.lastKey = "a"
//             break;
//         case "s":
//             keys.s.pressed = true;
//             player.lastKey = "s"
//             break;
//         case "w":
//             keys.w.pressed = true;
//             player.lastKey = "w"
//             break;
//     }
// });

// window.addEventListener("keyup", (event) => {
//     // Player Key Press
//     switch (event.key) {
//         case "d":
//             keys.d.pressed = false;
//             break;
//         case "a":
//             keys.a.pressed = false;
//             break;
//         case "s":
//             keys.s.pressed = false;
//             break;
//         case "w":
//             keys.w.pressed = false;
//             break;
//         default:
//             break;
//     }
// })
//     const keys = {
//         d: {
//             pressed: false,
//         },
//         a: {
//             pressed: false,
//         },
//         w: {
//             pressed: false,
//         },
//         s: {
//             pressed: false,
//         },
//   };

//     // document.getElementById("objectCoords-HAT").innerHTML = xpos + ", " + ypos;

//     // const circle = {
//     //     x: 200,
//     //     y: 200,
//     //     size: 15,
//     // }

//     // function drawCircle() {
//     //     ctx.beginPath()
//     //     ctx.arc(circle.x, circle.y, circle.size, 0, Math.PI * 2)
//     //     ctx.fillStyle = "red"
//     //     ctx.fill()
//     // }

//     function animate() {
//         let distance
        
//         // Initialization
//         window.requestAnimationFrame(animate);
//         ctx.fillStyle = "white";
//         ctx.fillRect(0, 0, canvas.width, canvas.height);
//         // player.position.x = xpos + player.minVelocity
//         // player.position.y = ypos + player.minVelocity
//         player.update();
//         agent.update()
//         // enemy.update();

//         // player.velocity = 0
//          // player.velocity.x = 0;
//          // player.velocity.y = 0;

//         // console.log('The last key pressed was: ' + player.lastKey)

//         distance = Math.sqrt(((player.position.x - agent.position.x) ^ 2) + ((player.position.y - agent.position.y) ^2))
//         console.log("The distance is:" + distance)
//         if (distance !== 0) {
//             agent.angle = Math.atan2(player.position.y - agent.position.y, player.position.x - agent.position.x) * 180.0 / Math.PI

//             agent.velocity.x = Math.min(player.velocity.x + player.acceleration, agent.maxVelocity )
//         }

//         // Player Movement
//         if (keys.d.pressed) {
//             player.angle -= player.rotationVel
//             console.log('Angle: ' + player.angle)
//         } else if (keys.a.pressed) {
//             player.angle += player.rotationVel
//             console.log('Angle: ' + player.angle)
//         }
        
//         if (keys.w.pressed) {
//             player.velocity.x = Math.min(player.velocity.x + player.acceleration, player.maxVelocity)
//             // console.log('Acceleration: ' + player.acceleration + ' Velocity: ' + player.velocity.x)
//         }

//         if (!keys.w.pressed) {
//             player.velocity.x = Math.max(player.velocity.x - player.acceleration, 0)
//             // console.log('Acceleration: ' + player.acceleration + ' Velocity: ' + player.velocity.x)
//         } 

//         // if (!keys.s.pressed) {
//         //     player.velocity.x = Math.min(player.velocity.x + player.acceleration, 0)
//         //     console.log('Acceleration: ' + player.acceleration + ' Velocity: ' + player.velocity.x)
//         // }
        
//         // if (!keys.a.pressed) {
//         //     player.angle = Math.max(player.angle - player.rotationVel, 0)
//         // }

//         // if (!keys.d.pressed && player.lastKey == "d") {
//         //     player.angle = Math.min(player.angle + (player.rotationVel / 10), 0)
//         //     console.log('Angle not pressed Input d: ' + player.angle - player.rotationVel)
//         // }

//         // if (!keys.a.pressed && player.lastKey == "a") {
//         //     player.angle = Math.max(player.angle - (player.rotationVel / 10), 0)
//         //     console.log('Angle not pressed Input a: ' + player.angle - player.rotationVel)
//         // }

//         // player.velocity.x = 0;
//         // enemy.velocity.x = 0;

//     }

    


//     animate()

    


// }




 // Amount of rounds a player will play the mirror game.
    // socket.emit('beginParameters', room);
    /*let interval = setInterval(() => {
      if (mongoClient !== undefined) {
        const db = mongoClient.db(dbName);
        db.collection("room_scores").insert({
          time: new Date(),
          room: room,
          score: room_score[room],
          competence: room_competence[room],
          predictability: room_predictability[room],
          integrity: room_integrity[room],
        });
      }
      roundBeginning = false;
      socket.emit("beginGame", roundBeginning);
      socket.emit("end", false);
      setTimeout(() => {
        room_score[room] = 0;
        // Finalization of scores.
        room_predictability[room] = 0;
        // room_integrity[room] = 0
        room_competence[room] = 0;
        // playPositions = []
        // agePositions = []
        roundBeginning = true;
        socket.emit("beginGame", roundBeginning);
        socket.emit("start");
        if (mongoClient !== undefined) {
          const db = mongoClient.db(dbName);
          db.collection("round_begin").insert({ time: new Date(), room: room });
        }
      }, 10000);

      times++;

      //     let counterTimeTotal = 0
      //     setInterval(() => {
      //         console.log("The shape similarity (competence) is: " + curveMatcher.shapeSimilarity(agePositions,playPositions))
      //         console.log("The frechet distance is: " + curveMatcher.frechetDistance(agePositions, playPositions))
      //         counterTimeTotal ++
      //         console.log("The amount of messages is: " + counterTimeTotal)
      //         // room_competence[room] = curveMatcher.shapeSimilarity(agePositions,playPositions)
      //         playPositions = []
      //         agePositions = []
      //     // console.log(playPositionsPrev)
      //     // console.log(playPositions)

      //      // console.log(agePositions)
      //  }, 1000);
      console.log("Times are: " + times);
      if (times >= 2) {
        //amount of rounds
        clearInterval(interval);
        setTimeout(() => {
          roundBeginning = false;
          socket.emit("beginGame", roundBeginning);
          socket.emit("end", true);
          console.log("We entered the end.");
          // let data = JSON.stringify(scores)
          let finalDataPlayer = JSON.stringify(dataPlayer);
          // let textFile = 'scores'+ room + '.json'
          let textFilePlayer = "scores_player_" + socket.id + ".json";
          fs.writeFile(textFilePlayer, finalDataPlayer, (err) => {
            if (err) {
              throw err;
            } else {
              console.log("successful upload");
            }
            console.log("JSON data player is saved.");
          });

          let finalDataAgent = JSON.stringify(dataAgent);
          // let textFile = 'scores'+ room + '.json'
          let textFileAgent = "scores_agent_" + socket.id + ".json";
          fs.writeFile(textFileAgent, finalDataAgent, (err) => {
            if (err) {
              throw err;
            } else {
              console.log("successful upload");
            }
            console.log("JSON data agent is saved.");
          });

          // let textFile
          if (mongoClient !== undefined) {
            const db = mongoClient.db(dbName);
            db.collection("room_scores").insert({
              time: new Date(),
              room: room,
              score: room_score[room],
              competence: room_competence[room],
              predictability: room_predictability[room],
              integrity: room_integrity[room],
            });
          }
        }, totalGameTime);
      }
    }, totalGameTime);*/

    // setInterval(() => {
    // console.log("The shape similarity (competence) is: " + curveMatcher.shapeSimilarity(agePositions,playPositions))
    // console.log("The frechet distance is: " + curveMatcher.frechetDistance(agePositions, playPositions))
    // counterTimeTotal ++
    // console.log("The amount of messages is: " + counterTimeTotal)
    // playPositions = []
    // agePositions = []
    // console.log(playPositionsPrev)
    // console.log(playPositions)

    // console.log(agePositions)
    // }, 1000);

    // let pathTest = new paper.Path({
      //     segments: playPositions
      // })
      // let averageDistance= []
      // let smooth = smoothCurve(playerPositionsTest)
      // let smooth2 = smoothCurve(agentPositionsTest)
      // console.log(smooth[10])
      // console.log(playPositions[10])

      // for (let i = 0; i < smooth.length-1; i++) {
      //     averageDistance.push([playerPositionsTest[i][0]-smooth[i][0], playerPositionsTest[i][1]-smooth[i][1]])
      // }
      // console.log(averageDistance)
      // console.log(`The length of the playerPositions is: ${playerPositionsTest.length} and the smooth curve is: ${smooth.length} `)
      // console.log(smooth)
      // if (!isNaN(playerPositionsTest)) {

      // console.log(playerPositionsTest[10][0]- smooth[10][0])
      // console.log(`Player Test position: ${playerPositionsTest[10][0]} and smooth curve: ${smooth[10][0]}`)
      // }

      // for (let index = 0; index < smooth.length-1; index++) {
      //     smoothFinal.push({x: smooth[index][0], y: smooth[index][1]})
      // }

      // for (let index = 0; index < smooth2.length-1; index++) {
      //     smoothAgentFinal.push({x: smooth2[index][0], y: smooth2[index][1]})

      // }

      // console.log(`First element of smooth: ${smooth[0]} versus ${smooth[0][0]} and ${smooth[0][1]}`)
      // console.log(`The difference with first element is: ${playerPositionsTest[10]-playPositions[10]}`)

      // let balancedCurved1 =curveMatcher.subdivideCurve(agePositions, {numPoints: 50})
      // let balancedCurved11 = curveMatcher.subdivideCurve(agePositions2, {numPoints: 50})

      // let balancedCurved2 =curveMatcher.subdivideCurve(playPositions, {numPoints: 50})

      // let normalizedCurve1 = curveMatcher.procrustesNormalizeCurve(balancedCurved1)
      // let normalizedCurve11 = curveMatcher.procrustesNormalizeCurve(balancedCurved11)

      // let normalizedCurve2 = curveMatcher.procrustesNormalizeCurve(balancedCurved2)

      // let dist = curveMatcher.frechetDistance(normalizedCurve1, normalizedCurve2)
      // let dist2 = curveMatcher.frechetDistance(normalizedCurve11, normalizedCurve2)

      // let curveLen1 = curveMatcher.curveLength(normalizedCurve1)
      // let curveLen11 = curveMatcher.curveLength(normalizedCurve11)

      // let curveLen2 = curveMatcher.curveLength(normalizedCurve2)

      // let maxCurveLen = Math.max(curveLen1, curveLen2)
      // let maxCurveLen2 = Math.max(curveLen11, curveLen2)

      // let similarityNoRot = 1 - dist/ maxCurveLen
      // let similarityNoRot2 = 1 - dist2/ maxCurveLen2

      // let similarity = curveMatcher.shapeSimilarity(agePositions,playPositions)
      // let similarity2 = curveMatcher.shapeSimilarity(agePositions2,playPositions)

      // let distance = curveMatcher.frechetDistance(agePositions, playPositions)
      // let distance2 = curveMatcher.frechetDistance(agePositions2, playPositions)

      // if (isNaN(similarity)) {
      //     similarity = 1
      // }

      // let balancedCurve1Sm = curveMatcher.subdivideCurve(playPositions, { numPoints: 50 });
      // let balancedCurve2Sm = curveMatcher.subdivideCurve(smoothFinal, { numPoints: 50 });

      // let normalizedCurve1Sm = curveMatcher.procrustesNormalizeCurve(balancedCurve1Sm);
      // let normalizedCurve2Sm = curveMatcher.procrustesNormalizeCurve(balancedCurve2Sm);

      // let distSm = curveMatcher.frechetDistance(normalizedCurve1Sm, normalizedCurve2Sm);

      // let curveLen1Sm = curveMatcher.curveLength(normalizedCurve1Sm)
      // let curveLen2Sm = curveMatcher.curveLength(normalizedCurve2Sm)
      // let maxCurveLenSm = Math.max(curveLen1Sm, curveLen2Sm);

      // similarity == 1 means the curves have identical shapes
      // const similaritySm = 1 - distSm / maxCurveLenSm;

      // console.log(`The similarity without rotation is: ${similaritySm} and the distance is: ${distSm}`)

      // let similaritySmooth = curveMatcher.shapeSimilarity(smoothFinal,playPositions)
      // console.log(similaritySmooth)
      // if (isNaN(similaritySmooth)) {
      //     similaritySmooth = 1
      //     console.log("Entered NAN")
      // }

      // let similaritySmoothAgent = curveMatcher.shapeSimilarity(smoothFinal,playPositions)
      // console.log(similaritySmoothAgent)
      // if (isNaN(similaritySmoothAgent)) {
      //     similaritySmoothAgent = 1
      //     console.log("Entered NAN")
      // }

      // let competenceSmoothnessIdeal = amountSharpTurnsIdeal / rotDifferencesIdealAgent.length

      // let predPerson
      // let predAgent
      // let predAgent2

      //     if (prevPlayPositions.length !== 0 && prevAgePositions.length !== 0) {
      //         predPerson = curveMatcher.shapeSimilarity(prevPlayPositions,playPositions)
      //         predAgent = curveMatcher.shapeSimilarity(prevAgePositions, agePositions)
      //    } else {
      //        predPerson = 1
      //        predAgent = 1
      //    }

      //    if (prevPlayPositions.length !== 0 && prevAgePositions2.length !== 0) {
      //         // predPerson = curveMatcher.shapeSimilarity(prevPlayPositions,playPositions)
      //         predAgent2 = curveMatcher.shapeSimilarity(prevAgePositions2, agePositions2)
      //     } else {
      //         // predPerson = 1
      //         predAgent2 = 1
      //     }

      //    if (isNaN(predPerson)) {
      //         predPerson = 1
      //    }

      //    if (isNaN(predAgent)) {
      //         predAgent = 1
      //    }

      //    if (isNaN(predAgent2)) {
      //         predAgent2 = 1
      //    }

      //    console.log(`The similarity is: ${similarity} and the distance is: ${distance}`)
      //console.log(smooth)
      // console.log(`The similarity with the smooth curve is: ${similaritySmooth} and agent is: ${similaritySmoothAgent}`)
      // socket.emit('scoresSimilar', similarity.toFixed(3) , distance.toFixed(3), predPerson.toFixed(3), predAgent.toFixed(3), similarityNoRot.toFixed(3), dist.toFixed(3))
      // score: room_score[room],
        // shapeSimilarityNormRot: similarity.toFixed(3),
        // shapeSimilarityNoRot: similarityNoRot.toFixed(3),
        // predictabilityHuman: predPerson.toFixed(3),
        // predictabilityAgent: predAgent.toFixed(3),
        // competenceSmoothness: competenceSmoothPlayer.toFixed(3),
        // competenceSmoothnessWaves: competenceSmoothWaveAgent.toFixed(3)
        //    let scores2 = {
      //     time: new Date(),
      //     room: room,
      //     shapeSimilarityNormRot: similarity2.toFixed(3),
      //     shapeSImilarityNoRot: similarityNoRot2.toFixed(3),
      //     // predictabilityHuman: predPerson.toFixed(3),
      //     predictabilityAgent: predAgent2.toFixed(3),
      //     competenceSmoothnessIdeal: competenceSmoothnessIdeal.toFixed(3)
      //    }
// setInterval(() => {
  //     // console.log("The shape similarity (competence) is: " + curveMatcher.shapeSimilarity(agePositions,playPositions))
  //     // console.log("The frechet distance is: " + curveMatcher.frechetDistance(agePositions, playPositions))
  //     // counterTimeTotal ++
  //     // console.log("The amount of messages is: " + counterTimeTotal)
  //     socket.to(room).emit('scoresSimilar', room, curveMatcher.shapeSimilarity(agePositions,playPositions), curveMatcher.frechetDistance(agePositions, playPositions) )
  //     playPositions = []
  //     agePositions = []
  //    // console.log(playPositionsPrev)
  //    // console.log(playPositions)

  //    // console.log(agePositions)
  // }, 1000);

  //Calculation of points in a set period of time.
//calculate points every 100 ms
// setInterval(() => {
//      console.log("The shape similarity (competence) is: " + curveMatcher.shapeSimilarity(agePositions,playPositions))
//      console.log("The frechet distance is: " + curveMatcher.frechetDistance(agePositions, playPositions))
//      // playPositions = []
//      // agePositions = []
//     // console.log(playPositionsPrev)
//     // console.log(playPositions)

//     // console.log(agePositions)
// }, 10000);

// setInterval(() => {
//     // console.log("The shape similarity (competence) is: " + curveMatcher.shapeSimilarity(agePositions,playPositions))
//     // console.log("The frechet distance is: " + curveMatcher.frechetDistance(agePositions, playPositions))
//     // counterTimeTotal ++
//     // console.log("The amount of messages is: " + counterTimeTotal)
//     io.to(room).emit('scoresSimilar', curveMatcher.shapeSimilarity(agePositions,playPositions), curveMatcher.frechetDistance(agePositions, playPositions) )
//     playPositions = []
//     agePositions = []
//    // console.log(playPositionsPrev)
//    // console.log(playPositions)

//    // console.log(agePositions)
// }, 1000);



// Tutorial page.
    // if (urlParams.has("playground")) {
    //   // document.getElementById('info').style.opacity = '0';
    //   // function windowSizeChanged() {
    //   //     var width = document.getElementById('game').offsetWidth;
    //   //     var height = document.getElementById('game').offsetHeight;
    //   //     scaleFactor = Math.min(window.innerWidth / width, window.innerHeight / height);
    //   //     document.getElementById('game').style.transform = 'scale(' + scaleFactor + ')';
    //   //   }
    //   //   window.onresize = windowSizeChanged;
    //   //   windowSizeChanged();
    // }


    // INNER PART UPDATE AGENT


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




    //  OUTER PART UPDATE AGENT

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


       // if (this.speedX > this.maxSpeed) {
    //   this.speedX = this.maxSpeed;
    //   // console.log('Entered in Speed X')
    // } else if (this.speedX < -this.maxSpeed) {
    //   this.speedX = -this.maxSpeed;
    // }

    // if (this.speedY > this.maxSpeed) {
    //   this.speedY = this.maxSpeed;
    //   // console.log('Entered in Speed Y')
    // } else if (this.speedY < -this.maxSpeed) {
    //   this.speedY = -this.maxSpeed;
    // }

    // let distancePoints = this.defineMagnitude(
    //   this.target.x - this.collisionX,
    //   this.target.y - this.collisionY
    // );

    // if (steering.x < 0) {
    //   this.speedXPoint = -this.speedXPoint;
    // } else {
    //   this.speedXPoint = this.speedXPoint;
    // }

    // if (steering.y < 0) {
    //   this.speedYPoint = -this.speedYPoint;
    // } else {
    //   this.speedYPoint = this.speedYPoint;
    // }

    // let newForce = this.secondOrderForces();
    // console.log(`The forces are: X ${newForce.x} Y: ${newForce.y}`)

    // let currentInput = { x: this.seek().x, y: this.seek().y };
    // let nextInput = {
    //   x: this.seek().x + this.speedX,
    //   y: this.seek().y + this.speedY,
    // };
    // if (nextInput == null) { // Estimate velocity
    // nextInput.x = (currentInput.x - this.previousInput.x) / this.deltaTime;
    // nextInput.y = (currentInput.y - this.previousInput.y) / this.deltaTime;
    // this.previousInput = currentInput;
    // }
    // this.frequency = 30;
    // console.log(value)
    // console.log(Number.isInteger(sliderValue))
    // this.frequency = sliderValue;
    // console.log(`The value of the slider is: ${sliderValue}`)
    // this.SecondOrderDynamics(this.frequency, 6, 20, nextInput);

    // this.outputVectorY.x = this.outputVectorY.x + this.outputVectorYVel.x; // integrate position by velocity
    // this.outputVectorYVel.x =
    //   this.outputVectorYVel.x +
    //   (currentInput.x +
    //     this.k3 * nextInput.x -
    //     this.outputVectorY.x -
    //     this.k1 * this.outputVectorYVel.x); // Integrate velocity by acceleration

    // this.outputVectorY.y = this.outputVectorY.y + this.outputVectorYVel.y; // integrate position by velocity
    // this.outputVectorYVel.y =
    //   this.outputVectorYVel.y +
    //   (currentInput.y +
    //     this.k3 * nextInput.y -
    //     this.outputVectorY.y -
    //     this.k1 * this.outputVectorYVel.y); // Integrate velocity by acceleration

    // console.log(`The value is: ${this.outputVectorY.x} and ${this.outputVectorY.y}`)
    // console.log(`The value of the speed is: ${this.outputVectorYVel.x} and ${this.outputVectorYVel.y}`)

    // console.log(`The values of the constants are k1: ${this.k1} k2:${this.k2} k3:${this.k3}`)

      // let upperDifferenceX = this.maxSpeed - (this.speedX + this.accX)
      // let upperDifferenceY = this.maxSpeed - (this.speedY + this.accy)
      // let lowerDifferenceX = (this.speedX + this.accX) - this.minSpeed;
      // let lowerDifferenceY = (this.speedY + this.accY) - this.minSpeed;
      // let signDifferenceX = Math.random();
      // if (upperDifferenceX === lowerDifferenceX && signDifferenceX > 0.5) {
      //   this.moveErrorX = - Math.random() * upperDifferenceX;
      // } else if (upperDifferenceX === lowerDifferenceX && signDifferenceX <= 0.5) {
      //   this.moveErrorX = Math.random() * upperDifferenceX;
      // } else if (upperDifferenceX > lowerDifferenceX && this.competence) {
      //   this.moveErrorX = - Math.random() * lowerDifferenceX;
      // } else if (upperDifferenceX > lowerDifferenceX && !this.competence) {
      //   this.moveErrorX = Math.random() * upperDifferenceX;
      // }

      // let signDifferenceY = Math.random();
      // if (upperDifferenceY === lowerDifferenceY && signDifferenceY > 0.5) {
      //   this.moveErrorY = - Math.random() * upperDifferenceY;
      // } else if (upperDifferenceY === lowerDifferenceY && signDifferenceY <= 0.5) {
      //   this.moveErrorY = Math.random() * upperDifferenceY;
      // } else if (upperDifferenceY > lowerDifferenceY && this.competence) {
      //   this.moveErrorY = - Math.random() * lowerDifferenceY;
      // } else if (upperDifferenceY > lowerDifferenceY && !this.competence) {
      //   this.moveErrorY = Math.random() * upperDifferenceY;
      // }

      // Definition of the First Parameter of Bezier Curve
      // this.p1Bezier = {
      //   x: Math.floor(this.game.width / 4),
      //   y: Math.floor(this.game.height / 2),
      // };

      // while (this.p1Bezier.x + this.collisionRadius + 50 > this.game.width || this.p1Bezier.x - this.collisionRadius - 50 < 0) {
      //     this.p1Bezier.x = Math.floor(Math.random() * this.game.width)
      //     times ++;
      // }
      // while (this.p1Bezier.y + this.collisionRadius + 50 > this.game.height || this.p1Bezier.y - this.collisionRadius - 50 < 0) {
      //     this.p1Bezier.y = Math.floor(Math.random() * this.game.height)
      //     times ++;
      // }

      // this.p2Bezier = {x: Math.floor(Math.random() * this.game.width), y: Math.floor(Math.random() * this.game.height)}

      // Definition of the Second Parameter of Bezier Curve
      // this.p2Bezier = {
      //   x: Math.floor(this.game.width / 2),
      //   y: Math.floor(this.game.height / 2),
      // };

      // while (this.p2Bezier.x + this.collisionRadius + 50 > this.game.width || this.p2Bezier.x - this.collisionRadius - 50 < 0) {
      //     this.p2Bezier.x = Math.floor(Math.random() * this.game.width)
      //     times ++;
      // }
      // while (this.p2Bezier.y + this.collisionRadius + 50> this.game.height || this.p2Bezier.y - this.collisionRadius - 50 < 0) {
      //     this.p1Bezier.y = Math.floor(Math.random() * this.game.height)
      //     times ++;
      // }

      // this.endBezier = {x: Math.floor(Math.random() * this.game.width), y: Math.floor(Math.random() * this.game.height)}
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


    // console.log(`This timer is: ${this.timerDecision}`)


        // if (!this.movementDecision && this.timerDecision == 2) {
        //     console.log(`ENTERED FUNCTION`)
        // }

        // console.log(`The timer is: ${this.timerDecision} with decision: ${this.movementDecision}`)
        // console.log(`The speed in X: ${this.speedX}, Y: ${this.speedY}`)
        // console.log(`The movement counter is in: ${this.movementCounter}`)

        // console.log(`The timer is: ${this.timer}`)

    	// console.log(this.force)

        // this.dx = this.game.mouse.x - this.collisionX 
        // this.dy = this.game.mouse.y - this.collisionY

        // Constant speed
        // const distance = Math.hypot(this.dy, this.dx);
        // this.speedX = this.dx/distance || 0;
        // this.speedY = this.dy/distance || 0;

        // Speed proportional to the distance between mouse and center of circle.
        // this.speedX = (this.dx) /20;
        // this.speedY = (this.dy) /20;


        // let steering = this.arrive()    

        // this.applyForce(steering)

        // console.log(`The movement force in x: ${moveX} and in Y: ${moveY}`)


         // OLD VERSION OF THE FOLLOWER ==========================================================
    // if (
    //   (this.player.movementDecision ||
    //     (!this.player.movementDecision &&
    //       this.defineMagnitude(
    //         this.target.x - this.collisionX,
    //         this.target.y - this.collisionY
    //       ) <= 20)) &&
    //   !this.movementDecision
    // ) {
    //   this.target = { x: this.player.collisionX, y: this.player.collisionY };
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



    // } else {

    //   // CONDITION TO SEE IF THE AGENT DECIDED ON A MOVEMENT
    //   this.prevMoveDec = this.movementDecision;
    //   if (!this.movementDecision) {
    //     this.paintMovementDecision = true;
    //     this.decideMovement();
    //     socket.emit(
    //       "movementDecisionAgent",
    //       room,
    //       this.maxSpeed,
    //       this.trajectoryMovement.length - 1
    //     );

    //     // this.movementOrder++;
    //     // if (this.movementOrder > 3) {
    //     //   this.movementOrder = 0;
    //     // }

    //     // The movement is decided and the counter is increased
    //     this.movementDecision = true;
    //     this.movementCounter++;
    //     this.target = this.trajectoryMovement[this.counterTarget];


    //   }

    //   // CONDITION TO SEE IF THE AGENT ARRIVED TO THE TARGET POINT
    //   if (
    //     Math.abs(Math.floor(this.collisionX) - Math.floor(this.target.x)) <=
    //     20 &&
    //     Math.abs(Math.floor(this.collisionY) - Math.floor(this.target.y)) <= 20
    //   ) {
    //     this.hasArrived = true;
    //   }

    //   // CHANGE THE TARGET TO A NEW TARGET
    //   if (this.hasArrived === true) {

    //     this.counterTarget++;

    //     if (this.counterTarget < this.trajectoryMovement.length) {

    //       this.target = this.trajectoryMovement[this.counterTarget];

    //       if (!this.competence) {
    //         this.agentDesiredSpeedX = Math.random() * this.maxSpeed;
    //         this.agentDesiredSpeedY = Math.random() * this.maxSpeed;
    //         this.slowRadiusAgent = Math.random() * 50;
    //       } else {
    //         this.slowRadiusAgent = 50;
    //       }


    //     }

    //     if (this.counterTarget >= this.trajectoryMovement.length) {
    //       this.counterTarget = 0;
    //       this.movementDecision = false;
    //       this.trajectoryMovement = [];
    //       this.speedXPoint = 0;
    //       this.speedYPoint = 0;
    //       this.velocityProfile = [];
    //       this.moveErrorX = Math.abs(getNormallyDistributedRandomNumber(0, 1));
    //       this.moveErrorY = Math.abs(getNormallyDistributedRandomNumber(0, 1));
    //     }
    //     // console.log(this.target)
    //     this.hasArrived = false;
    //   }
    //   // console.log(this.target)
    //   // FORCE DEFINITION AND APPLICATION TO GO TO THE CURRENT TARGET
    //   // let steering = this.seek();
    //   let steering = this.movementAgent();
    //   // let steering = this.arrive();
    //   this.applyForce(steering);



    //   // this.SecondOrderDynamics(1, 2, 1, this.collisionX)



    //   this.accX += this.getRandomJitter();
    //   this.accY += this.getRandomJitter();

    //   this.speedX += this.accX;
    //   this.speedY += this.accY;

    //   this.collisionX += this.speedX;
    //   this.collisionY += this.speedY;

    //   this.prevAccX = this.accX;
    //   this.prevAccY = this.accY;

    //   if (this.speedX > this.maxSpeed) {
    //     this.speedX = this.maxSpeed;
    //     // console.log('Entered in Speed X')
    //   } else if (this.speedX < -this.maxSpeed) {
    //     this.speedX = -this.maxSpeed;
    //   }

    //   if (this.speedY > this.maxSpeed) {
    //     this.speedY = this.maxSpeed;
    //     // console.log('Entered in Speed Y')
    //   } else if (this.speedY < -this.maxSpeed) {
    //     this.speedY = -this.maxSpeed;
    //   }

    //   this.moveErrorX = 0;
    //   this.moveErrorY = 0;

    //   this.accX = 0;
    //   this.accY = 0;

    // }
    // END OLD VERSION OF THE FOLLOWER ======================================================



    // OLD LEADER MOVEMENT ==================================================================================
    // if (this.competence) {
    //   this.maxJitter = 0;
    // } else {
    //   this.maxJitter = 5;
    // }

    // this.maxJitter = 0;

    // const newTime = performance.now();
    // const dt = (newTime - this.currentTime) / 1000; // Convert to seconds
    // this.currentTime = newTime;


    // this.prevMoveDec = this.movementDecision;

    // if (!this.movementDecision) {

    //   // Choose a movement to do
    //   this.paintMovementDecision = true;
    //   this.decideMovement(0);
    //   socket.emit(
    //     "movementDecisionAgent",
    //     room,
    //     this.maxSpeed,
    //     this.trajectoryMovementSamplePlayer.length - 1
    //   );

    //   this.movementOrder++;
    //   if (this.movementOrder > 3) {
    //     this.movementOrder = 0;
    //   }
    //   this.movementDecision = true;
    //   this.movementCounter++;
    //   this.targetSamplePlayer = this.trajectoryMovementSamplePlayer[this.counterTarget];
    //   if (!this.competence) {
    //     this.agentDesiredSpeedX = Math.random() * this.maxSpeed;
    //     this.agentDesiredSpeedY = Math.random() * this.maxSpeed;
    //     this.slowRadiusAgent = Math.random() * 50;
    //   } else {
    //     this.slowRadiusAgent = 50;
    //   }
    // }

    // if (
    //   Math.abs(Math.floor(this.collisionX) - Math.floor(this.targetSamplePlayer.x)) <= 20 &&
    //   Math.abs(Math.floor(this.collisionY) - Math.floor(this.targetSamplePlayer.y)) <= 20
    // ) {
    //   this.hasArrived = true;
    // }

    // if (this.hasArrived === true) {
    //   this.counterTarget++;
    //   if (this.counterTarget < this.trajectoryMovement.length) {
    //     this.targetSamplePlayer = this.trajectoryMovement[this.counterTarget];
    //     if (!this.competence) {
    //       this.agentDesiredSpeedX = Math.random() * this.maxSpeed;
    //       this.agentDesiredSpeedY = Math.random() * this.maxSpeed;
    //       this.slowRadiusAgent = Math.random() * 50;
    //     } else {
    //       this.slowRadiusAgent = 50;
    //     }
    //   }

    //   if (this.counterTarget >= this.trajectoryMovementSamplePlayer.length) {
    //     this.counterTarget = 0;
    //     this.movementDecision = false;
    //     this.trajectoryMovementSamplePlayer = [];
    //   }

    //   this.hasArrived = false;
    // }

    // // let steering = this.seek();
    // let steering = this.movementAgent();
    // // let steering = this.arrive();
    // this.applyForce(steering);

    // this.accX += this.getRandomJitter();
    // this.accY += this.getRandomJitter();


    // this.speedX += this.accX;
    // this.speedY += this.accY;


    // this.prevAccX = this.accX;
    // this.prevAccY = this.accY;

    // this.prevCollisionX = this.collisionX;
    // this.prevCollisionY = this.collisionY;

    // this.collisionX += this.speedX;
    // this.collisionY += this.speedY;

    // this.rotation =
    //       (Math.atan2(
    //         this.collisionY - this.prevCollisionY,
    //         this.collisionX - this.prevCollisionX
    //       ) *
    //         180.0) /
    //       Math.PI;

    // this.accX = 0;
    // this.accY = 0;


    // END OF OLD LEADER MOVEMENT =========================================================


          // // WRITE THE SCORES OF THE PLAYER IN A JSON FILE.
      // let finalDataPlayer = JSON.stringify(dataPlayer);
      // let finalDataPlayerPosition = JSON.stringify(dataPlayerPosition);
      // let textFilePlayerPosition = "scores_player_training_position_" + socket.id + "_Round" + currentRoundTrainingTotal + ".json"
      // let textFilePlayer = "scores_player_training" + socket.id + "_Round" + currentRoundTrainingTotal + ".json";
      // dataPlayerPosition = [];
      // fs.writeFile(textFilePlayer, finalDataPlayer, (err) => {
      //   if (err) {
      //     throw err;
      //   } else {
      //     console.log("successful upload");
      //   }
      //   console.log("JSON data training player is saved.");
      // });
      // fs.writeFile(textFilePlayerPosition, finalDataPlayerPosition, (err) => {
      //   if (err) {
      //     throw err;
      //   } else {
      //     console.log("successful upload")
      //   }
      //   console.log("JSON data training player is saved.");
      // })

      // // WRITE THE SCORES OF THE AGENT IN A JSON FILE.
      // let finalDataAgent = JSON.stringify(dataAgent);
      // let finalDataAgentPosition = JSON.stringify(dataAgentPosition);
      // let textFileAgentPosition = "scores_agent_training_position_" + socket.id + "_Round" + currentRoundTrainingTotal + ".json";
      // let textFileAgent = "scores_agent_training" + socket.id + "_Round" + currentRoundTrainingTotal + ".json";
      // dataAgentPosition = []
      // fs.writeFile(textFileAgent, finalDataAgent, (err) => {
      //   if (err) {
      //     throw err;
      //   } else {
      //     console.log("successful upload");
      //   }
      //   console.log("JSON data training agent is saved.");
      // });
      // fs.writeFile(textFileAgentPosition, finalDataAgentPosition, (err) => {
      //   if (err) {
      //     throw err;
      //   } else {
      //     console.log("successful upload");
      //   }
      //   console.log("JSON data training agent is saved.");
      // });

      // let textFile
      // if (mongoClient !== undefined) {
      //   const db = mongoClient.db(dbName);
      //   db.collection("room_scores").insert({
      //     time: new Date(),
      //     room: room,
      //     score: room_score[room],
      //     competence: room_competence[room],
      //     predictability: room_predictability[room],
      //     integrity: room_integrity[room],
      //   });
      // }


      // COMMENTS FROM THE GAME TRAINING=============================

       // VERSION OF THE GAME VARIABLES
    // let version;
    // MAIN VARIABLES FOR GAME MODES
    // let perfect = false;
    // let comp = false;
    // let pred = false;
    // let versionPredictability;
    // let qualityCompetence;
    // let qualityPredictability;


    // VALIDATION EXPERIMENT SEQUENCE
    // const $mainVExperiment = document.querySelector("#v-experiment-begin");
    // const $validationExperimentInstructions = document.querySelector("#validation-instructions-button");
    // const $trainingSessionEnd = document.querySelector("#button-training-session");
    // const $validationExperimentPage = document.querySelector("#button-begin-validation-experiment")
    // const $validationExperimentBegin = document.querySelector("#startValidationExperiment")


     // BUTTONS AND FORMS

    // Form that defines parameters for the demo.
    // const $submitGameMode = document.querySelector("#form");
    // const $startDemo = document.querySelector("#startNow");
    // const $backButton = document.querySelector("#goBack");
    // const $similarityM = document.querySelector("#similarityMeasure");
    // const $distanceM = document.querySelector("#distanceMeasure");
    // const $similarNoRotM = document.querySelector("#similarNoRotMeasure");

    // let roomName;

    // let rotationPlayer = 0;

    // let agentIdealPrevX;
    // let agentIdealPrevY;

    // let agentWavesPrevX;
    // let agentWavesPrevY;

    // let admin = false;

    // let countStop = 0;

    // let distance;
    // let distanceArray = [];
    // let anglePlayerSource;
    // let angleAgentSource;

    // Agent samples the position of the player at a given time interval
    // let positionPlayerIntervalId = undefined;

    // SOURCES OF NOISE
    // let perlinNoise = false;

    // COMPETENCE VARIABLES
    // let meanCompetence;
    // let stddevCompetence;
    // let competenceValueList = [];
    // let competenceAngle;
    // let competenceVelocity;
    // let competenceDistance;
    // let distanceComp;
    // let noiseXCompetence;
    // let noiseYCompetence;
    // let playerPosCompX;
    // let playerPosCompY;
    // let randomNumberInterval;
    // let versionCompetence = 0;

    // let jerkPlayer = 0;
    // let jerkAgent = 0;

    // let jerkXPlayer = 0;
    // let jerkYPlayer = 0;
    // let jerkXAgent = 0;
    // let jerkYAgent = 0;

    // let jerksXPlayer = [];
    // let jerksYPlayer = [];
    // let jerksXAgent = [];
    // let jerksYAgent = [];

    // COMPETENCE/INCOMPETENCE PARAMETERS

    // PREDICTABILITY VARIABLES
    // let predictabilityActive;
    // let meanPredictability = 0.0;
    // let stddevPredictability = 100;
    // let stddevPredRad = Math.PI;
    // let noiseXPredictability;
    // let noiseYPredictability;
    // let distancePred;
    // let randomNumberIntervalPredic;

    // let playerPosPredX;
    // let playerPosPredY;
    // let randomNumPred;

    // let curvaturePlayer;

    // let curvatureAgent;

    // let timer = 0;

    // let inter = 0;
    // let competenceActive = false;
    // let randomPerlinNoise = false;
    // let idealAngle;
    // let idealVelocity;
    // let rotationDifference;
    // let rotationDifferenceAIdeal;
    // let rotationDifferenceAWaves;

    // let xpos;
    // let ypos;

    // let velocityPlayer;

    // let testLogic = false;

    // BEGINNING OF THE NEW PROGRAM
    // let timesProfile = 0;
    // let roundBeginningGame = false;
    // let mode = 0;

    // let times = 0;
    // let score = 0;
    // let testSmooth;
    // let interval;
    // let sliderCompetence;
    // let competencePlayer = [];
    // let sliderPredictability;
    // let entropy;
    // let smoothness;
    // let frameP;
    // let accelXPlayer = [];
    // let accelYPlayer = [];
    // let accelXAgent = [];
    // let accelYAgent = [];
    // let prevAccelerationX = 0;
    // let prevAccelerationY = 0;
    // let jerkX = 0;
    // let jerkY = 0;
    // let accel = 0;
    // let smoothP;
    // let currentPath;
    // let stats;
    // let currentTarget;
    // let targetCounter = 0;
    // let txt;
    // let prevMouseX1;
    // let prevMouseY1;
    // let curvaturesAgent = [];
    // let curvaturesPlayer = [];
    // let anglePlayerSource
    // let angleAgentSource

    // let agentCounterMove = 0;
    // let playerCounterMove = 0;

    // let agentAccel = [];

    // COUNTER FOR THE NUMBER OF ROUNDS
    // let numberOfRounds = 0;

    // CANVAS DEFINITION FOR GAMES


    // GAME EXPERIMENT
    // BEGINNING OF THE OLD PROGRAM

    // let speedSelection = document.querySelector("#spdOptions");
    // let levelCompetence = document.querySelector("#competenceOptions");
    // let levelPredictability = document.querySelector("#predictabilityOptions");
    // let measureCompetenceType = document.querySelector("#measureCompetence");
    // let measurePredictabilityType = document.querySelector("#measurePredictability");


    // let compMeasurement = 0;

    // let mouseSpeedY = [];
      // let speeds = [];
      // let speeds2 = [];
      // let rounds = 0;
      // let prevMoveX = 0;
      // let prevMoveY = 0;
      // let prevMoveAgentX = 0;
      // let prevMoveAgentY = 0;
      // let prevSpeedX = 0;
      // let prevSpeedY = 0;

      // speeds.push(gameTraining.player.speedX);
            // speeds2.push(gameTraining.player.speedY);
            // accelXAgent.push(gameTraining.agent.prevAccX);
            // accelYAgent.push(gameTraining.agent.prevAccY);

            // if (speeds.length >= 2) {
            //   accelXPlayer.push(
            //     speeds[speeds.length - 1] - speeds[speeds.length - 2]
            //   );
            // }

            // if (speeds2.length >= 2) {
            //   accelYPlayer.push(
            //     speeds2[speeds2.length - 1] - speeds2[speeds2.length - 2]
            //   );
            // }

            // if (accelXPlayer.length >= 2) {
            //   jerkXPlayer =
            //     accelXPlayer[accelXPlayer.length - 1] -
            //     accelXPlayer[accelXPlayer.length - 2];
            //   jerksXPlayer.push(
            //     accelXPlayer[accelXPlayer.length - 1] -
            //     accelXPlayer[accelXPlayer.length - 2]
            //   );
            // }

            // if (accelYPlayer.length >= 2) {
            //   jerkYPlayer =
            //     accelYPlayer[accelYPlayer.length - 1] -
            //     accelYPlayer[accelYPlayer.length - 2];
            //   jerksYPlayer.push(
            //     accelYPlayer[accelYPlayer.length - 1] -
            //     accelYPlayer[accelYPlayer.length - 2]
            //   );
            // }

            // if (accelXAgent.length >= 2) {
            //   jerkXAgent =
            //     accelXAgent[accelXAgent.length - 1] -
            //     accelXAgent[accelXAgent.length - 2];
            //   jerksXAgent.push(
            //     accelXAgent[accelXAgent.length - 1] -
            //     accelXAgent[accelXAgent.length - 2]
            //   );
            // }

            // if (accelYAgent.length >= 2) {
            //   jerkYAgent =
            //     accelYAgent[accelYAgent.length - 1] -
            //     accelYAgent[accelYAgent.length - 2];
            //   jerksYAgent.push(
            //     accelYAgent[accelYAgent.length - 1] -
            //     accelYAgent[accelYAgent.length - 2]
            //   );
            // }

            // mouseSpeedX.push(gameTraining.mouse.x - prevMoveX);
            // mouseSpeedY.push(gameTraining.mouse.y - prevMoveY);

            // if (
            //   accelXPlayer[accelXPlayer.length - 1] !== undefined &&
            //   accelYPlayer[accelYPlayer.length - 1] !== undefined
            // ) {
            //   curvaturePlayer = calculateCurvature(
            //     gameTraining.player.speedX,
            //     gameTraining.player.speedY,
            //     accelXPlayer[accelXPlayer.length - 1],
            //     accelYPlayer[accelYPlayer.length - 1]
            //   );

            //   if (curvaturePlayer !== NaN && curvaturePlayer !== null) {
            //     curvaturesPlayer.push(curvaturePlayer);
            //     curvaturePlayer = 0;
            //   } else {
            //     console.log(`The function is working`);
            //   }
            // }

            // if (gameTraining.agent.accX !== undefined && gameTraining.agent.accY !== undefined) {
            //   curvatureAgent = calculateCurvature(
            //     gameTraining.agent.speedX,
            //     gameTraining.agent.speedY,
            //     gameTraining.agent.prevAccX,
            //     gameTraining.agent.prevAccY
            //   );
            //   curvaturesAgent.push(curvatureAgent);
            // }
            // console.log(!gameTraining.player.movementDecision &&
            //   gameTraining.player.prevMoveDec !== gameTraining.player.movementDecision, gameTraining.player.movementDecision, gameTraining.player.prevMoveDec, gameTraining.player.movementDecision)
            // if (
            //   !gameTraining.player.movementDecision &&
            //   gameTraining.player.prevMoveDec !== gameTraining.player.movementDecision
            // ) {
            //   socket.emit("calculateMeasuresPlayer", room);
            //   curvaturesPlayer = [];
            // }
            // if (
            //   !gameTraining.agent.movementDecision &&
            //   gameTraining.agent.prevMoveDec !== gameTraining.agent.movementDecision
            // ) {
            //   socket.emit("calculateMeasuresAgent", room);
            //   curvaturesAgent = [];
            // }


            // console.log(`The target is ${this.targetSamplePlayer.x} and ${this.targetSamplePlayer.y}`)

    // Condition when player is not moving


    // Condition for adapting to sharp turns of player.

    

    // if (Math.abs(this.player.rotation) >= 90) {
    //   this.amountOfSharpTurnsPlayer ++;
    // } else if (Math.abs(this.player.rotation) < 90 && this.amountOfSharpTurnsPlayer > 0) {
    //   this.amountOfSmoothTurnsPlayer ++;
    
    // }

    // if (this.amountOfSharpTurnsPlayer >= 20 && this.amountOfSmoothTurnsPlayer <= 10) {
    //   // this.movementDecision = false;
    //   this.addEndBezier();
    //   // this.trajectoryMovementSamplePlayer = [this.targetSamplePlayer]
    //   this.amountOfSharpTurnsPlayer = 0;

    // }

    // if (this.amountOfSmoothTurnsPlayer >= 10) {
    //   this.amountOfSharpTurnsPlayer = 0;
    //   this.amountOfSmoothTurnsPlayer = 0;
    // }

    // if (this.pendingEndBezier.length === 0) {
    //   this.addEndBezier()
    // }

        // function startDemo() {
    //   toggleScreen("mode-screen", false);
    //   toggleScreen("demo", true);

    //   socket.on("beginGame", function () {
    //     urlParams = new URLSearchParams(window.location.search);

    //     if (urlParams.has("room")) {
    //       room = urlParams.get("room");
    //       // Possibility of removing given new configuration.
    //       // Is the user entering an admin or a player.
    //       socket.emit("join_room", room);
    //     }
    //   });
    // }

    // function goBackMenu() {
    //   toggleScreen("mode-screen", true);
    //   toggleScreen("demo", false);
    // }

    // BUTTON CLICKING FOR MENUS

    // DEMO SEQUENCE

    // $backButton.addEventListener("click", goBackMenu);

    // $mainMenu.addEventListener("click", (e) => {
    //   startMenu();
    // });

    // Go from the training session instructions to the training session.
    // $trainingSessionExperiment.addEventListener("click", (e) => {
    //   startTrainingSession()
    // })
    // Go from the training session to the training debrief.
    // $trainingSessionEnd.addEventListener("click", (e) => {
    //   startTrainingSessionDebrief();
    // })

    // $validationExperimentBegin.addEventListener("click", (e) => {
    //   if (!document.pointerLockElement) {
    //     canvas.focus();
    //     canvas.requestPointerLock({
    //       unadjustedMovement: false,
    //     });
    //   }
    //   $validationExperimentBegin.disable = true
    //   newValidation();
    // })


    // $startDemo.addEventListener("click", () => {
    //   if (!document.pointerLockElement) {
    //     canvas.focus();
    //     canvas.requestPointerLock({
    //       unadjustedMovement: false,
    //     });
    //   }
    //   $startDemo.disable = true
    //   newGame();
    // });



    // GAME EXPERIMENT
    // BEGINNING OF THE OLD PROGRAM

    // $backButton.addEventListener("click", goBackMenu);

    // $mainMenu.addEventListener("click", (e) => {
    //   startMenu();
    // });

    // let speedSelection = document.querySelector("#spdOptions");
    // let levelCompetence = document.querySelector("#competenceOptions");
    // let levelPredictability = document.querySelector("#predictabilityOptions");
    // let measureCompetenceType = document.querySelector("#measureCompetence");
    // let measurePredictabilityType = document.querySelector("#measurePredictability");


    // $submitGameMode.addEventListener("submit", (e) => {
    //   e.preventDefault();

    //   if (levelCompetence.options[levelCompetence.selectedIndex].value === "low") {
    //     // console.log('It works with comp')
    //     meanCompetence = 0.0;
    //     stddevCompetence = 300.0;
    //   } else if (
    //     levelCompetence.options[levelCompetence.selectedIndex].value === "high"
    //   ) {
    //     // console.log('It works with comp1')
    //     meanCompetence = 0.0;
    //     stddevCompetence = 100.0;
    //   } else if (
    //     levelCompetence.options[levelCompetence.selectedIndex].value === "none"
    //   ) {
    //     // console.log('It works with comp2')
    //   }

    //   if (
    //     levelPredictability.options[levelPredictability.selectedIndex].value ===
    //     "low"
    //   ) {
    //     // console.log('It works with pred')
    //     meanPredictability = 0.0;
    //     stddevPredRad = Math.PI;
    //   } else if (
    //     levelPredictability.options[levelPredictability.selectedIndex].value ===
    //     "high"
    //   ) {
    //     // console.log('It works with pred1')
    //     meanPredictability = 0.0;
    //     stddevPredRad = Math.PI / 4;
    //   } else if (
    //     levelPredictability.options[levelPredictability.selectedIndex].value ===
    //     "none"
    //   ) {
    //     // console.log('It works with pred2')
    //   }

    //   if (
    //     measureCompetenceType.options[measureCompetenceType.selectedIndex].value ===
    //     "version1"
    //   ) {
    //     // console.log('It works with comp measure')
    //   }

    //   if (
    //     measurePredictabilityType.options[measurePredictabilityType.selectedIndex]
    //       .value === "version1"
    //   ) {
    //     // console.log('It works with comp measure')
    //   }
    //   startDemo();
    // });
    // TRAINING GAME

    // function startTrainingSession() {
    //   toggleScreen("instructions-training-session-en", false);
    //   toggleScreen("training-session", true);
    //   if (!document.pointerLockElement) {
    //     canvasTraining.focus();
    //     canvasTraining.requestPointerLock({
    //       unadjustedMovement: false,
    //     });
    //   }
    //   $trainingSessionEnd.disabled = true;
    //   newTraining();
    // }
// // Training Canvas Definition
    // const canvasTraining = document.getElementById("training-game");
    // const ctxTraining = canvasTraining.getContext("2d");
    // // Training Canvas Dimensions
    // canvasTraining.width = 800;
    // canvasTraining.height = 500;
    // // Canvas Validation Experiment Definition
    // const canvasValidation = document.getElementById("canvas-validation-game");
    // const ctxValidation = canvasValidation.getContext("2d");
    // // Canvas Validation Experiment Dimensions
    // canvasValidation.width = 800;
    // canvasValidation.height = 500;

    // // Demo Canvas Definition
    // const canvas = document.getElementById("canvas-demo");
    // const ctx = canvas.getContext("2d");
    // // Demo Canvas Dimensions
    // canvas.width = 800;
    // canvas.height = 500;

    // Timers Definition

    // Training Session Timers Definition
    // let timerBetweenRoundsTraining = document.getElementById("time-training-prelim");
    // let timerRoundsTraining = document.getElementById("time-training-round");
    // // Training number of rounds
    // let roundNumber = 0;
    // // Validation Experiment Timers Definition
    // let timerBetweenRoundsValidation = document.getElementById("time-validation-prelim");
    // let timerRoundsValidation = document.getElementById("time-validation-round")


    // BUTTONS AND FORMS

    // Form that defines parameters for the demo.
    // const $submitGameMode = document.querySelector("#form");
    // const $startDemo = document.querySelector("#startNow");
    // const $backButton = document.querySelector("#goBack");
    // const $similarityM = document.querySelector("#similarityMeasure");
    // const $distanceM = document.querySelector("#distanceMeasure");
    // const $similarNoRotM = document.querySelector("#similarNoRotMeasure");

    // let urlParams;
    // let admin = false;

    // let restIntervalId = undefined;
    // let gameIntervalId = undefined;


    // let timer = 0;

    // COUNTER FOR THE NUMBER OF ROUNDS
    // let numberOfRounds = 0;

    // CANVAS DEFINITION FOR GAMES

    // MENU
    // function startMenu() {
    //   toggleScreen("start-screen", false);
    //   toggleScreen("mode-screen", true);
    // }

        // const $trainingSessionExperiment = document.querySelector("#button-training-instructions-en")
    // const $trainingSessionEnd = document.querySelector("#button-training-session");
    // const $validationExperimentBegin = document.querySelector("#startValidationExperiment")
    // const $simulationPage = document.querySelector("#simulation-begin")

// let room;
    // VERSION OF THE GAME VARIABLES
    // let version;
    // MAIN VARIABLES FOR GAME MODES
    // let perfect = false;
    // let comp = false;
    // let pred = false;
    // let versionPredictability;
    // let qualityCompetence;
    // let qualityPredictability;

        // function startTrainingDebrief() {
    //   toggleScreen("training-session", false);
    //   toggleScreen("training-session-debrief", true);
    // }

    // function startSimulation() {
    //   toggleScreen("start-screen", false);
    //   toggleScreen("simulation-screen", true);
    // }


    // From training to training debrief

    // function startTrainingSessionDebrief() {
    //   toggleScreen("training-session", false);
    //   toggleScreen("training-session-debrief", true);
    // }


    // Positions data structure
        // curvatureAgent.push(
        //   Math.abs(speedX * accelY - accelX * speedY) /
        //   (speedX ** 2 + speedY ** 2) ** (3 / 2)
        // );
        // agePositions.push({ x: x, y: y });
        // speedXAgent.push(speedX);
        // speedYAgent.push(speedY);
        // accelXAgent.push(accelX);
        // accelYAgent.push(accelY);
        // jerkXAgent.push(jerkX);
        // jerkYAgent.push(jerkY);
        // // Rotation data structure
        // rotationAgent.push(rotation);
        // if (Math.abs(rotation) >= 90) {
        //   amountSharpTurnsAgent++;
        // }

        // Positions data structure
        // curvaturePlayer.push(
        //   Math.abs(speedX * accelY - accelX * speedY) /
        //   (speedX ** 2 + speedY ** 2) ** (3 / 2)
        // );
        // playPositions.push({ x: x, y: y });
        // speedXPlayer.push(speedX);
        // speedYPlayer.push(speedY);
        // accelXPlayer.push(accelX);
        // accelYPlayer.push(accelY);
        // jerkXPlayer.push(jerkX);
        // jerkYPlayer.push(jerkY);
        // // Rotation data structure
        // rotationPlayer.push(rotation);
        // if (Math.abs(rotation) >= 90) {
        //   amountSharpTurnsAgent++;
        // }

         // ALTERNATIVE FUNCTION TO CALCULATE ONLY THE POSITION

  // socket.on("position", (room) => {
  //   if (roundBeginning || roundBeginningTraining || roundBeginningValidation) {
  //     let metricsPlayer = {
  //       time: new Date(),
  //       nano: performance.now(),
  //       room: room,

  //     }
  //   }
  // })

  // FUNCTION TO CALCULATE THE MEASURES FOR EACH PLAYER

  // socket.on("calculateMeasuresPlayer", (room) => {
  //   if (roundBeginning || roundBeginningTraining || roundBeginningValidation) {
  //     // let predictabilityPlayerTurns =  amountSharpTurnsPlayer / rotDifferencesPlayer.length
  //     // console.log("POR FAVOR SALVENME!!!")
  //     // WRITE THE JSON FILE
  //     let metricsPlayer = {
  //       time: new Date(),
  //       nano: performance.now(),
  //       room: room,
  //       // predictabilityPlayer: predictabilityPlayerTurns,
  //       velocityXPlayer: speedXPlayer,
  //       velocityYPlayer: speedYPlayer,
  //       accelerationXPlayer: accelXPlayer,
  //       accelerationYPlayer: accelYPlayer,
  //       jerkXPlayer: jerkXPlayer,
  //       jerkYPlayer: jerkYPlayer,
  //       curvaturePlayer: curvaturePlayer,
  //     };

  //     dataPlayer.push(metricsPlayer);

  //     playPositions = [];
  //     // rotDifferencesIdealAgent = []
  //     rotationPlayer = [];
  //     speedXPlayer = [];
  //     speedYPlayer = [];
  //     accelXPlayer = [];
  //     accelYPlayer = [];
  //     jerkXPlayer = [];
  //     jerkYPlayer = [];
  //     curvaturePlayer = [];

  //     amountSharpTurnsPlayer = 0;
  //   }
  // });

  // socket.on("calculateMeasuresAgent", (room) => {
  //   if (roundBeginning || roundBeginningTraining || roundBeginningValidation) {
  //     let predictabilityAgentTurns =
  //       amountSharpTurnsAgent / rotationAgent.length;

  //     // WRITE THE JSON FILE
  //     let metricsAgent = {
  //       time: new Date(),
  //       nano: performance.now(),
  //       room: room,
  //       // predictabilityAgent: predictabilityAgentTurns,
  //       velocityXAgent: speedXAgent,
  //       velocityYAgent: speedYAgent,
  //       accelerationXAgent: accelXAgent,
  //       accelerationYAgent: accelYAgent,
  //       jerkXAgent: jerkXAgent,
  //       jerkYAgent: jerkYAgent,
  //       curvatureAgent: curvatureAgent,
  //     };

  //     dataAgent.push(metricsAgent);

  //     agePositions = [];
  //     predictabilityAgentTurns = [];
  //     speedXAgent = [];
  //     speedYAgent = [];
  //     accelXAgent = [];
  //     accelYAgent = [];
  //     jerkXAgent = [];
  //     jerkYAgent = [];
  //     curvatureAgent = [];

  //     amountSharpTurnsAgent = 0;
  //   }
  // });

  // socket.on("calculateMeasures", (room) => {
  //   if (roundBeginning) {


  //     // Measure of Sharp Turns Players and Agents

  //     let predictabilityPlayerTurns =
  //       amountSharpTurnsPlayer / rotDifferencesPlayer.length;
  //     let predictabilityAgentTurns =
  //       amountSharpTurnsAgent / rotationAgent.length;

  //     socket.emit(
  //       "scoresSimilar",
  //       predictabilityPlayerTurns,
  //       predictabilityAgentTurns
  //     );
  //     // console.log(`The amount of sharp turns for the player is: ${amountSharpTurnsPlayer}, for the wave agent: ${amountSharpTurnsWaves} and the ideal agent: ${amountSharpTurnsIdeal}`)
  //     // console.log(`The competence in smoothness of the player is: ${competenceSmoothPlayer.toFixed(3)}, for the wave agent: ${competenceSmoothWaveAgent.toFixed(3)} and the ideal agent: ${competenceSmoothnessIdeal.toFixed(3)}`)
  //     // WRITE THE JSON FILE
  //     let scores = {
  //       time: new Date(),
  //       room: room,
  //       predictabilityPlayer: predictabilityPlayerTurns,
  //       predictabilityAgent: predictabilityAgentTurns,
  //       velocityAgent: speedAgent,
  //       jerkAgent: jerkAgent,
  //     };
  //     dataAgent.push(scores);
  //     // data.resultsAgent2.push(scores2)

  //     prevPlayPositions = playPositions;

  //     prevAgePositions = agePositions;
  //     prevAgePositions2 = agePositions2;

  //     playPositions = [];
  //     // rotDifferencesIdealAgent = []
  //     rotDifferencesPlayer = [];
  //     rotationAgent = [];
  //     // rotDifferencesWaveAgent = []

  //     velocityAgent = [];
  //     velocityPlayer = [];

  //     speedAgent = [];
  //     accelAgent = [];
  //     jerkAgent = [];

  //     agePositions = [];
  //     agePositions2 = [];

  //     playerPositionsTest = [];
  //     smoothFinal = [];
  //     smooth = [];
  //     smooth2 = [];
  //     smoothAgentFinal = [];
  //     // amountSharpTurnsIdeal = 0
  //     amountSharpTurnsAgent = 0;
  //     amountSharpTurnsPlayer = 0;
  //   }
  // });

  // let registerTime = 100;
// setInterval(() => {
//   // console.log(playPositions)
//   // playPositionsPrev = playPositions
//   for (r in rooms_history) {
//     var room = rooms_history[r];
//     var min_distance = 999999;
//     var mean_x = [];
//     var mean_y = [];
//     var mean_rot = [];

//     // Variables for predictability and integrity.
//     // Number of players.
//     var n_players = 0;
//     // For each player in a room have the definition of the parameters for the scores.
//     for (p in room) {
//       n_players++;
//       var player = room[p];
//       var distance = 0;
//       var prev_location = null;
//       // Introduction of Previous speed and angle.
//       let prev_speed = null;
//       let prev_angle = null;

//       // Obtain angle based on the position.
//       // const angleDeg = Math.atan2(mousePosition.y - (canvas.height/2), mousePosition.x - (canvas.width/2)) * 180 / Math.PI;

//       mean_x.unshift(0);
//       mean_y.unshift(0);
//       mean_rot.unshift(null);

//       //
//       for (var l = 0; l < player.length; ++l) {
//         var i = parseInt(l);
//         var location = player[l];
//         // Condition for the difference of location for the players.
//         if (prev_location !== null) {
//           distance += Math.sqrt(
//             Math.pow(location.x - prev_location.x, 2) +
//             Math.pow(location.y - prev_location.y, 2)
//           );
//         }

//         prev_location = location;
//         mean_x[0] += location.x / player.length;
//         mean_y[0] += location.y / player.length;

//         if (mean_rot[0] === null) {
//           mean_rot[0] = location.rotation;
//         } else {
//           while (location.rotation - mean_rot[0] > 180)
//             location.rotation -= 360;
//           while (mean_rot[0] - location.rotation > 180)
//             location.rotation += 360;
//           location.rotation = location.rotation;
//           mean_rot[0] =
//             location.rotation / (i + 1) + (mean_rot[0] * i) / (i + 1);
//         }
//       }
//       min_distance = Math.min(min_distance, distance);
//       rooms_history[r][p] = [];
//     }
//     max_rot_diff = 0;
//     max_location_diff = 0;
//     for (var i = 0; i < mean_rot.length; i++) {
//       for (var j = i + 1; j < mean_rot.length; j++) {
//         rot1 = mean_rot[i];
//         rot2 = mean_rot[j];
//         if (rot1 !== null && rot2 !== null) {
//           while (rot1 - rot2 > 180) rot1 -= 360;
//           while (rot2 - rot1 > 180) rot1 += 360;
//           max_rot_diff = Math.max(max_rot_diff, Math.abs(rot1 - rot2));
//           max_location_diff = Math.max(
//             max_location_diff,
//             Math.sqrt(
//               Math.pow(mean_x[i] - mean_x[j], 2) +
//               Math.pow(mean_y[i] - mean_y[j], 2)
//             )
//           );
//         }
//       }
//     }

//     score = min_distance / (0.01 + max_location_diff);
//     // console.log(score)
//     if (max_rot_diff > 90) score = 0;
//     io.to(r).emit("score", score);
//     room_score[r] += score;
//   }
// }, registerTime);

// // WRITE THE SCORES OF THE PLAYER IN A JSON FILE.
      // let finalDataPlayer = JSON.stringify(dataPlayer);
      // let textFilePlayer = "scores_player_validation" + socket.id + "_Round" + currentRoundValidationTotal + ".json";
      // let textFilePlayerPosition = "scores_player_training_position_" + socket.id + "_Round" + currentRoundTrainingTotal + ".json"
      // fs.writeFile(textFilePlayer, finalDataPlayer, (err) => {
      //   if (err) {
      //     throw err;
      //   } else {
      //     console.log("successful upload");
      //   }
      //   console.log("JSON data experiment player is saved.");
      // });

      // // WRITE THE SCORES OF THE AGENT IN A JSON FILE.
      // let finalDataAgent = JSON.stringify(dataAgent);
      // let textFileAgent = "scores_agent_validation" + socket.id + "_Round" + currentRoundValidationTotal + ".json";

      // fs.writeFile(textFileAgent, finalDataAgent, (err) => {
      //   if (err) {
      //     throw err;
      //   } else {
      //     console.log("successful upload");
      //   }
      //   console.log("JSON data experiment agent is saved.");
      // });

      // let textFile
      // if (mongoClient !== undefined) {
      //   const db = mongoClient.db(dbName);
      //   db.collection("room_scores").insert({
      //     time: new Date(),
      //     room: room,
      //     score: room_score[room],
      //     competence: room_competence[room],
      //     predictability: room_predictability[room],
      //     integrity: room_integrity[room],
      //   });
      // }
