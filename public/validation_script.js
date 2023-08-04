class ValidationScript {
  validationScript(socket){
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
    
    // Canvas Validation Experiment Definition
    const canvasValidation = document.getElementById("canvas-validation-game");
    const ctxValidation = canvasValidation.getContext("2d");
    // Canvas Validation Experiment Dimensions
    canvasValidation.width = 800;
    canvasValidation.height = 500;
    
    
    // Timers Definition
    
    // Training number of rounds
    let roundNumber = 0;
    // Validation Experiment Timers Definition
    let timerBetweenRoundsValidation = document.getElementById("time-validation-prelim");
    let timerRoundsValidation = document.getElementById("time-validation-round")
    
    
    
    // BUTTONS AND FORMS
    
    
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
    
    // MENU
    
    
    // Validation Experiment Functions for Menus
    
    
    // VALIDATION EXPERIMENT SESSION
    
    function startValidationExperiment() {
      toggleScreen("training-session-debrief", false);
      toggleScreen("validation-experiment", true); 
    }
    
    
    // BUTTON CLICKING FOR MENUS
    
    
    // VALIDATION EXPERIMENT SEQUENCE
    
    // Go from the training debrief to the validation experiment.
    $validationExperimentPage.addEventListener("click", (e) => {
      console.log(`Is clicked the beginning of the game`)
      startValidationExperiment();
    })
    $validationExperimentBegin.addEventListener("click", (e) => {
      if (!document.pointerLockElement) {
        canvasValidation.focus();
        canvasValidation.requestPointerLock({
          unadjustedMovement: false,
        });
      }
      $validationExperimentBegin.disable = true
      newValidation();
    })
    
    
    // GAME EXPERIMENT
    
    
    
    let compMeasurement = 0;
    let gameStartedValidation = false;
    
    let playingValidation = false;
    
    let currentRoundV = 0;
    
    
    // LOGIC FOR FINISHING THE VALIDATION SESSION
    socket.on("endValidation", (finish) => {
      console.log(`The value of finish is: ${finish}`);
      if (finish) {
        gameStartedValidation = false;
        console.log("The experiment is finished");
        timerBetweenRoundsValidation.innerHTML = "X";
        timerRoundsValidation.innerHTML = "X";
      } else {
        let seconds = 10;
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
          console.log("playing", playingValidation);
          gameStartedValidation = true;
          let timeRoundGameValidation = 31;
          timerRoundsValidation.innerHTML = timeRoundGameValidation;
          gameIntervalId = setInterval(() => {
            timeRoundGameValidation--;
            timerRoundsValidation.innerHTML = timeRoundGameValidation;
            if (timeRoundGameValidation <= 0) {
              console.log("Time", timeRoundGameValidation);
              console.log("Id", gameIntervalId);
              clearInterval(gameIntervalId);
              gameIntervalId = undefined;
              playingValidation = false;
              gameStartedValidation = false;
              socket.emit("round_end_validation");
              // socket.on("currentRound", (currentRound) => {
              //   currentRoundTraining = currentRound;
              // } )
              // console.log(`The current round is: ${currentRoundTraining}`)
              // DEFINE A VARIABLE TO KEEP TRACK OF THE NUMBER OF TIMES
    
            }
          }, 1000);
        }
        validationGame();
      });
    }
    
    
    
    function validationGame() {
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
    let currentRound = 0;
    let random = Math.random();
    
    // Parameters for Experiment Conditions
    // Player Controls
    // game.player.maxSpeed = 20;
    // Agent Controls
    // game.agent.maxSpeed = 20;
    ;
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
    
    if (playingValidation) {
      // What happens when the human disconnects.
      socket.on("disconnected", function (socketId) {
        
      });
    
      // playerPositions["X"].push(200);
      // let counterTest = 0;
    
      let average = (array) => array.reduce((a, b) => a + b) / array.length;
      // let activateWaves = true
    
    
      const gameValidation = new Game(canvasValidation, socket, room);
    
      socket.on("currentRoundValidation", (currentRoundValidation) => {
        currentRoundV = currentRoundValidation;
        // console.log(`The current round of the game is: ${currentRoundValidation}`)
        // console.log(`The variable for the round is: ${currentRound}`)
      })
    
      console.log(`The current round of the game is EXTRA: ${currentRoundV}`)
    
      gameValidation.gameRound ++
    
      if (gameValidation.mouse.x !== undefined && gameValidation.mouse.y !== undefined) {
        prevMoveX = gameValidation.mouse.x;
        prevMoveY = gameValidation.mouse.y;
      }
    
      let valSlider = 0;
    
      gameValidation.render(ctxValidation, random, targetX, targetY);
      let animationId = undefined;
    
      function animate() {
        //console.log(`The game is: ${playing}`);
        ctxValidation.clearRect(0, 0, canvasValidation.width, canvasValidation.height);
        // valueSlider.innerHTML = slider.value;
        // valSlider = parseInt(slider.value);
        // console.log(`The targets are: ${targetX}, ${targetY}`)
        // gameTraining.agent.target.x = targetX;
        // gameTraining.agent.target.y = targetY;
        gameValidation.render(ctxValidation, random, targetX, targetY);
        if (playingValidation) {
          animationId = requestAnimationFrame(animate);
          speeds.push(gameValidation.player.speedX);
          speeds2.push(gameValidation.player.speedY);
          accelXAgent.push(gameValidation.agent.prevAccX);
          accelYAgent.push(gameValidation.agent.prevAccY);
    
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
    
          mouseSpeedX.push(gameValidation.mouse.x - prevMoveX);
          mouseSpeedY.push(gameValidation.mouse.y - prevMoveY);
    
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
    
    
          if (
            accelXPlayer[accelXPlayer.length - 1] !== undefined &&
            accelYPlayer[accelYPlayer.length - 1] !== undefined
          ) {
            curvaturePlayer = calculateCurvature(
              gameValidation.player.speedX,
              gameValidation.player.speedY,
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
    
          if (gameValidation.agent.accX !== undefined && gameValidation.agent.accY !== undefined) {
            curvatureAgent = calculateCurvature(
              gameValidation.agent.speedX,
              gameValidation.agent.speedY,
              gameValidation.agent.prevAccX,
              gameValidation.agent.prevAccY
            );
            curvaturesAgent.push(curvatureAgent);
          }
    
          if (
            !gameValidation.player.movementDecision &&
            gameValidation.player.prevMoveDec !== gameValidation.player.movementDecision
          ) {
            socket.emit("calculateMeasuresPlayer", room);
            curvaturesPlayer = [];
          }
          if (
            !gameValidation.agent.movementDecision &&
            gameValidation.agent.prevMoveDec !== gameValidation.agent.movementDecision
          ) {
            socket.emit("calculateMeasuresAgent", room);
            curvaturesAgent = [];
          }
    
          socket.emit(
            "locationAgent",
            room,
            gameValidation.agent.collisionX,
            gameValidation.agent.collisionY,
            rotationAgent,
            gameValidation.agent.speedX,
            gameValidation.agent.speedY,
            gameValidation.agent.prevAccX,
            gameValidation.agent.prevAccY,
            jerkXAgent,
            jerkYAgent
          );
          socket.emit(
            "locationPlayer",
            room,
            gameValidation.player.collisionX,
            gameValidation.player.collisionY,
            rotation,
            speeds[speeds.length - 1],
            speeds2[speeds2.length - 1],
            accelXPlayer[accelXPlayer.length - 1],
            accelYPlayer[accelYPlayer.length - 1],
            jerkXPlayer,
            jerkYPlayer
          );
    
    
          prevMoveX = gameValidation.mouse.x;
          prevMoveY = gameValidation.mouse.y;
    
          prevMoveAgentX = gameValidation.agent.collisionX;
          prevMoveAgentY = gameValidation.agent.collisionY;
          prevAccelerationX = gameValidation.agent.accX;
          prevAccelerationY = gameValidation.agent.accY;
        } else {
          cancelAnimationFrame(animationId);
        }
      }
      if (gameStartedValidation) {
        console.log('THE VALIDATION IS ANIMATING')
        animate();
      }
    
      // MOUSE MOVEMENTS
      canvasValidation.addEventListener("mousemove", function (event) {
        let mouseX = event.pageX - canvasValidation.offsetLeft;
        let mouseY = event.pageY - canvasValidation.offsetTop;
        // document.getElementById("objectCoords-HAT").innerHTML =
        //   "Object Coordinates: " + mouseX + ", " + mouseY;
        xpos = mouseX;
        ypos = mouseY;
        // prevX = mouseX
        // prevY = mouseY
    
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
