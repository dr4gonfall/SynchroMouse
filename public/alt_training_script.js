class TrainingGameAlt {
  
  trainingScriptAlt(socket) {

    let room;
   
    const $trainingSessionExperimentAlt = document.querySelector("#button-training-instructions-en-alt")
    const $stopTrainingSessionExperimentAlt = document.querySelector("#button-training-session-alt")

    // CANVAS VALIDATION EXPERIMENT SELECTION

    // Training Canvas Definition
    const canvasTrainingExperiment = document.getElementById("training-game-alt");
    const ctxTrainingExperiment = canvasTrainingExperiment.getContext("2d");
    // Training Canvas Dimensions
    canvasTrainingExperiment.width = 1000;
    canvasTrainingExperiment.height = 500;
    
    // canvasTrainingExperiment.width = 200;
    // canvasTrainingExperiment.height = 200;

    // Timers Definition

    // Training Session Timers Definition
    // let timerBetweenRoundsTraining = document.getElementById("time-training-prelim");
    // let timerRoundsTraining = document.getElementById("time-training-round");
    // Training number of rounds
    // let roundNumber = 0;

    // Role of the player

  // let rolePlayerTraining = document.getElementById("rolePlayer");
  // let instructionPlayerTraining = document.getElementById("instructionsPlayer");

   

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

    let randomBehaviorIntervalId = undefined;
    let randomMirroringIntervalId = undefined;
    let randomJitterIntervalId = undefined;
    let updateEndPointAgentId = undefined;
    let updatePlayerNotMoving = undefined;
    let progressBarTimeId = undefined;



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

    
    let gameStartedTraining = true;

    let playingTraining = true;


    function startTrainingDebriefAlt() {
      toggleScreen("training-session-alt", false);
      toggleScreen("training-session-debrief-alt", true);
    }


    function startTrainingSessionAlt() {
      toggleScreen("instructions-training-session-en-alt", false);
      toggleScreen("training-session-alt", true);
      if (!document.pointerLockElement) {
        canvasTrainingExperiment.focus();
        canvasTrainingExperiment.requestPointerLock({
          unadjustedMovement: false,
        });
      }
      newTrainingAlt();
    }

    $trainingSessionExperimentAlt.addEventListener("click", (e) => {
      startTrainingSessionAlt();
    })

    $stopTrainingSessionExperimentAlt.addEventListener("click", (e) => {
      startTrainingDebriefAlt();
      // clearInterval(id);
    })


    // LOGIC FOR FINISHING THE TRAINING SESSION
    // socket.on("endTraining", (finish) => {
    //   console.log(`The value of finish is: ${finish}`);
    //   if (finish) {
    //     gameStartedTraining = false;
    //     console.log("The training is finished");
    //     timerBetweenRoundsTraining.innerHTML = "X";
    //     timerRoundsTraining.innerHTML = "X";
    //     rolePlayerTraining.innerHTML = "X";
    //     instructionPlayerTraining = "...";
    //     startTrainingDebrief()
    //   } else {
    //     let seconds = 10;
    //     roundNumber++;
    //     console.log(`The round is: ${roundNumber}`)
    //     timerBetweenRoundsTraining.innerHTML = seconds;
    //     if (restIntervalId !== undefined) {
    //       clearInterval(restIntervalId);
    //     }
    //     restIntervalId = setInterval(() => {
    //       seconds--;
    //       if (seconds < 0) {
    //         clearInterval(restIntervalId);
    //         restIntervalId = undefined;
    //         playingTraining = true;
    //         socket.emit("rest_end_training");
    //       } else {
    //         timerBetweenRoundsTraining.innerHTML = seconds;
    //       }
    //     }, 1000);
    //   }
    // });

    
    function progressBarMove() {
      let i = 0;
      let counter =0;
      if (i === 0) {
        i = 1;
        let elem = document.getElementById("practiceBar");
        let width = 0;
        let id = setInterval(frame, 1000);
        function frame() {
          if (width >= 100) {
            clearInterval(id);
            i = 0;
            width = 0;
            counter = 0;
          } else {
            width += (5/3);
            counter ++;
            elem.style.width = width + "%";
          }
          // console.log(counter)
        }
      }
    }


    // Creation of a new training session
    function newTrainingAlt() {
      prevX = 200;
      prevY = 200;
      urlParams = new URLSearchParams(window.location.search);
      room = urlParams.get("room");
      
      trainingGameAlt()
      // socket.emit("start-training", room);
      // socket.on("beginGameTraining", (roundBeginningTraining) => {
      //   console.log(`The round is beginning: ${roundBeginningTraining}`);
      //   if (!roundBeginningTraining) {
      //     // console.log("The experiment will begin")
      //     timerRoundsTraining.innerHTML = "X";
      //     playingTraining = false;
      //   } else if (roundBeginningTraining) {
      //     console.log("playing", playingTraining);
      //     gameStartedTraining = true;
      //     let timeRoundGameTraining = 21;

          

      //     timerRoundsTraining.innerHTML = timeRoundGameTraining;
      //     gameIntervalId = setInterval(() => {
      //       timeRoundGameTraining--;
      //       timerRoundsTraining.innerHTML = timeRoundGameTraining;
      //       if (timeRoundGameTraining <= 0) {
      //         console.log("Time", timeRoundGameTraining);
      //         console.log("Id", gameIntervalId);
      //         clearInterval(gameIntervalId);
      //         clearInterval(randomBehaviorIntervalId);
      //         clearInterval(randomMirroringIntervalId);
      //         clearInterval(randomJitterIntervalId);
      //         clearInterval(updateEndPointAgentId);
      //         clearInterval(updatePlayerNotMoving)
      //         gameIntervalId = undefined;
      //         randomBehaviorIntervalId = undefined;
      //         randomMirroringIntervalId = undefined;
      //         randomJitterIntervalId = undefined;
      //         updateEndPointAgentId = undefined;
      //         updatePlayerNotMoving = undefined;
      //         playingTraining = false;
      //         gameStartedTraining = false;
      //         socket.emit("round_end_training");
      //       }
      //     }, 1000);
      //   }
      //   trainingGame();
      // });
    }

    // TRAINING GAME CREATION

    function trainingGameAlt() {
      // console.log(`The training is: ${playingTraining}`);
      // let mouseSpeedX = [];
      let mouseSpeedXMax = [];
      let mouseSpeedYMax = [];

      progressBarMove();
      
      let random = Math.random();

      // let numberArrayVariations = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

      // let variations = randomSelectionVariations(numberArrayVariations, 16)

      // console.log(variations)
      

      let mouseMoveX = 0;
      let mouseMoveY = 0;

      // let prevMoveAgentX = 0;
      // let prevMoveAgentY = 0;

      // Time for the frames
      // let currentTime = performance.now();
      

      // Parameters for Experiment Conditions
      // Player Controls
      // game.player.maxSpeed = 20;
      // Agent Controls
      // game.agent.maxSpeed = 20;
      

      
      let targetX = canvasTrainingExperiment.width / 2 + 50;
      let targetY = canvasTrainingExperiment.height / 2 + 50;


      ctxTrainingExperiment.fillStyle = "black";
      ctxTrainingExperiment.lineWidth = 3;
      ctxTrainingExperiment.strokeStyle = "black";

      


      document.addEventListener("pointerlockchange", lockChangeAlert, false);
      function lockChangeAlert() {
        if (document.pointerLockElement === canvasTrainingExperiment) {
          console.log("The pointer lock status is now locked");
        } else {
          console.log("The player is outside the canvas");
          playingTraining = false;
          gameStartedTraining = false;
        }
      }
      

      canvasTrainingExperiment.addEventListener('mousemove', (e) => {
       mouseMoveX = e.movementX;
       mouseMoveY = e.movementY;
   })

      if (playingTraining) {

        


        // What happens when the human disconnects.
        socket.on("disconnected", function (socketId) { });



        // let average = (array) => array.reduce((a, b) => a + b) / array.length;
        

        
        const gameTrainingAlt = new Tutorial(canvasTrainingExperiment);

        gameTrainingAlt.player.maxSpeed = 40;
        canvasTrainingExperiment.addEventListener('click', (e) => {
          // if (gameTrainingAlt.agent.tutorialCondition >= 0 && gameTrainingAlt.agent.tutorialCondition < 2) {
          //   gameTrainingAlt.agent.tutorialCondition ++;
          // } else {
          //   gameTrainingAlt.agent.tutorialCondition = 0;
          // }
        })


        
        // console.log(`The values for the movements are in X: ${mouseMoveX} and Y: ${mouseMoveY}`)
        gameTrainingAlt.render(ctxTrainingExperiment, random, targetX, targetY, mouseMoveX, mouseMoveY);
        let animationId = undefined;

        function animate() {

          // console.log(`The movements are: ${mouseMoveX} and ${mouseMoveY}`)
          ctxTrainingExperiment.clearRect(0, 0, canvasTrainingExperiment.width, canvasTrainingExperiment.height);
          const newTime = performance.now();
          const frameRate = 60;
          // const dt = (newTime - currentTime) / 1000; // Convert to seconds
          // const dt = 1 / frameRate;
          // console.log(`The difference in time ${typeof dt}`)
          // console.log(`The time is ${dt}`)
          // currentTime = newTime;
          gameTrainingAlt.render(ctxTrainingExperiment, random, targetX, targetY, mouseMoveX, mouseMoveY);
          if (playingTraining) {
            animationId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(animationId);
          }
        }
        if (gameStartedTraining) {
          console.log('THE TRAINING IS ANIMATING')
          animate();
        }

        // MOUSE MOVEMENTS
        canvasTrainingExperiment.addEventListener("mousemove", function (event) {
          // let mouseX = event.pageX - canvasTrainingExperiment.offsetLeft;
          // let mouseY = event.pageY - canvasTrainingExperiment.offsetTop;
          let mouseX = gameTrainingAlt.player.collisionX;
          let mouseY = gameTrainingAlt.player.collisionY;
          // document.getElementById("objectCoords-HAT").innerHTML =
          //   "Object Coordinates: " + mouseX + ", " + mouseY;
          // xpos = mouseX;
          // ypos = mouseY;
          prevX = gameTrainingAlt.player.prevMouseX;
          prevY = gameTrainingAlt.player.prevMouseY;


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

