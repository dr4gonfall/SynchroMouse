class ValidationScript {
  validationScript(socket, roundNumber) {
    let room;
    // VERSION OF THE GAME VARIABLES
    // let version;
    // MAIN VARIABLES FOR GAME MODES
    // let perfect = false;
    // let comp = false;
    // let pred = false;
    // let versionPredictability;
    // let qualityCompetence;
    // let qualityPredictability;
    
    // ORDER FOR THE EXPERIMENT

    // let numberArrayVariations = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

    let numberArrayVariations = [1, 2, 3, 4, 5, 6, 7, 8]

    let variations = randomSelectionVariations(numberArrayVariations, 8)


    let currentGameProfile = variations[roundNumber]

    console.log(variations)


    // VALIDATION EXPERIMENT SEQUENCE
    // const $mainVExperiment = document.querySelector("#v-experiment-begin");
    // const $validationExperimentInstructions = document.querySelector("#validation-instructions-button");
    // const $trainingSessionExperiment = document.querySelector("#button-training-instructions-en")
    // const $trainingSessionEnd = document.querySelector("#button-training-session");
    const $validationExperimentPage = document.querySelector("#button-begin-validation-experiment")
    const $validationExperimentBegin = document.querySelector("#startValidationExperiment")

    const $validationExperimentNextRound = document.querySelector("#continueValidationExperiment");


    // CANVAS VALIDATION EXPERIMENT SELECTION

    // Canvas Validation Experiment Definition
    const canvasValidation = document.getElementById("canvas-validation-game");
    const ctxValidation = canvasValidation.getContext("2d");
    // Canvas Validation Experiment Dimensions
    canvasValidation.width = 800;
    canvasValidation.height = 500;


    // Timers Definition

    // Training number of rounds
    // Validation Experiment Timers Definition
    let timerBetweenRoundsValidation = document.getElementById("time-validation-prelim");
    let timerRoundsValidation = document.getElementById("time-validation-round")

    // Role of the player

    let rolePlayerValidation = document.getElementById("rolePlayerValidation");
    let instructionPlayerValidation = document.getElementById("instructionsPlayerValidation");


    // BUTTONS AND FORMS


    // let roomName;

    let prevX;
    let prevY;
    let rotation = 0;

    // let agentIdealPrevX;
    // let agentIdealPrevY;

    // let agentWavesPrevX;
    // let agentWavesPrevY;
    let rotationAgent = 0;

    let urlParams;
    // let admin = false;

    // let countStop = 0;

    // let distance;
    // let distanceArray = [];
    // let anglePlayerSource;
    // let angleAgentSource;

    let restIntervalId = undefined;
    let gameIntervalId = undefined;
    let randomBehaviorTime = randIntervalFromIntervalInteger(5, 10) * 1000;
    let randomMirroringTime = 5000;
    let randomJitterTime = randIntervalFromIntervalInteger(1, 2) * 1000;

    let randomBehaviorIntervalId = undefined;
    let randomMirroringIntervalId = undefined;
    let randomJitterIntervalId = undefined;

    // // SOURCES OF NOISE
    // let perlinNoise = false;

    // // COMPETENCE VARIABLES
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

    let jerkXPlayer = 0;
    let jerkYPlayer = 0;
    let jerkXAgent = 0;
    let jerkYAgent = 0;

    let jerksXPlayer = [];
    let jerksYPlayer = [];
    let jerksXAgent = [];
    let jerksYAgent = [];

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

    let curvaturePlayer;

    let curvatureAgent;

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
    let prevMouseX;
    // let prevMouseY;
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
    let accelXAgent = [];
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


    // VALIDATION EXPERIMENT SESSION

    function startValidationExperiment() {
      toggleScreen("training-session-debrief", false);
      toggleScreen("validation-experiment", true);
      if (!document.pointerLockElement) {
        canvasValidation.focus();
        canvasValidation.requestPointerLock({
          unadjustedMovement: false,
        });
      }
      // $trainingSessionEnd.disabled = true;
      newValidation();
    }

    function endOfExperiment() {

    }

    // VALIDATION EXPERIMENT SEQUENCE

    // Go from the training debrief to the validation experiment.
    $validationExperimentPage.addEventListener("click", (e) => {
      console.log(`Is clicked the beginning of the game`)
      startValidationExperiment();
    })
    // $validationExperimentBegin.addEventListener("click", (e) => {
    //   if (!document.pointerLockElement) {
    //     canvasValidation.focus();
    //     canvasValidation.requestPointerLock({
    //       unadjustedMovement: false,
    //     });
    //   }
    //   $validationExperimentBegin.disabled = true
    //   console.log(`The button is deactivated ${$validationExperimentBegin.disabled}`)
    //   finishGame = false;
    //   newValidation();
    // })

    // $validationExperimentNextRound.addEventListener("click", (e) => {
    //   if (!document.pointerLockElement) {
    //     canvasValidation.focus();
    //     canvasValidation.requestPointerLock({
    //       unadjustedMovement: false,
    //     });
    //   }

    // })


    // GAME EXPERIMENT



    // let compMeasurement = 0;
    let gameStartedValidation = false;
    let finishGame = false;

    let playingValidation = false;

    // let currentRoundV = 0;


    // LOGIC FOR FINISHING THE VALIDATION SESSION
    socket.on("endValidation", (finish) => {
      console.log(`The value of finish is: ${finish}`);
      if (finish) {
        gameStartedValidation = false;
        console.log("The experiment is finished");
        timerBetweenRoundsValidation.innerHTML = "X";
        timerRoundsValidation.innerHTML = "X";
        rolePlayerValidation.innerHTML = "X";
        instructionPlayerValidation.innerHTML = "...";
        finishGame = true;
        // $validationExperimentBegin.disabled = false;
        variations = [];
        // socket.off("endValidation")
      } else {
        let seconds = 10;
        roundNumber++;
        console.log(`The round of the experiment: ${roundNumber}`)
        timerBetweenRoundsValidation.innerHTML = seconds;
        if (restIntervalId !== undefined) {
          clearInterval(restIntervalId);
        }
        restIntervalId = setInterval(() => {
          seconds--;
          if (seconds < 0) {
            clearInterval(restIntervalId);
            restIntervalId = undefined;
            playingValidation = true;
            socket.emit("rest_end_validation");
          } else {
            timerBetweenRoundsValidation.innerHTML = seconds;
          }
        }, 1000);
      }
    });

    // socket.on("beginGameValidation", (roundBeginningValidation) => {
    //   console.log(`The round is beginning: ${roundBeginningValidation}`);
    //   if (!roundBeginningValidation) {
    //     // console.log("The experiment will begin")
    //     timerRoundsValidation.innerHTML = "X";
    //     playingValidation = false;
    //   } else if (roundBeginningValidation) {
    //     // console.log("playing", playingValidation);
    //     gameStartedValidation = true;
    //     let timeRoundGameValidation = 31;
    //     timerRoundsValidation.innerHTML = timeRoundGameValidation;
    //     gameIntervalId = setInterval(() => {
    //       timeRoundGameValidation--;
    //       timerRoundsValidation.innerHTML = timeRoundGameValidation;
    //       console.log(`The time for the validation is: ${timeRoundGameValidation}`)
    //       if (timeRoundGameValidation <= 0) {
    //         console.log("Time", timeRoundGameValidation);
    //         console.log("Id", gameIntervalId);
    //         clearInterval(gameIntervalId);
    //         // timeRoundGameValidation = 31;
    //         gameIntervalId = undefined;
    //         playingValidation = false;
    //         gameStartedValidation = false;
    //         socket.emit("round_end_validation");
    //       }
    //     }, 1000);
    //   }
    //   if (finishGame) {
    //     return;
    //   } else {
    //     console.log(`The game is PLAYING IN ROUND: ${roundNumber}`)
    //     validationGame();
    //   }

    // });

    function newValidation() {
      prevX = 200;
      prevY = 200;
      urlParams = new URLSearchParams(window.location.search);
      room = urlParams.get("room");
      socket.emit("start-validation", room);
      socket.on("beginGameValidation", (roundBeginningValidation) => {
        console.log(`The round is beginning: ${roundBeginningValidation}`);
        if (!roundBeginningValidation) {
          // console.log("The experiment will begin")
          timerRoundsValidation.innerHTML = "X";
          playingValidation = false;
        } else if (roundBeginningValidation) {
          // console.log("playing", playingValidation);
          gameStartedValidation = true;
          let timeRoundGameValidation = 61;



          timerRoundsValidation.innerHTML = timeRoundGameValidation;
          gameIntervalId = setInterval(() => {
            timeRoundGameValidation--;
            timerRoundsValidation.innerHTML = timeRoundGameValidation;
            // console.log(`The time for the validation is: ${timeRoundGameValidation}`)
            if (timeRoundGameValidation <= 0) {
              console.log("Time", timeRoundGameValidation);
              console.log("Id", gameIntervalId);
              clearInterval(gameIntervalId);
              clearInterval(randomBehaviorIntervalId)
              clearInterval(randomMirroringIntervalId)
              clearInterval(randomJitterIntervalId)
              // timeRoundGameValidation = 31;
              gameIntervalId = undefined;
              randomBehaviorIntervalId = undefined;
              randomMirroringIntervalId = undefined;
              randomJitterIntervalId = undefined;
              playingValidation = false;
              gameStartedValidation = false;
              socket.emit("round_end_validation");
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

      let targetX = canvasValidation.width / 2 + 50;
      let targetY = canvasValidation.height / 2 + 50;


      ctxValidation.fillStyle = "black";
      ctxValidation.lineWidth = 3;
      ctxValidation.strokeStyle = "black";


      document.addEventListener("pointerlockchange", lockChangeAlert, false);
      function lockChangeAlert() {
        if (document.pointerLockElement === canvasValidation) {
          console.log("The pointer lock status is now locked");
        } else {
          console.log("The player is outside the canvas");
        }
      }

      canvasValidation.addEventListener('mousemove', (e) => {
        mouseMoveX = e.movementX;
        mouseMoveY = e.movementY;
      })


      if (playingValidation) {
        // What happens when the human disconnects.
        socket.on("disconnected", function (socketId) {

        });

        // playerPositions["X"].push(200);
        // let counterTest = 0;

        // let average = (array) => array.reduce((a, b) => a + b) / array.length;
        // let activateWaves = true


        const gameValidation = new Game(canvasValidation, socket, room);

        console.log(`The current round is: ${roundNumber}`)
        // const setGameConfig = (follower, competence, predictability) => {
        //   gameValidation.agent.follower = follower;
        //   gameValidation.agent.competence = competence;
        //   gameValidation.agent.predictability = predictability;
        // }

        // const configObject = [{ run: () => setGameConfig(false, true, false) },
        // { run: () => setGameConfig(false, false, false) },
        // { run: () => setGameConfig(true, false, true) },
        // { run: () => setGameConfig(false, true, true) },
        // { run: () => setGameConfig(false, false, true) },
        // { run: () => setGameConfig(true, true, false) },
        // { run: () => setGameConfig(true, true, true) },
        // { run: () => setGameConfig(true, false, false) }]

        // if (roundNumber === 1) {
        // configObject[(roundNumber - 1) % configObject.length].run()
        // }

        if (currentGameProfile === 1) {
          gameValidation.agent.role = 2;
          gameValidation.agent.follower = true;
          gameValidation.player.maxSpeed = 10;
          gameValidation.agent.maxSpeed = 8;
          gameValidation.agent.competence = true;
          gameValidation.agent.predictability = true;
        } else if (currentGameProfile === 2) {
          gameValidation.agent.role = 2;
          gameValidation.agent.follower = true;
          gameValidation.player.maxSpeed = 10;
          gameValidation.agent.maxSpeed = 8;
          gameValidation.agent.competence = false;
          gameValidation.agent.predictability = true;
        } else if (currentGameProfile === 3) {
          gameValidation.agent.role = 2;
          gameValidation.agent.follower = true;
          gameValidation.player.maxSpeed = 10;
          gameValidation.agent.maxSpeed = 8;
          gameValidation.agent.competence = true;
          gameValidation.agent.predictability = false;
        } else if (currentGameProfile === 4) {
          gameValidation.agent.role = 2;
          gameValidation.agent.follower = true;
          gameValidation.player.maxSpeed = 10;
          gameValidation.agent.maxSpeed = 8;
          gameValidation.agent.competence = false;
          gameValidation.agent.predictability = false;
        } else if (currentGameProfile === 5) {
          gameValidation.agent.role = 2;
          gameValidation.agent.follower = true;
          gameValidation.player.maxSpeed = 5;
          gameValidation.agent.maxSpeed = 3;
          gameValidation.agent.competence = true;
          gameValidation.agent.predictability = true;
        } else if (currentGameProfile === 6) {
          gameValidation.agent.role = 2;
          gameValidation.agent.follower = true;
          gameValidation.player.maxSpeed = 5;
          gameValidation.agent.maxSpeed = 3;
          gameValidation.agent.competence = false;
          gameValidation.agent.predictability = true;
        } else if (currentGameProfile === 7) {
          gameValidation.agent.role = 2;
          gameValidation.agent.follower = true;
          gameValidation.player.maxSpeed = 5;
          gameValidation.agent.maxSpeed = 3;
          gameValidation.agent.competence = true;
          gameValidation.agent.predictability = false;
        } else if (currentGameProfile === 8) {
          gameValidation.agent.role = 2;
          gameValidation.agent.follower = true;
          gameValidation.player.maxSpeed = 5;
          gameValidation.agent.maxSpeed = 3;
          gameValidation.agent.competence = false;
          gameValidation.agent.predictability = false;
        } 
        
        
        // else if (currentGameProfile === 9) {
        //   gameValidation.agent.role = true;
        //   gameValidation.agent.follower = true;
        //   gameValidation.agent.competence = true;
        //   gameValidation.agent.predictability = true;
        // } else if (currentGameProfile === 10) {
        //   gameValidation.agent.role = true;
        //   gameValidation.agent.follower = true;
        //   gameValidation.agent.competence = true;
        //   gameValidation.agent.predictability = true;
        // } else if (currentGameProfile === 11) {
        //   gameValidation.agent.role = true;
        //   gameValidation.agent.follower = true;
        //   gameValidation.agent.competence = true;
        //   gameValidation.agent.predictability = true;
        // } else if (currentGameProfile === 12) {
        //   gameValidation.agent.role = true;
        //   gameValidation.agent.follower = true;
        //   gameValidation.agent.competence = true;
        //   gameValidation.agent.predictability = true;
        // } else if (currentGameProfile === 13) {
        //   gameValidation.agent.role = true;
        //   gameValidation.agent.follower = true;
        //   gameValidation.agent.competence = true;
        //   gameValidation.agent.predictability = true;
        // } else if (currentGameProfile === 14) {
        //   gameValidation.agent.role = true;
        //   gameValidation.agent.follower = true;
        //   gameValidation.agent.competence = true;
        //   gameValidation.agent.predictability = true;
        // } else if (currentGameProfile === 15) {
        //   gameValidation.agent.role = true;
        //   gameValidation.agent.follower = true;
        //   gameValidation.agent.competence = true;
        //   gameValidation.agent.predictability = true;
        // } else if (currentGameProfile === 16) {
        //   gameValidation.agent.role = 0;
        //   gameValidation.agent.follower = true;
        //   gameValidation.agent.competence = true;
        //   gameValidation.agent.predictability = true;
        // }


        if (gameValidation.agent.role === 0) {
          rolePlayerValidation.innerHTML = "leader";
          instructionPlayerValidation.innerHTML = "Create novel and interesting moves and have fun. The agent will follow you."
        } else if(gameValidation.agent.role === 1) {
          rolePlayerValidation.innerHTML = "follower";
          instructionPlayerValidation.innerHTML = "Complement the movements of the agent and have fun."
        } else if (gameValidation.agent.role === 2) {
          rolePlayerValidation.innerHTML = "Joint Improvisation";
          instructionPlayerValidation.innerHTML = "Develop creative movements while synchronizing with the agent!"
        }

        if (gameValidation.agent.role === 2) {
          randomBehaviorIntervalId = setInterval(() => {
            randomBehaviorTime = randIntervalFromIntervalInteger( 5, 10) * 1000;
            if (gameValidation.agent.follower) {
              gameValidation.agent.follower = false;
            } else if (!gameValidation.agent.follower) {
              gameValidation.agent.follower = true;
            }
            console.log(`The time for the interval was: ${randomBehaviorTime} and the agent is the follower: ${gameValidation.agent.follower}`)
          }, randomBehaviorTime);
        }



        if (gameValidation.mouse.x !== undefined && gameValidation.mouse.y !== undefined) {
          prevMoveX = gameValidation.mouse.x;
          prevMoveY = gameValidation.mouse.y;
        }


        gameValidation.render(ctxValidation, random, targetX, targetY, mouseMoveX, mouseMoveY);
        let animationId = undefined;

        function animate() {
          //console.log(`The game is: ${playing}`);
          ctxValidation.clearRect(0, 0, canvasValidation.width, canvasValidation.height);
          // valueSlider.innerHTML = slider.value;
          // valSlider = parseInt(slider.value);
          // console.log(`The targets are: ${targetX}, ${targetY}`)
          // gameTraining.agent.target.x = targetX;
          // gameTraining.agent.target.y = targetY;
          gameValidation.render(ctxValidation, random, targetX, targetY, mouseMoveX, mouseMoveY);
          if (playingValidation) {
            animationId = requestAnimationFrame(animate);
            // speeds.push(gameValidation.player.speedX);
            // speeds2.push(gameValidation.player.speedY);
            // accelXAgent.push(gameValidation.agent.prevAccX);
            // accelYAgent.push(gameValidation.agent.prevAccY);

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

            // mouseSpeedX.push(gameValidation.mouse.x - prevMoveX);
            // mouseSpeedY.push(gameValidation.mouse.y - prevMoveY);

            rotationAgent =
              (Math.atan2(
                gameValidation.agent.collisionY - prevMoveAgentY,
                gameValidation.agent.collisionX - prevMoveAgentX
              ) *
                180.0) /
              Math.PI;
            rotation =
              (Math.atan2(gameValidation.mouse.y - prevMoveY, gameValidation.mouse.x, prevMouseX) *
                180.0) /
              Math.PI;
            mouseSpeedXMax.push(Math.abs(gameValidation.mouse.x - prevMoveX));
            mouseSpeedYMax.push(Math.abs(gameValidation.mouse.y - prevMoveY));


            // if (
            //   accelXPlayer[accelXPlayer.length - 1] !== undefined &&
            //   accelYPlayer[accelYPlayer.length - 1] !== undefined
            // ) {
            //   curvaturePlayer = calculateCurvature(
            //     gameValidation.player.speedX,
            //     gameValidation.player.speedY,
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

            // if (gameValidation.agent.accX !== undefined && gameValidation.agent.accY !== undefined) {
            //   curvatureAgent = calculateCurvature(
            //     gameValidation.agent.speedX,
            //     gameValidation.agent.speedY,
            //     gameValidation.agent.prevAccX,
            //     gameValidation.agent.prevAccY
            //   );
            //   curvaturesAgent.push(curvatureAgent);
            // }

            // if (
            //   !gameValidation.player.movementDecision &&
            //   gameValidation.player.prevMoveDec !== gameValidation.player.movementDecision
            // ) {
            //   socket.emit("calculateMeasuresPlayer", room);
            //   curvaturesPlayer = [];
            // }
            // if (
            //   !gameValidation.agent.movementDecision &&
            //   gameValidation.agent.prevMoveDec !== gameValidation.agent.movementDecision
            // ) {
            //   socket.emit("calculateMeasuresAgent", room);
            //   curvaturesAgent = [];
            // }

            socket.emit(
              "locationAgent",
              room,
              gameValidation.agent.collisionX,
              gameValidation.agent.collisionY,
              rotationAgent,
              // gameValidation.agent.speedX,
              // gameValidation.agent.speedY,
              // gameValidation.agent.prevAccX,
              // gameValidation.agent.prevAccY,
              // jerkXAgent,
              // jerkYAgent
            );
            socket.emit(
              "locationPlayer",
              room,
              gameValidation.player.collisionX,
              gameValidation.player.collisionY,
              gameValidation.player.rawMouseMoveX,
              gameValidation.player.rawMouseMoveY,
              rotation,
              gameValidation.player.forcePlayerX,
              gameValidation.player.forcePlayerY,
              // speeds[speeds.length - 1],
              // speeds2[speeds2.length - 1],
              // accelXPlayer[accelXPlayer.length - 1],
              // accelYPlayer[accelYPlayer.length - 1],
              // jerkXPlayer,
              // jerkYPlayer
            );


            prevMoveX = gameValidation.mouse.x;
            prevMoveY = gameValidation.mouse.y;

            prevMoveAgentX = gameValidation.agent.collisionX;
            prevMoveAgentY = gameValidation.agent.collisionY;
            // prevAccelerationX = gameValidation.agent.accX;
            // prevAccelerationY = gameValidation.agent.accY;
          } else {
            cancelAnimationFrame(animationId);
            // if (finishGame) {
            //   return;
            // }
          }
        }
        if (gameStartedValidation) {
          console.log('THE VALIDATION IS ANIMATING')
          animate();
        }

        // MOUSE MOVEMENTS
        canvasValidation.addEventListener("mousemove", function (event) {
          // let mouseX = event.pageX - canvasValidation.offsetLeft;
          // let mouseY = event.pageY - canvasValidation.offsetTop;
          let mouseX = gameValidation.player.collisionX;
          let mouseY = gameValidation.player.collisionY;
          // document.getElementById("objectCoords-HAT").innerHTML =
          //   "Object Coordinates: " + mouseX + ", " + mouseY;
          // xpos = mouseX;
          // ypos = mouseY;
          prevX = gameValidation.player.prevMouseX
          prevY = gameValidation.player.prevMoveY

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
