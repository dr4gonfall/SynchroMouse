class TrainingGame {
  
  trainingScript(socket) {

    let room;
    // VERSION OF THE GAME VARIABLES
    let version;
    // MAIN VARIABLES FOR GAME MODES
    let perfect = false;
    let comp = false;
    let pred = false;
    let versionPredictability;
    let qualityCompetence;
    let qualityPredictability;


    // VALIDATION EXPERIMENT SEQUENCE
    const $mainVExperiment = document.querySelector("#v-experiment-begin");
    const $validationExperimentInstructions = document.querySelector("#validation-instructions-button");
    const $trainingSessionExperiment = document.querySelector("#button-training-instructions-en")
    const $trainingSessionEnd = document.querySelector("#button-training-session");
    const $validationExperimentPage = document.querySelector("#button-begin-validation-experiment")
    const $validationExperimentBegin = document.querySelector("#startValidationExperiment")


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
    let roundNumber = 0;

    // BUTTONS AND FORMS

    // Form that defines parameters for the demo.
    const $submitGameMode = document.querySelector("#form");
    const $startDemo = document.querySelector("#startNow");
    const $backButton = document.querySelector("#goBack");
    const $similarityM = document.querySelector("#similarityMeasure");
    const $distanceM = document.querySelector("#distanceMeasure");
    const $similarNoRotM = document.querySelector("#similarNoRotMeasure");

    let roomName;

    let prevX;
    let prevY;
    let rotation = 0;

    let agentIdealPrevX;
    let agentIdealPrevY;

    let agentWavesPrevX;
    let agentWavesPrevY;
    let rotationAgent = 0;

    let urlParams;
    let admin = false;

    let countStop = 0;

    let distance;
    let distanceArray = [];
    let anglePlayerSource;
    let angleAgentSource;

    let restIntervalId = undefined;
    let gameIntervalId = undefined;

    // SOURCES OF NOISE
    let perlinNoise = false;

    // COMPETENCE VARIABLES
    let meanCompetence;
    let stddevCompetence;
    let competenceValueList = [];
    let competenceAngle;
    let competenceVelocity;
    let competenceDistance;
    let distanceComp;
    let noiseXCompetence;
    let noiseYCompetence;
    let playerPosCompX;
    let playerPosCompY;
    let randomNumberInterval;
    let versionCompetence = 0;

    let jerkPlayer = 0;
    let jerkAgent = 0;

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
    let predictabilityActive;
    let meanPredictability = 0.0;
    let stddevPredictability = 100;
    let stddevPredRad = Math.PI;
    let noiseXPredictability;
    let noiseYPredictability;
    let distancePred;
    let randomNumberIntervalPredic;

    let playerPosPredX;
    let playerPosPredY;
    let randomNumPred;

    let curvaturePlayer;

    let curvatureAgent;

    let timer = 0;

    let inter = 0;
    let competenceActive = false;
    let randomPerlinNoise = false;
    let idealAngle;
    let idealVelocity;
    let rotationDifference;
    let rotationDifferenceAIdeal;
    let rotationDifferenceAWaves;

    let xpos;
    let ypos;

    let velocityPlayer;

    let testLogic = false;

    // BEGINNING OF THE NEW PROGRAM
    let timesProfile = 0;
    let roundBeginningGame = false;
    let mode = 0;
    let prevMouseX;
    let prevMouseY;
    let times = 0;
    let score = 0;
    let testSmooth;
    let interval;
    let sliderCompetence;
    let competencePlayer = [];
    let sliderPredictability;
    let entropy;
    let smoothness;
    let frameP;
    let accelXPlayer = [];
    let accelYPlayer = [];
    let accelXAgent = [];
    let accelYAgent = [];
    let prevAccelerationX = 0;
    let prevAccelerationY = 0;
    let jerkX = 0;
    let jerkY = 0;
    let accel = 0;
    let smoothP;
    let currentPath;
    let stats;
    let currentTarget;
    let targetCounter = 0;
    let txt;
    let prevMouseX1;
    let prevMouseY1;
    let curvaturesAgent = [];
    let curvaturesPlayer = [];
    // let anglePlayerSource
    // let angleAgentSource

    let agentCounterMove = 0;
    let playerCounterMove = 0;

    let agentAccel = [];
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

    // COUNTER FOR THE NUMBER OF ROUNDS
    let numberOfRounds = 0;

    // CANVAS DEFINITION FOR GAMES


    // GAME EXPERIMENT
    // BEGINNING OF THE OLD PROGRAM

    let speedSelection = document.querySelector("#spdOptions");
    let levelCompetence = document.querySelector("#competenceOptions");
    let levelPredictability = document.querySelector("#predictabilityOptions");
    let measureCompetenceType = document.querySelector("#measureCompetence");
    let measurePredictabilityType = document.querySelector("#measurePredictability");


    let compMeasurement = 0;
    let gameStartedTraining = false;
    let gameStartedValidation = false;

    let playingTraining = false;


    let currentRoundTraining = 0;


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
      $trainingSessionEnd.disabled = true;
      newTraining();
    }

    $trainingSessionExperiment.addEventListener("click", (e) => {
      startTrainingSession()
    })

    socket.on('health', () =>{
      console.log("hola")
    })

    // LOGIC FOR FINISHING THE TRAINING SESSION
    socket.on("endTraining", (finish) => {
      console.log(`The value of finish is: ${finish}`);
      if (finish) {
        gameStartedTraining = false;
        console.log("The experiment is finished");
        timerBetweenRoundsTraining.innerHTML = "X";
        timerRoundsTraining.innerHTML = "X";
        startTrainingDebrief()
      } else {
        let seconds = 10;
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
              gameIntervalId = undefined;
              playingTraining = false;
              gameStartedTraining = false;
              socket.emit("round_end_training");
              // socket.on("currentRound", (currentRound) => {
              //   currentRoundTraining = currentRound;
              // } )
              // console.log(`The current round is: ${currentRoundTraining}`)
              // DEFINE A VARIABLE TO KEEP TRACK OF THE NUMBER OF TIMES

            }
          }, 1000);
        }
        trainingGame();
      });
    }

    // TRAINING GAME CREATION

    function trainingGame() {
      // console.log(`The training is: ${playingTraining}`);
      let mouseSpeedX = [];
      let mouseSpeedXMax = [];
      let mouseSpeedYMax = [];
      let mouseSpeedY = [];
      let speeds = [];
      let speeds2 = [];
      let rounds = 0;
      let prevMoveX = 0;
      let prevMoveY = 0;
      let prevMoveAgentX = 0;
      let prevMoveAgentY = 0;
      let prevSpeedX = 0;
      let prevSpeedY = 0;
      let random = Math.random();

      // Parameters for Experiment Conditions
      // Player Controls
      // game.player.maxSpeed = 20;
      // Agent Controls
      // game.agent.maxSpeed = 20;
      ;
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

      if (playingTraining) {
        // What happens when the human disconnects.
        socket.on("disconnected", function (socketId) { });

        let average = (array) => array.reduce((a, b) => a + b) / array.length;


        const gameTraining = new Game(canvasTraining, socket, room);

        gameTraining.gameRound++

        if (gameTraining.mouse.x !== undefined && gameTraining.mouse.y !== undefined) {
          prevMoveX = gameTraining.mouse.x;
          prevMoveY = gameTraining.mouse.y;
        }

        let valSlider = 0;

        gameTraining.render(ctxTraining, random, targetX, targetY);
        let animationId = undefined;

        function animate() {
          ctxTraining.clearRect(0, 0, canvasTraining.width, canvasTraining.height);
          gameTraining.render(ctxTraining, random, targetX, targetY);
          if (playingTraining) {
            animationId = requestAnimationFrame(animate);
            speeds.push(gameTraining.player.speedX);
            speeds2.push(gameTraining.player.speedY);
            accelXAgent.push(gameTraining.agent.prevAccX);
            accelYAgent.push(gameTraining.agent.prevAccY);

            if (speeds.length >= 2) {
              accelXPlayer.push(
                speeds[speeds.length - 1] - speeds[speeds.length - 2]
              );
            }

            if (speeds2.length >= 2) {
              accelYPlayer.push(
                speeds2[speeds2.length - 1] - speeds2[speeds2.length - 2]
              );
            }

            if (accelXPlayer.length >= 2) {
              jerkXPlayer =
                accelXPlayer[accelXPlayer.length - 1] -
                accelXPlayer[accelXPlayer.length - 2];
              jerksXPlayer.push(
                accelXPlayer[accelXPlayer.length - 1] -
                accelXPlayer[accelXPlayer.length - 2]
              );
            }

            if (accelYPlayer.length >= 2) {
              jerkYPlayer =
                accelYPlayer[accelYPlayer.length - 1] -
                accelYPlayer[accelYPlayer.length - 2];
              jerksYPlayer.push(
                accelYPlayer[accelYPlayer.length - 1] -
                accelYPlayer[accelYPlayer.length - 2]
              );
            }

            if (accelXAgent.length >= 2) {
              jerkXAgent =
                accelXAgent[accelXAgent.length - 1] -
                accelXAgent[accelXAgent.length - 2];
              jerksXAgent.push(
                accelXAgent[accelXAgent.length - 1] -
                accelXAgent[accelXAgent.length - 2]
              );
            }

            if (accelYAgent.length >= 2) {
              jerkYAgent =
                accelYAgent[accelYAgent.length - 1] -
                accelYAgent[accelYAgent.length - 2];
              jerksYAgent.push(
                accelYAgent[accelYAgent.length - 1] -
                accelYAgent[accelYAgent.length - 2]
              );
            }

            mouseSpeedX.push(gameTraining.mouse.x - prevMoveX);
            mouseSpeedY.push(gameTraining.mouse.y - prevMoveY);

            rotationAgent =
              (Math.atan2(
                gameTraining.agent.collisionY - prevMoveAgentY,
                gameTraining.agent.collisionX - prevMoveAgentX
              ) *
                180.0) /
              Math.PI;
            rotation =
              (Math.atan2(gameTraining.mouse.y - prevMoveY, gameTraining.mouse.x, prevMouseX) *
                180.0) /
              Math.PI;
            mouseSpeedXMax.push(Math.abs(gameTraining.mouse.x - prevMoveX));
            mouseSpeedYMax.push(Math.abs(gameTraining.mouse.y - prevMoveY));


            if (
              accelXPlayer[accelXPlayer.length - 1] !== undefined &&
              accelYPlayer[accelYPlayer.length - 1] !== undefined
            ) {
              curvaturePlayer = calculateCurvature(
                gameTraining.player.speedX,
                gameTraining.player.speedY,
                accelXPlayer[accelXPlayer.length - 1],
                accelYPlayer[accelYPlayer.length - 1]
              );

              if (curvaturePlayer !== NaN && curvaturePlayer !== null) {
                curvaturesPlayer.push(curvaturePlayer);
                curvaturePlayer = 0;
              } else {
                console.log(`The function is working`);
              }
            }

            if (gameTraining.agent.accX !== undefined && gameTraining.agent.accY !== undefined) {
              curvatureAgent = calculateCurvature(
                gameTraining.agent.speedX,
                gameTraining.agent.speedY,
                gameTraining.agent.prevAccX,
                gameTraining.agent.prevAccY
              );
              curvaturesAgent.push(curvatureAgent);
            }
            console.log(!gameTraining.player.movementDecision &&
              gameTraining.player.prevMoveDec !== gameTraining.player.movementDecision, gameTraining.player.movementDecision, gameTraining.player.prevMoveDec, gameTraining.player.movementDecision)
            if (
              !gameTraining.player.movementDecision &&
              gameTraining.player.prevMoveDec !== gameTraining.player.movementDecision
            ) {
              socket.emit("calculateMeasuresPlayer", room);
              curvaturesPlayer = [];
            }
            if (
              !gameTraining.agent.movementDecision &&
              gameTraining.agent.prevMoveDec !== gameTraining.agent.movementDecision
            ) {
              socket.emit("calculateMeasuresAgent", room);
              curvaturesAgent = [];
            }

            socket.emit(
              "locationAgent",
              room,
              gameTraining.agent.collisionX,
              gameTraining.agent.collisionY,
              rotationAgent,
              gameTraining.agent.speedX,
              gameTraining.agent.speedY,
              gameTraining.agent.prevAccX,
              gameTraining.agent.prevAccY,
              jerkXAgent,
              jerkYAgent
            );
            socket.emit(
              "locationPlayer",
              room,
              gameTraining.player.collisionX,
              gameTraining.player.collisionY,
              rotation,
              speeds[speeds.length - 1],
              speeds2[speeds2.length - 1],
              accelXPlayer[accelXPlayer.length - 1],
              accelYPlayer[accelYPlayer.length - 1],
              jerkXPlayer,
              jerkYPlayer
            );


            prevMoveX = gameTraining.mouse.x;
            prevMoveY = gameTraining.mouse.y;

            prevMoveAgentX = gameTraining.agent.collisionX;
            prevMoveAgentY = gameTraining.agent.collisionY;
            prevAccelerationX = gameTraining.agent.accX;
            prevAccelerationY = gameTraining.agent.accY;
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
          let mouseX = event.pageX - canvasTraining.offsetLeft;
          let mouseY = event.pageY - canvasTraining.offsetTop;
          // document.getElementById("objectCoords-HAT").innerHTML =
          //   "Object Coordinates: " + mouseX + ", " + mouseY;
          xpos = mouseX;
          ypos = mouseY;


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

