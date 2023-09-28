class SimulationScript {
  simulationScript(socket, roundNumber) {
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
    const $simulationExperimentBegin = document.querySelector("#main-simulation-button")
    // const $validationExperimentBegin = document.querySelector("#startValidationExperiment")

    // const $validationExperimentNextRound = document.querySelector("#continueValidationExperiment");


    // CANVAS VALIDATION EXPERIMENT SELECTION

    // Canvas Validation Experiment Definition
    const canvasSimulation = document.getElementById("canvas-simulation-game");
    const ctxSimulation = canvasSimulation.getContext("2d");
    // Canvas Validation Experiment Dimensions
    canvasSimulation.width = 800;
    canvasSimulation.height = 500;


    // Timers Definition

    // Training number of rounds
    // Validation Experiment Timers Definition
    let timerBetweenRoundsSimulation = document.getElementById("time-simulation-prelim");
    let timerRoundsSimulation = document.getElementById("time-simulation-round")

    // Role of the player

    let rolePlayerSimulation = document.getElementById("rolePlayerSimulation");
    let instructionPlayerSimulation = document.getElementById("instructionsPlayerSimulation");


    // BUTTONS AND FORMS


    // let roomName;

    let prevX;
    let prevY;
    let rotationAgentBot = 0;
    let differenceRotationAgentBot = 0;

    // let agentIdealPrevX;
    // let agentIdealPrevY;

    // let agentWavesPrevX;
    // let agentWavesPrevY;
    let rotationAgent = 0;
    let differenceRotationAgent = 0;

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
    // let prevMouseX;
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
    // const playerPositions = {
    //   X: [],
    //   Y: [],
    //   angle: [],
    //   velocity: [],
    //   acceleration: [],
    // };
    // const agentPositions = {
    //   X: [],
    //   Y: [],
    //   angle: [],
    //   velocity: [],
    //   acceleration: [],
    //   jerk: [],
    //   distance: [],
    // };


    // VALIDATION EXPERIMENT SESSION

    function startSimulationExperiment() {
      toggleScreen("start-screen", false);
      toggleScreen("simulation-screen", true);
      if (!document.pointerLockElement) {
        canvasSimulation.focus();
        canvasSimulation.requestPointerLock({
          unadjustedMovement: false,
        });
      }
      // $trainingSessionEnd.disabled = true;
      newSimulation();
    }

    function endOfSimulation() {

    }

    // SIMULATION EXPERIMENT SEQUENCE

    // Go from the training debrief to the validation experiment.
    $simulationExperimentBegin.addEventListener("click", (e) => {
      console.log(`Is clicked the beginning of the game`)
      startSimulationExperiment();
    })
    // $validationExperimentBegin.addEventListener("click", (e) => {
    //   if (!document.pointerLockElement) {
    //     canvasSimulation.focus();
    //     canvasSimulation.requestPointerLock({
    //       unadjustedMovement: false,
    //     });
    //   }
    //   $validationExperimentBegin.disabled = true
    //   console.log(`The button is deactivated ${$validationExperimentBegin.disabled}`)
    //   finishGame = false;
    //   newSimulation();
    // })

    // $validationExperimentNextRound.addEventListener("click", (e) => {
    //   if (!document.pointerLockElement) {
    //     canvasSimulation.focus();
    //     canvasSimulation.requestPointerLock({
    //       unadjustedMovement: false,
    //     });
    //   }

    // })


    // GAME EXPERIMENT



    // let compMeasurement = 0;
    let gameStartedSimulation = false;
    let finishGame = false;

    let playingSimulation = false;

    // let currentRoundV = 0;


    // LOGIC FOR FINISHING THE VALIDATION SESSION
    socket.on("endSimulation", (finish) => {
      console.log(`The value of finish is: ${finish}`);
      if (finish) {
        gameStartedSimulation = false;
        console.log("The experiment is finished");
        timerBetweenRoundsSimulation.innerHTML = "X";
        timerRoundsSimulation.innerHTML = "X";
        rolePlayerSimulation.innerHTML = "X";
        instructionPlayerSimulation.innerHTML = "...";
        finishGame = true;
        // $validationExperimentBegin.disabled = false;
        variations = [];
        // socket.off("endSimulation")
      } else {
        let seconds = 10;
        roundNumber++;
        console.log(`The round of the experiment: ${roundNumber}`)
        timerBetweenRoundsSimulation.innerHTML = seconds;
        if (restIntervalId !== undefined) {
          clearInterval(restIntervalId);
        }
        restIntervalId = setInterval(() => {
          seconds--;
          if (seconds < 0) {
            clearInterval(restIntervalId);
            restIntervalId = undefined;
            playingSimulation = true;
            socket.emit("rest_end_validation");
          } else {
            timerBetweenRoundsSimulation.innerHTML = seconds;
          }
        }, 1000);
      }
    });

    // socket.on("begingameSimulation", (roundBeginningSimulation) => {
    //   console.log(`The round is beginning: ${roundBeginningSimulation}`);
    //   if (!roundBeginningSimulation) {
    //     // console.log("The experiment will begin")
    //     timerRoundsSimulation.innerHTML = "X";
    //     playingSimulation = false;
    //   } else if (roundBeginningSimulation) {
    //     // console.log("playing", playingSimulation);
    //     gameStartedSimulation = true;
    //     let timeRoundgameSimulation = 31;
    //     timerRoundsSimulation.innerHTML = timeRoundgameSimulation;
    //     gameIntervalId = setInterval(() => {
    //       timeRoundgameSimulation--;
    //       timerRoundsSimulation.innerHTML = timeRoundgameSimulation;
    //       console.log(`The time for the validation is: ${timeRoundgameSimulation}`)
    //       if (timeRoundgameSimulation <= 0) {
    //         console.log("Time", timeRoundgameSimulation);
    //         console.log("Id", gameIntervalId);
    //         clearInterval(gameIntervalId);
    //         // timeRoundgameSimulation = 31;
    //         gameIntervalId = undefined;
    //         playingSimulation = false;
    //         gameStartedSimulation = false;
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

    function newSimulation() {
      prevX = 200;
      prevY = 200;
      urlParams = new URLSearchParams(window.location.search);
      room = urlParams.get("room");
      socket.emit("start-simulation", room);
      socket.on("beginGameSimulation", (roundBeginningSimulation) => {
        console.log(`The round is beginning: ${roundBeginningSimulation}`);
        if (!roundBeginningSimulation) {
          // console.log("The experiment will begin")
          timerRoundsSimulation.innerHTML = "X";
          playingSimulation = false;
        } else if (roundBeginningSimulation) {
          // console.log("playing", playingSimulation);
          gameStartedSimulation = true;
          let timeRoundGameSimulation = 60;



          timerRoundsSimulation.innerHTML = timeRoundGameSimulation;
          gameIntervalId = setInterval(() => {
            timeRoundGameSimulation--;
            timerRoundsSimulation.innerHTML = timeRoundGameSimulation;
            // console.log(`The time for the validation is: ${timeRoundGameValidation}`)
            if (timeRoundGameSimulation <= 0) {
              console.log("Time", timeRoundGameSimulation);
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
              playingSimulation = false;
              gameStartedSimulation = false;
              socket.emit("round_end_simulation");
            }
          }, 1000);
        }
          simulationGame();

      });
    }

    // VALIDATION GAME

    function simulationGame() {
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
      let prevMoveAgentBotX = 0;
      let prevMoveAgentBotY = 0;
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

      let targetX = canvasSimulation.width / 2 + 50;
      let targetY = canvasSimulation.height / 2 + 50;


      ctxSimulation.fillStyle = "black";
      ctxSimulation.lineWidth = 3;
      ctxSimulation.strokeStyle = "black";


      // document.addEventListener("pointerlockchange", lockChangeAlert, false);
      // function lockChangeAlert() {
      //   if (document.pointerLockElement === canvasSimulation) {
      //     console.log("The pointer lock status is now locked");
      //   } else {
      //     console.log("The player is outside the canvas");
      //   }
      // }

      // canvasSimulation.addEventListener('mousemove', (e) => {
      //   mouseMoveX = e.movementX;
      //   mouseMoveY = e.movementY;
      // })


      if (playingSimulation) {
        // What happens when the human disconnects.
        socket.on("disconnected", function (socketId) {

        });

        // playerPositions["X"].push(200);
        // let counterTest = 0;

        // let average = (array) => array.reduce((a, b) => a + b) / array.length;
        // let activateWaves = true


        const gameSimulation = new GameSimulation(canvasSimulation, socket, room);

        console.log(`The current round is: ${roundNumber}`)
        console.log(`The profile of the game: ${currentGameProfile}`)
        // const setGameConfig = (follower, competence, predictability) => {
        //   gameSimulation.agent.follower = follower;
        //   gameSimulation.agent.competence = competence;
        //   gameSimulation.agent.predictability = predictability;
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
          gameSimulation.agent1.role = 1;
          gameSimulation.agent1.follower = false;
          gameSimulation.agent2.role = 2;
          gameSimulation.agent2.follower = false;
          gameSimulation.agent1.maxSpeed = 10;
          gameSimulation.agent2.maxSpeed = 10;
          gameSimulation.agent1.competence = true;
          gameSimulation.agent1.predictability = true;
          gameSimulation.agent2.competence = true;
          gameSimulation.agent2.predictability = true;
        } else if (currentGameProfile === 2) {
          gameSimulation.agent1.role = 1;
          gameSimulation.agent1.follower = false;
          gameSimulation.agent2.role = 2;
          gameSimulation.agent2.follower = false;
          gameSimulation.agent1.maxSpeed = 10;
          gameSimulation.agent2.maxSpeed = 10;
          gameSimulation.agent1.competence = true;
          gameSimulation.agent1.predictability = true;
          gameSimulation.agent2.competence = true;
          gameSimulation.agent2.predictability = true;
        } else if (currentGameProfile === 3) {
          gameSimulation.agent1.role = 1;
          gameSimulation.agent1.follower = false;
          gameSimulation.agent2.role = 2;
          gameSimulation.agent2.follower = false;
          gameSimulation.agent1.maxSpeed = 10;
          gameSimulation.agent2.maxSpeed = 10;
          gameSimulation.agent1.competence = true;
          gameSimulation.agent1.predictability = true;
          gameSimulation.agent2.competence = true;
          gameSimulation.agent2.predictability = true;
        } else if (currentGameProfile === 4) {
          gameSimulation.agent1.role = 1;
          gameSimulation.agent1.follower = false;
          gameSimulation.agent2.role = 2;
          gameSimulation.agent2.follower = false;
          gameSimulation.agent1.maxSpeed = 10;
          gameSimulation.agent2.maxSpeed = 10;
          gameSimulation.agent1.competence = true;
          gameSimulation.agent1.predictability = true;
          gameSimulation.agent2.competence = true;
          gameSimulation.agent2.predictability = true;
        } else if (currentGameProfile === 5) {
          gameSimulation.agent1.role = 1;
          gameSimulation.agent1.follower = false;
          gameSimulation.agent2.role = 2;
          gameSimulation.agent2.follower = false;
          gameSimulation.agent1.maxSpeed = 10;
          gameSimulation.agent2.maxSpeed = 10;
          gameSimulation.agent1.competence = true;
          gameSimulation.agent1.predictability = true;
          gameSimulation.agent2.competence = true;
          gameSimulation.agent2.predictability = true;
        } else if (currentGameProfile === 6) {
          gameSimulation.agent1.role = 1;
          gameSimulation.agent1.follower = false;
          gameSimulation.agent2.role = 2;
          gameSimulation.agent2.follower = false;
          gameSimulation.agent1.maxSpeed = 10;
          gameSimulation.agent2.maxSpeed = 10;
          gameSimulation.agent1.competence = true;
          gameSimulation.agent1.predictability = true;
          gameSimulation.agent2.competence = true;
          gameSimulation.agent2.predictability = true;
        } else if (currentGameProfile === 7) {
          gameSimulation.agent1.role = 1;
          gameSimulation.agent1.follower = false;
          gameSimulation.agent2.role = 2;
          gameSimulation.agent2.follower = false;
          gameSimulation.agent1.maxSpeed = 10;
          gameSimulation.agent2.maxSpeed = 10;
          gameSimulation.agent1.competence = true;
          gameSimulation.agent1.predictability = true;
          gameSimulation.agent2.competence = true;
          gameSimulation.agent2.predictability = true;
        } else if (currentGameProfile === 8) {
          gameSimulation.agent1.role = 1;
          gameSimulation.agent1.follower = false;
          gameSimulation.agent2.role = 2;
          gameSimulation.agent2.follower = false;
          gameSimulation.agent1.maxSpeed = 10;
          gameSimulation.agent2.maxSpeed = 10;
          gameSimulation.agent1.competence = true;
          gameSimulation.agent1.predictability = true;
          gameSimulation.agent2.competence = true;
          gameSimulation.agent2.predictability = true;
        } 
        
        
        // else if (currentGameProfile === 9) {
        //   gameSimulation.agent.role = true;
        //   gameSimulation.agent.follower = true;
        //   gameSimulation.agent.competence = true;
        //   gameSimulation.agent.predictability = true;
        // } else if (currentGameProfile === 10) {
        //   gameSimulation.agent.role = true;
        //   gameSimulation.agent.follower = true;
        //   gameSimulation.agent.competence = true;
        //   gameSimulation.agent.predictability = true;
        // } else if (currentGameProfile === 11) {
        //   gameSimulation.agent.role = true;
        //   gameSimulation.agent.follower = true;
        //   gameSimulation.agent.competence = true;
        //   gameSimulation.agent.predictability = true;
        // } else if (currentGameProfile === 12) {
        //   gameSimulation.agent.role = true;
        //   gameSimulation.agent.follower = true;
        //   gameSimulation.agent.competence = true;
        //   gameSimulation.agent.predictability = true;
        // } else if (currentGameProfile === 13) {
        //   gameSimulation.agent.role = true;
        //   gameSimulation.agent.follower = true;
        //   gameSimulation.agent.competence = true;
        //   gameSimulation.agent.predictability = true;
        // } else if (currentGameProfile === 14) {
        //   gameSimulation.agent.role = true;
        //   gameSimulation.agent.follower = true;
        //   gameSimulation.agent.competence = true;
        //   gameSimulation.agent.predictability = true;
        // } else if (currentGameProfile === 15) {
        //   gameSimulation.agent.role = true;
        //   gameSimulation.agent.follower = true;
        //   gameSimulation.agent.competence = true;
        //   gameSimulation.agent.predictability = true;
        // } else if (currentGameProfile === 16) {
        //   gameSimulation.agent.role = 0;
        //   gameSimulation.agent.follower = true;
        //   gameSimulation.agent.competence = true;
        //   gameSimulation.agent.predictability = true;
        // }


        if (gameSimulation.agent2.role === 0) {
          rolePlayerSimulation.innerHTML = "leader";
          instructionPlayerSimulation.innerHTML = "Create novel and interesting moves and have fun. The agent will follow you."
        } else if(gameSimulation.agent2.role === 1) {
          rolePlayerSimulation.innerHTML = "follower";
          instructionPlayerSimulation.innerHTML = "Complement the movements of the agent and have fun."
        } else if (gameSimulation.agent2.role === 2) {
          rolePlayerSimulation.innerHTML = "Joint Improvisation";
          instructionPlayerSimulation.innerHTML = "Develop creative movements while synchronizing with the agent!"
        }

        if (gameSimulation.agent2.role === 2) {
          randomBehaviorIntervalId = setInterval(() => {
            randomBehaviorTime = randIntervalFromIntervalInteger( 5, 10) * 1000;
            if (gameSimulation.agent2.follower) {
              gameSimulation.agent2.follower = false;
            } else if (!gameSimulation.agent2.follower) {
              gameSimulation.agent2.follower = true;
            }
            console.log(`The time for the interval was: ${randomBehaviorTime} and the agent is the follower: ${gameSimulation.agent.follower}`)
          }, randomBehaviorTime);
        }



        // if (gameSimulation.mouse.x !== undefined && gameSimulation.mouse.y !== undefined) {
        //   prevMoveX = gameSimulation.mouse.x;
        //   prevMoveY = gameSimulation.mouse.y;
        // }


        gameSimulation.render(ctxSimulation, random, targetX, targetY, mouseMoveX, mouseMoveY);
        let animationId = undefined;

        function animate() {
          //console.log(`The game is: ${playing}`);
          ctxSimulation.clearRect(0, 0, canvasSimulation.width, canvasSimulation.height);
          // valueSlider.innerHTML = slider.value;
          // valSlider = parseInt(slider.value);
          // console.log(`The targets are: ${targetX}, ${targetY}`)
          // gameTraining.agent.target.x = targetX;
          // gameTraining.agent.target.y = targetY;
          gameSimulation.render(ctxSimulation, random, targetX, targetY, mouseMoveX, mouseMoveY);
          if (playingSimulation) {
            animationId = requestAnimationFrame(animate);
            // speeds.push(gameSimulation.player.speedX);
            // speeds2.push(gameSimulation.player.speedY);
            // accelXAgent.push(gameSimulation.agent.prevAccX);
            // accelYAgent.push(gameSimulation.agent.prevAccY);

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

            // mouseSpeedX.push(gameSimulation.mouse.x - prevMoveX);
            // mouseSpeedY.push(gameSimulation.mouse.y - prevMoveY);

            rotationAgent = gameSimulation.agent2.rotation;
            differenceRotationAgent = gameSimulation.agent2.differenceRotation;

            rotationAgentBot = gameSimulation.agent1.rotation;
            differenceRotationAgentBot = gameSimulation.agent1.differenceRotation;
            
            // rotation = gameSimulation.player.rotation;
            // differenceRotation = gameSimulation.player.differenceRotation;

            // rotationAgent =
            //   (Math.atan2(
            //     gameSimulation.agent.collisionY - prevMoveAgentY,
            //     gameSimulation.agent.collisionX - prevMoveAgentX
            //   ) *
            //     180.0) /
            //   Math.PI;
            // rotation =
            //   (Math.atan2(gameSimulation.mouse.y - prevMoveY, gameSimulation.mouse.x, prevMouseX) *
            //     180.0) /
            //   Math.PI;
            // mouseSpeedXMax.push(Math.abs(gameSimulation.mouse.x - prevMoveX));
            // mouseSpeedYMax.push(Math.abs(gameSimulation.mouse.y - prevMoveY));


            // if (
            //   accelXPlayer[accelXPlayer.length - 1] !== undefined &&
            //   accelYPlayer[accelYPlayer.length - 1] !== undefined
            // ) {
            //   curvaturePlayer = calculateCurvature(
            //     gameSimulation.player.speedX,
            //     gameSimulation.player.speedY,
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

            // if (gameSimulation.agent.accX !== undefined && gameSimulation.agent.accY !== undefined) {
            //   curvatureAgent = calculateCurvature(
            //     gameSimulation.agent.speedX,
            //     gameSimulation.agent.speedY,
            //     gameSimulation.agent.prevAccX,
            //     gameSimulation.agent.prevAccY
            //   );
            //   curvaturesAgent.push(curvatureAgent);
            // }

            // if (
            //   !gameSimulation.player.movementDecision &&
            //   gameSimulation.player.prevMoveDec !== gameSimulation.player.movementDecision
            // ) {
            //   socket.emit("calculateMeasuresPlayer", room);
            //   curvaturesPlayer = [];
            // }
            // if (
            //   !gameSimulation.agent.movementDecision &&
            //   gameSimulation.agent.prevMoveDec !== gameSimulation.agent.movementDecision
            // ) {
            //   socket.emit("calculateMeasuresAgent", room);
            //   curvaturesAgent = [];
            // }

            socket.emit(
              "locationAgent",
              room,
              gameSimulation.agent1.collisionX,
              gameSimulation.agent1.collisionY,
              rotationAgent,
              differenceRotationAgent,
              
            );
            socket.emit(
              "locationAgentBot",
              room,
              gameSimulation.agent1.collisionX,
              gameSimulation.agent1.collisionY,
              rotationAgentBot,
              differenceRotationAgentBot,
            );


            // prevMoveX = gameSimulation.mouse.x;
            // prevMoveY = gameSimulation.mouse.y;

            
            
            prevMoveAgentBotX = gameSimulation.agent1.collisionX;
            prevMoveAgentBotY = gameSimulation.agent1.collisionY;
            prevMoveAgentX = gameSimulation.agent2.collisionX;
            prevMoveAgentY = gameSimulation.agent2.collisionY;
            // prevAccelerationX = gameSimulation.agent.accX;
            // prevAccelerationY = gameSimulation.agent.accY;
          } else {
            cancelAnimationFrame(animationId);
            // if (finishGame) {
            //   return;
            // }
          }
        }
        if (gameStartedSimulation) {
          console.log('THE VALIDATION IS ANIMATING')
          animate();
        }

        // MOUSE MOVEMENTS
        canvasSimulation.addEventListener("mousemove", function (event) {
          // let mouseX = event.pageX - canvasSimulation.offsetLeft;
          // let mouseY = event.pageY - canvasSimulation.offsetTop;
          // let mouseX = gameSimulation.player.collisionX;
          // let mouseY = gameSimulation.player.collisionY;
          // document.getElementById("objectCoords-HAT").innerHTML =
          //   "Object Coordinates: " + mouseX + ", " + mouseY;
          // xpos = mouseX;
          // ypos = mouseY;
          // prevX = gameSimulation.player.prevMouseX
          // prevY = gameSimulation.player.prevMoveY

          // let rot = (Math.atan2(mouseY - prevY, mouseX - prevX) * 180.0) / Math.PI;
          // let dist = Math.sqrt(
            // Math.pow(mouseY - prevY, 2) + Math.pow(mouseX - prevX, 2)
          // );
          // var smooth = Math.min(1, dist / 50);
          // rotation = smooth * rot + (1 - smooth) * rotation;
          // socket.emit('location', room, mouseX, mouseY, rotation);

          // return {
          //  x: mouseX,
          //  y: mouseY,
          // };
        });
      }
    }
  }
}
