class TrainingGame {
  
  trainingScript(socket, roundNumber) {

    let room;
   
    const $trainingSessionExperiment = document.querySelector("#button-training-instructions-en")
    

    // CANVAS VALIDATION EXPERIMENT SELECTION

    // Training Canvas Definition
    const canvasTraining = document.getElementById("training-game");
    const ctxTraining = canvasTraining.getContext("2d");
    // Training Canvas Dimensions
    canvasTraining.width = 800;
    canvasTraining.height = 500;

    // Timers Definition

    // Training Session Timers Definition
    let timerBetweenRoundsTraining = document.getElementById("time-training-prelim");
    let timerRoundsTraining = document.getElementById("time-training-round");
    // Training number of rounds
    // let roundNumber = 0;

    // Role of the player

  let rolePlayerTraining = document.getElementById("rolePlayer");
  let instructionPlayerTraining = document.getElementById("instructionsPlayer");

   

    let prevX;
    let prevY;
    let rotation = 0;
    let differenceRotation = 0;
    let rotationAgent = 0;
    let differenceRotationAgent = 0;

    let urlParams;
    

    let restIntervalId = undefined;
    let gameIntervalId = undefined;
    let randomBehaviorTime = randIntervalFromIntervalInteger(5, 10) * 1000;
    let randomMirroringTime = 5000;
    let randomJitterTime = randIntervalFromIntervalInteger(1, 2) * 1000;

    let randomBehaviorIntervalId = undefined;
    let randomMirroringIntervalId = undefined;
    let randomJitterIntervalId = undefined;


    let prevMouseX;
    let prevMouseY;

    let prevMoveX;
    let prevMoveY;
    
    const playerPositions = {
      X: [],
      Y: [],
      angle: [],
      velocity: [],
      acceleration: [],
    };
    const agentPositions = {
      X: [],
      Y: [],
      angle: [],
      velocity: [],
      acceleration: [],
      jerk: [],
      distance: [],
    };

    
    let gameStartedTraining = false;

    let playingTraining = false;


    function startTrainingDebrief() {
      toggleScreen("training-session", false);
      toggleScreen("training-session-debrief", true);
    }


    function startTrainingSession() {
      toggleScreen("instructions-training-session-en", false);
      toggleScreen("training-session", true);
      if (!document.pointerLockElement) {
        canvasTraining.focus();
        canvasTraining.requestPointerLock({
          unadjustedMovement: false,
        });
      }
      newTraining();
    }

    $trainingSessionExperiment.addEventListener("click", (e) => {
      startTrainingSession()
    })


    // LOGIC FOR FINISHING THE TRAINING SESSION
    socket.on("endTraining", (finish) => {
      console.log(`The value of finish is: ${finish}`);
      if (finish) {
        gameStartedTraining = false;
        console.log("The training is finished");
        timerBetweenRoundsTraining.innerHTML = "X";
        timerRoundsTraining.innerHTML = "X";
        rolePlayerTraining.innerHTML = "X";
        instructionPlayerTraining = "...";
        startTrainingDebrief()
      } else {
        let seconds = 10;
        roundNumber++;
        console.log(`The round is: ${roundNumber}`)
        timerBetweenRoundsTraining.innerHTML = seconds;
        if (restIntervalId !== undefined) {
          clearInterval(restIntervalId);
        }
        restIntervalId = setInterval(() => {
          seconds--;
          if (seconds < 0) {
            clearInterval(restIntervalId);
            restIntervalId = undefined;
            playingTraining = true;
            socket.emit("rest_end_training");
          } else {
            timerBetweenRoundsTraining.innerHTML = seconds;
          }
        }, 1000);
      }
    });


    // Creation of a new training session
    function newTraining() {
      prevX = 200;
      prevY = 200;
      urlParams = new URLSearchParams(window.location.search);
      room = urlParams.get("room");
      socket.emit("start-training", room);
      socket.on("beginGameTraining", (roundBeginningTraining) => {
        console.log(`The round is beginning: ${roundBeginningTraining}`);
        if (!roundBeginningTraining) {
          // console.log("The experiment will begin")
          timerRoundsTraining.innerHTML = "X";
          playingTraining = false;
        } else if (roundBeginningTraining) {
          console.log("playing", playingTraining);
          gameStartedTraining = true;
          let timeRoundGameTraining = 21;

          

          timerRoundsTraining.innerHTML = timeRoundGameTraining;
          gameIntervalId = setInterval(() => {
            timeRoundGameTraining--;
            timerRoundsTraining.innerHTML = timeRoundGameTraining;
            if (timeRoundGameTraining <= 0) {
              console.log("Time", timeRoundGameTraining);
              console.log("Id", gameIntervalId);
              clearInterval(gameIntervalId);
              clearInterval(randomBehaviorIntervalId);
              clearInterval(randomMirroringIntervalId);
              clearInterval(randomJitterIntervalId);
              gameIntervalId = undefined;
              randomBehaviorIntervalId = undefined;
              randomMirroringIntervalId = undefined;
              randomJitterIntervalId = undefined;
              playingTraining = false;
              gameStartedTraining = false;
              socket.emit("round_end_training");
            }
          }, 1000);
        }
        trainingGame();
      });
    }

    // TRAINING GAME CREATION

    function trainingGame() {
      // console.log(`The training is: ${playingTraining}`);
      // let mouseSpeedX = [];
      let mouseSpeedXMax = [];
      let mouseSpeedYMax = [];
      
      let random = Math.random();

      let numberArrayVariations = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

      let variations = randomSelectionVariations(numberArrayVariations, 16)

      console.log(variations)
      

      let mouseMoveX = 0;
      let mouseMoveY = 0;

      let prevMoveAgentX = 0;
      let prevMoveAgentY = 0;

      // Time for the frames
      // let currentTime = performance.now();
      

      // Parameters for Experiment Conditions
      // Player Controls
      // game.player.maxSpeed = 20;
      // Agent Controls
      // game.agent.maxSpeed = 20;

      
      let targetX = canvasTraining.width / 2 + 50;
      let targetY = canvasTraining.height / 2 + 50;


      ctxTraining.fillStyle = "black";
      ctxTraining.lineWidth = 3;
      ctxTraining.strokeStyle = "black";

      


      document.addEventListener("pointerlockchange", lockChangeAlert, false);
      function lockChangeAlert() {
        if (document.pointerLockElement === canvasTraining) {
          console.log("The pointer lock status is now locked");
        } else {
          console.log("The player is outside the canvas");
        }
      }

      canvasTraining.addEventListener('mousemove', (e) => {
       mouseMoveX = e.movementX;
       mouseMoveY = e.movementY;
   })

      if (playingTraining) {


        // What happens when the human disconnects.
        socket.on("disconnected", function (socketId) { });

        // let average = (array) => array.reduce((a, b) => a + b) / array.length;
        


        const gameTraining = new Game(canvasTraining, socket, room);
        if (roundNumber === 1) {
          gameTraining.agent.role = 0;
          gameTraining.agent.follower = true;
          gameTraining.agent.competence = true;
          gameTraining.agent.predictability = true;
        } else if (roundNumber === 2) {
          gameTraining.agent.role = 0;
          gameTraining.agent.follower = true;
          gameTraining.agent.competence = true;
          gameTraining.agent.predictability = false;
        } else if (roundNumber === 3) {
          gameTraining.agent.role = 0;
          gameTraining.agent.follower = true;
          gameTraining.agent.competence = true;
          gameTraining.agent.predictability = false;
        } else if (roundNumber === 4) {
          gameTraining.agent.role = 0;
          gameTraining.agent.follower = true;
          gameTraining.agent.competence = false;
          gameTraining.agent.predictability = false;
        } else if (roundNumber == 5) {
          gameTraining.agent.role = 2;
          gameTraining.agent.follower = true;
          gameTraining.agent.competence = true;
          gameTraining.agent.predictability = false;
        }

        // console.log(rolePlayerTraining)
        // console.log(gameTraining);
        if (gameTraining.agent.role === 0) {
          rolePlayerTraining.innerHTML= "leader";
          instructionPlayerTraining.innerHTML = "Create novel and interesting moves and have fun. The agent will follow you."
        } else if (gameTraining.agent.role === 1){
          rolePlayerTraining.innerHTML = "follower";
          instructionPlayerTraining.innerHTML = "Complement the movements of the agent and have fun."
        } else if (gameTraining.agent.role === 2) {
          rolePlayerTraining.innerHTML = "Joint Improvisation"
          instructionPlayerTraining.innerHTML = "Develop creative movements while synchronizing with the agent!"
        }

        // TODO: Add random jitter at certain points?


        // console.log(`The initial time is: ${randomBehaviorTime} and the role of the agent is: ${gameTraining.agent.follower}`)

        if (gameTraining.agent.role === 2) {
          randomBehaviorIntervalId = setInterval(() => {
            randomBehaviorTime = randIntervalFromIntervalInteger( 5, 10) * 1000;
            if (gameTraining.agent.follower) {
              gameTraining.agent.follower = false;
            } else if (!gameTraining.agent.follower) {
              gameTraining.agent.follower = true;
            }
            console.log(`The time for the interval was: ${randomBehaviorTime} and the agent is the follower: ${gameTraining.agent.follower}`)
          }, randomBehaviorTime);
        }


        // if (gameTraining.agent.follower) {
        //   randomMirroringIntervalId = setInterval(() => {
        //     randomMirroringTime = 5000;
        //     if (gameTraining.agent.followerBehaviorType < 2) {
        //       gameTraining.agent.trajectoryMovementSamplePlayer = []
        //       gameTraining.agent.followerBehaviorType ++;
        //     } else if (gameTraining.agent.followerBehaviorType === 2) {
        //       gameTraining.agent.followerBehaviorType = 0;
        //     }

        //     console.log(`Entered to the function with follower type: ${gameTraining.agent.followerBehaviorType}`)

        //   }, randomMirroringTime)
        // }

        if (gameTraining.agent.competence) {
          
          
        } else if (!gameTraining.agent.competence) {
          
        }


        if (gameTraining.mouse.x !== undefined && gameTraining.mouse.y !== undefined) {
          prevMoveX = gameTraining.mouse.x;
          prevMoveY = gameTraining.mouse.y;
        }
        
        // console.log(`The values for the movements are in X: ${mouseMoveX} and Y: ${mouseMoveY}`)
        gameTraining.render(ctxTraining, random, targetX, targetY, mouseMoveX, mouseMoveY);
        let animationId = undefined;

        function animate() {

          // console.log(`The movements are: ${mouseMoveX} and ${mouseMoveY}`)
          ctxTraining.clearRect(0, 0, canvasTraining.width, canvasTraining.height);
          const newTime = performance.now();
          const frameRate = 60;
          // const dt = (newTime - currentTime) / 1000; // Convert to seconds
          // const dt = 1 / frameRate;
          // console.log(`The difference in time ${typeof dt}`)
          // console.log(`The time is ${dt}`)
          // currentTime = newTime;
          gameTraining.render(ctxTraining, random, targetX, targetY, mouseMoveX, mouseMoveY);
          if (playingTraining) {
            animationId = requestAnimationFrame(animate);
            


            rotationAgent = gameTraining.agent.rotation;
            differenceRotationAgent = gameTraining.agent.differenceRotation;

            // rotationAgent =
            //   (Math.atan2(
            //     gameTraining.agent.collisionY - prevMoveAgentY,
            //     gameTraining.agent.collisionX - prevMoveAgentX
            //   ) *
            //     180.0) /
            //   Math.PI;
              // console.log(`The rotation of the agent is: ${rotationAgent}`)
            
            rotation = gameTraining.player.rotation;
            differenceRotation = gameTraining.player.differenceRotation; 

              // rotation =
            //   (Math.atan2(gameTraining.mouse.y - prevMoveY, gameTraining.mouse.x, prevMouseX) *
            //     180.0) /
            //   Math.PI;
            mouseSpeedXMax.push(Math.abs(gameTraining.mouse.x - prevMoveX));
            mouseSpeedYMax.push(Math.abs(gameTraining.mouse.y - prevMoveY));


            socket.emit(
              "locationAgent",
              room,
              gameTraining.agent.collisionX,
              gameTraining.agent.collisionY,
              rotationAgent,
              differenceRotationAgent,
              // gameTraining.agent.speedX,
              // gameTraining.agent.speedY,
              // gameTraining.agent.prevAccX,
              // gameTraining.agent.prevAccY,
              // jerkXAgent,
              // jerkYAgent
            );
            socket.emit(
              "locationPlayer",
              room,
              gameTraining.player.collisionX,
              gameTraining.player.collisionY,
              gameTraining.player.rawMouseMoveX,
              gameTraining.player.rawMouseMoveY,
              rotation,
              differenceRotation,
              gameTraining.player.forcePlayerX,
              gameTraining.player.forcePlayerY,
              // speeds[speeds.length - 1],
              // speeds2[speeds2.length - 1],
              // accelXPlayer[accelXPlayer.length - 1],
              // accelYPlayer[accelYPlayer.length - 1],
              // jerkXPlayer,
              // jerkYPlayer
            );


            prevMoveX = gameTraining.mouse.x;
            prevMoveY = gameTraining.mouse.y;

            prevMoveAgentX = gameTraining.agent.collisionX;
            prevMoveAgentY = gameTraining.agent.collisionY;
            // prevAccelerationX = gameTraining.agent.accX;
            // prevAccelerationY = gameTraining.agent.accY;
          } else {
            cancelAnimationFrame(animationId);
          }
        }
        if (gameStartedTraining) {
          console.log('THE TRAINING IS ANIMATING')
          animate();
        }

        // MOUSE MOVEMENTS
        canvasTraining.addEventListener("mousemove", function (event) {
          // let mouseX = event.pageX - canvasTraining.offsetLeft;
          // let mouseY = event.pageY - canvasTraining.offsetTop;
          let mouseX = gameTraining.player.collisionX;
          let mouseY = gameTraining.player.collisionY;
          // document.getElementById("objectCoords-HAT").innerHTML =
          //   "Object Coordinates: " + mouseX + ", " + mouseY;
          // xpos = mouseX;
          // ypos = mouseY;
          prevX = gameTraining.player.prevMouseX;
          prevY = gameTraining.player.prevMouseY;


          let rot = (Math.atan2(mouseY - prevY, mouseX - prevX) * 180.0) / Math.PI;
          let dist = Math.sqrt(
            Math.pow(mouseY - prevY, 2) + Math.pow(mouseX - prevX, 2)
          );
          var smooth = Math.min(1, dist / 50);
          rotation = smooth * rot + (1 - smooth) * rotation;
          // rotationPlayer = rot;
          // socket.emit('location', room, mouseX, mouseY, rotation);
          // console.log(`The previous position in X is: ${prevX} and Y: ${prevY}`)
          // console.log(rotationPlayer);

          return {
            x: mouseX,
            y: mouseY,
          };
        });
      } else {
        // clearInterval(positionPlayerIntervalId);
        //    positionPlayerIntervalId = undefined;
      }
    }
  }


}

