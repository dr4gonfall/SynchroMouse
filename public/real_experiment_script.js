class ExperimentScript {
  experimentScript(socket, roundNumber) {
    let room;
   
    
    // ORDER FOR THE EXPERIMENT

    let numberArrayVariations = [1, 2, 3, 4, 5, 6, 7, 8]

    let variations = randomSelectionVariations(numberArrayVariations, 8)


    let currentGameProfile = variations[roundNumber]

    console.log(variations)


    // VALIDATION EXPERIMENT SEQUENCE
    
    const $realExperimentPage = document.querySelector("#button-begin-real-experiment")


    // CANVAS VALIDATION EXPERIMENT SELECTION

    // Canvas RExperiment Experiment Definition
    const canvasRExperiment = document.getElementById("canvas-real-experiment");
    const ctxRExperiment = canvasRExperiment.getContext("2d");
    // Canvas RExperiment Experiment Dimensions
    canvasRExperiment.width = 800;
    canvasRExperiment.height = 500;


    // Timers Definition

    // Training number of rounds
    // RExperiment Experiment Timers Definition
    let timerBetweenRoundsRExperiment = document.getElementById("time-real-experiment-prelim");
    let timerRoundsRExperiment = document.getElementById("time-real-experiment-round")

    // Role of the player

    // let rolePlayerRExperiment = document.getElementById("rolePlayerRExperiment");
    // let instructionPlayerRExperiment = document.getElementById("instructionsPlayerRExperiment");


    // BUTTONS AND FORMS


    // let roomName;

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


    // VALIDATION EXPERIMENT SESSION

    function startRealExperiment() {
      toggleScreen("training-session-debrief-alt", false);
      toggleScreen("real-experiment", true);
      if (!document.pointerLockElement) {
        canvasRExperiment.focus();
        canvasRExperiment.requestPointerLock({
          unadjustedMovement: false,
        });
      }
      // $trainingSessionEnd.disabled = true;
      newRExperiment();
    }

    function endOfExperiment() {

    }

    // VALIDATION EXPERIMENT SEQUENCE

    // Go from the training debrief to the validation experiment.
    $realExperimentPage.addEventListener("click", (e) => {
      console.log(`Is clicked the beginning of the game`)
      startRealExperiment();
    })


    // GAME EXPERIMENT



    // let compMeasurement = 0;
    let gameStartedRExperiment = false;
    let finishGame = false;

    let playingRExperiment = false;

    // let currentRoundV = 0;


    // LOGIC FOR FINISHING THE VALIDATION SESSION
    socket.on("endRExperiment", (finish) => {
      console.log(`The value of finish is: ${finish}`);
      if (finish) {
        gameStartedRExperiment = false;
        console.log("The experiment is finished");
        timerBetweenRoundsRExperiment.innerHTML = "X";
        timerRoundsRExperiment.innerHTML = "X";
        // rolePlayerRExperiment.innerHTML = "X";
        // instructionPlayerRExperiment.innerHTML = "...";
        finishGame = true;
        // $validationExperimentBegin.disabled = false;
        variations = [];
        // socket.off("endRExperiment")
      } else {
        let seconds = 10;
        roundNumber++;
        console.log(`The round of the experiment: ${roundNumber}`)
        timerBetweenRoundsRExperiment.innerHTML = seconds;
        if (restIntervalId !== undefined) {
          clearInterval(restIntervalId);
        }
        restIntervalId = setInterval(() => {
          seconds--;
          if (seconds < 0) {
            clearInterval(restIntervalId);
            restIntervalId = undefined;
            playingRExperiment = true;
            socket.emit("rest_end_real_experiment");
          } else {
            timerBetweenRoundsRExperiment.innerHTML = seconds;
          }
        }, 1000);
      }
    });

    function newRExperiment() {
      prevX = 200;
      prevY = 200;
      urlParams = new URLSearchParams(window.location.search);
      room = urlParams.get("room");
      socket.emit("start-experiment", room);
      socket.on("beginGameRExperiment", (roundBeginningRExperiment) => {
        console.log(`The round is beginning: ${roundBeginningRExperiment}`);
        if (!roundBeginningRExperiment) {
          // console.log("The experiment will begin")
          timerRoundsRExperiment.innerHTML = "X";
          playingRExperiment = false;
        } else if (roundBeginningRExperiment) {
          // console.log("playing", playingRExperiment);
          gameStartedRExperiment = true;
          let timeRoundGameRExperiment = 61;



          timerRoundsRExperiment.innerHTML = timeRoundGameRExperiment;
          gameIntervalId = setInterval(() => {
            timeRoundGameRExperiment--;
            timerRoundsRExperiment.innerHTML = timeRoundGameRExperiment;
            // console.log(`The time for the validation is: ${timeRoundGameRExperiment}`)
            if (timeRoundGameRExperiment <= 0) {
              console.log("Time", timeRoundGameRExperiment);
              console.log("Id", gameIntervalId);
              clearInterval(gameIntervalId);
              clearInterval(randomBehaviorIntervalId)
              clearInterval(randomMirroringIntervalId)
              clearInterval(randomJitterIntervalId)
              // timeRoundGameRExperiment = 31;
              gameIntervalId = undefined;
              randomBehaviorIntervalId = undefined;
              randomMirroringIntervalId = undefined;
              randomJitterIntervalId = undefined;
              playingRExperiment = false;
              gameStartedRExperiment = false;
              socket.emit("round_end_real_experiment");
            }
          }, 1000);
        }
          validationGame();

      });
    }

    // VALIDATION GAME

    function validationGame() {
      // console.log(`The training is: ${playingTraining}`);
      let mouseSpeedX = [];
      let mouseSpeedXMax = [];
      let mouseSpeedYMax = [];
      let mouseSpeedY = [];
      let speeds = [];
      let speeds2 = [];
      // let rounds = 0;
      let prevMoveX = 0;
      let prevMoveY = 0;
      let prevMoveAgentX = 0;
      let prevMoveAgentY = 0;
      // let prevSpeedX = 0;
      // let prevSpeedY = 0;
      let currentRound = 0;
      let random = Math.random();

      // Parameters for Experiment Conditions
      // Player Controls
      // game.player.maxSpeed = 20;
      // Agent Controls
      // game.agent.maxSpeed = 20;
      
      let mouseMoveX = 0;
      let mouseMoveY = 0;

      let targetX = canvasRExperiment.width / 2 + 50;
      let targetY = canvasRExperiment.height / 2 + 50;


      ctxRExperiment.fillStyle = "black";
      ctxRExperiment.lineWidth = 3;
      ctxRExperiment.strokeStyle = "black";


      document.addEventListener("pointerlockchange", lockChangeAlert, false);
      function lockChangeAlert() {
        if (document.pointerLockElement === canvasRExperiment) {
          console.log("The pointer lock status is now locked");
        } else {
          console.log("The player is outside the canvas");
        }
      }

      canvasRExperiment.addEventListener('mousemove', (e) => {
        mouseMoveX = e.movementX;
        mouseMoveY = e.movementY;
      })


      if (playingRExperiment) {
        // What happens when the human disconnects.
        socket.on("disconnected", function (socketId) {

        });

        // playerPositions["X"].push(200);
        // let counterTest = 0;

        // let average = (array) => array.reduce((a, b) => a + b) / array.length;
        // let activateWaves = true


        const gameRExperiment = new Game(canvasRExperiment, socket, room);

        console.log(`The current round is: ${roundNumber}`)
        console.log(`The profile of the game: ${currentGameProfile}`)


        if (currentGameProfile === 1) {
          gameRExperiment.agent.role = 2;
          gameRExperiment.agent.follower = true;
          gameRExperiment.player.maxSpeed = 10;
          gameRExperiment.agent.maxSpeed = 8;
          gameRExperiment.agent.competence = true;
          gameRExperiment.agent.predictability = true;
        } else if (currentGameProfile === 2) {
          gameRExperiment.agent.role = 2;
          gameRExperiment.agent.follower = true;
          gameRExperiment.player.maxSpeed = 10;
          gameRExperiment.agent.maxSpeed = 8;
          gameRExperiment.agent.competence = false;
          gameRExperiment.agent.predictability = true;
        } else if (currentGameProfile === 3) {
          gameRExperiment.agent.role = 2;
          gameRExperiment.agent.follower = true;
          gameRExperiment.player.maxSpeed = 10;
          gameRExperiment.agent.maxSpeed = 8;
          gameRExperiment.agent.competence = true;
          gameRExperiment.agent.predictability = false;
        } else if (currentGameProfile === 4) {
          gameRExperiment.agent.role = 2;
          gameRExperiment.agent.follower = true;
          gameRExperiment.player.maxSpeed = 10;
          gameRExperiment.agent.maxSpeed = 8;
          gameRExperiment.agent.competence = false;
          gameRExperiment.agent.predictability = false;
        } else if (currentGameProfile === 5) {
          gameRExperiment.agent.role = 2;
          gameRExperiment.agent.follower = true;
          gameRExperiment.player.maxSpeed = 5;
          gameRExperiment.agent.maxSpeed = 3;
          gameRExperiment.agent.competence = true;
          gameRExperiment.agent.predictability = true;
        } else if (currentGameProfile === 6) {
          gameRExperiment.agent.role = 2;
          gameRExperiment.agent.follower = true;
          gameRExperiment.player.maxSpeed = 5;
          gameRExperiment.agent.maxSpeed = 3;
          gameRExperiment.agent.competence = false;
          gameRExperiment.agent.predictability = true;
        } else if (currentGameProfile === 7) {
          gameRExperiment.agent.role = 2;
          gameRExperiment.agent.follower = true;
          gameRExperiment.player.maxSpeed = 5;
          gameRExperiment.agent.maxSpeed = 3;
          gameRExperiment.agent.competence = true;
          gameRExperiment.agent.predictability = false;
        } else if (currentGameProfile === 8) {
          gameRExperiment.agent.role = 2;
          gameRExperiment.agent.follower = true;
          gameRExperiment.player.maxSpeed = 5;
          gameRExperiment.agent.maxSpeed = 3;
          gameRExperiment.agent.competence = false;
          gameRExperiment.agent.predictability = false;
        } 
        
        


        if (gameRExperiment.agent.role === 0) {
          // rolePlayerRExperiment.innerHTML = "leader";
          // instructionPlayerRExperiment.innerHTML = "Create novel and interesting moves and have fun. The agent will follow you."
        } else if(gameRExperiment.agent.role === 1) {
          // rolePlayerRExperiment.innerHTML = "follower";
          // instructionPlayerRExperiment.innerHTML = "Complement the movements of the agent and have fun."
        } else if (gameRExperiment.agent.role === 2) {
          // rolePlayerRExperiment.innerHTML = "Joint Improvisation";
          // instructionPlayerRExperiment.innerHTML = "Develop creative movements while synchronizing with the agent!"
        }

        if (gameRExperiment.agent.role === 2) {
          randomBehaviorIntervalId = setInterval(() => {
            randomBehaviorTime = randIntervalFromIntervalInteger( 5, 10) * 1000;
            if (gameRExperiment.agent.follower) {
              gameRExperiment.agent.follower = false;
              if (gameRExperiment.agent.pendingEndBezier.length === 0) {
                gameRExperiment.agent.addEndBezierLeader();
              }
              
            } else if (!gameRExperiment.agent.follower) {
              gameRExperiment.agent.follower = true;
              if (gameRExperiment.agent.pendingEndBezier.length === 0) {
                gameRExperiment.agent.addEndBezier();
              }
              
            }
            // console.log(`The time for the interval was: ${randomBehaviorTime} and the agent is the follower: ${gameRExperiment.agent.follower}`)
          }, 10000);
        }



        if (gameRExperiment.mouse.x !== undefined && gameRExperiment.mouse.y !== undefined) {
          prevMoveX = gameRExperiment.mouse.x;
          prevMoveY = gameRExperiment.mouse.y;
        }


        gameRExperiment.render(ctxRExperiment, random, targetX, targetY, mouseMoveX, mouseMoveY);
        let animationId = undefined;

        function animate() {
          ctxRExperiment.clearRect(0, 0, canvasRExperiment.width, canvasRExperiment.height);
          gameRExperiment.render(ctxRExperiment, random, targetX, targetY, mouseMoveX, mouseMoveY);
          if (playingRExperiment) {
            animationId = requestAnimationFrame(animate);
            
            rotationAgent = gameRExperiment.agent.rotation;
            differenceRotationAgent = gameRExperiment.agent.differenceRotation;

            rotation = gameRExperiment.player.rotation;
            differenceRotation = gameRExperiment.player.differenceRotation;

            socket.emit(
              "locationAgent",
              room,
              gameRExperiment.agent.collisionX,
              gameRExperiment.agent.collisionY,
              rotationAgent,
              differenceRotationAgent,
            );
            socket.emit(
              "locationPlayer",
              room,
              gameRExperiment.player.collisionX,
              gameRExperiment.player.collisionY,
              gameRExperiment.player.rawMouseMoveX,
              gameRExperiment.player.rawMouseMoveY,
              rotation,
              differenceRotation,
              gameRExperiment.player.forcePlayerX,
              gameRExperiment.player.forcePlayerY,

            );


            prevMoveX = gameRExperiment.mouse.x;
            prevMoveY = gameRExperiment.mouse.y;

            prevMoveAgentX = gameRExperiment.agent.collisionX;
            prevMoveAgentY = gameRExperiment.agent.collisionY;

          } else {
            cancelAnimationFrame(animationId);
          }
        }
        if (gameStartedRExperiment) {
          console.log('THE VALIDATION IS ANIMATING')
          animate();
        }

        // MOUSE MOVEMENTS
        canvasRExperiment.addEventListener("mousemove", function (event) {
         
          let mouseX = gameRExperiment.player.collisionX;
          let mouseY = gameRExperiment.player.collisionY;
          
          prevX = gameRExperiment.player.prevMouseX
          prevY = gameRExperiment.player.prevMoveY

          let rot = (Math.atan2(mouseY - prevY, mouseX - prevX) * 180.0) / Math.PI;
          let dist = Math.sqrt(
            Math.pow(mouseY - prevY, 2) + Math.pow(mouseX - prevX, 2)
          );
          var smooth = Math.min(1, dist / 50);
          rotation = smooth * rot + (1 - smooth) * rotation;
          // socket.emit('location', room, mouseX, mouseY, rotation);

          return {
            x: mouseX,
            y: mouseY,
          };
        });
      }
    }
  }
}
