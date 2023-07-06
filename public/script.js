// import { Agent, Player } from "./Classes";
// const Player = require('./Classes')
// import { frechetDistance, rebalanceCurve, procrustesNormalizeCurve, shapeSimilarity } from "curve-matcher";
// import curveMatcher from "curve-matcher"
// import { makeid } from './utils';
const socket = io();
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
let valueSlider = document.getElementById("demo");
let slider = document.getElementById("myRange");
const $mainMenu = document.querySelector("#main-menu-button");
const $instructionsEnglish = document.getElementById("#validation-intructions");
const $instructionsSpanish = document.getElementById(
  "#validation-instructions-es"
);
const $training = document.getElementById("#training-session");
const canvasTraining = document.getElementById("#training");
// const $modeScreenButton = document.querySelector('#main-demo-button')
const $submitGameMode = document.querySelector("#form");
const $startDemo = document.querySelector("#startNow");
const $similarityM = document.querySelector("#similarityMeasure");
const $distanceM = document.querySelector("#distanceMeasure");
const $similarNoRotM = document.querySelector("#similarNoRotMeasure");
const $backButton = document.querySelector("#goBack");
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

// const playerPositions = {
//     X: [],
//     Y: [],
//     angle: [],
// }
// const agentPositions = {
//     X: [],
//     Y: [],
//     angle: [],
//     velocity: []
// }

const playerPositionsCompetence = {
  X: [],
  Y: [],
  angle: [],
};
const agentPositionsCompetence = {
  X: [],
  Y: [],
  angle: [],
};

const playerPositionsPredictability = {
  X: [],
  Y: [],
  angle: [],
};
const agentPositionsPredictability = {
  X: [],
  Y: [],
  angle: [],
};

const agentFinalPosition = {
  X: [],
  Y: [],
  angle: [],
};

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

// MENU

function toggleScreen(id, toggle) {
  let element = document.getElementById(id);
  let display = toggle ? "block" : "none";
  element.style.display = display;
}

function startMenu() {
  toggleScreen("start-screen", false);
  toggleScreen("mode-screen", true);

  // demoGame()
}

function startExperimentInstructions() {
  toggleScreen("validation-instructions-en");
}

function startDemo() {
  toggleScreen("mode-screen", false);
  toggleScreen("demo", true);

  socket.on("begin", function () {
    urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("room")) {
      room = urlParams.get("room");
      // Possibility of removing given new configuration.
      // Is the user entering an admin or a player.
      socket.emit("join_room", room);
    }
    // Tutorial page.
    if (urlParams.has("playground")) {
      // document.getElementById('info').style.opacity = '0';
      // function windowSizeChanged() {
      //     var width = document.getElementById('game').offsetWidth;
      //     var height = document.getElementById('game').offsetHeight;
      //     scaleFactor = Math.min(window.innerWidth / width, window.innerHeight / height);
      //     document.getElementById('game').style.transform = 'scale(' + scaleFactor + ')';
      //   }
      //   window.onresize = windowSizeChanged;
      //   windowSizeChanged();
    }
  });
}

function goBackMenu() {
  toggleScreen("mode-screen", true);
  toggleScreen("demo", false);
}

$backButton.addEventListener("click", goBackMenu);

$mainMenu.addEventListener("click", (e) => {
  startMenu();
});

function calculateAverage(array) {
  let total = 0;
  let count = 0;

  array.forEach(function (item, index) {
    total += item;
    count++;
  });

  return total / count;
}

// Measurement of velocities

setInterval(() => {
  // competencePlayer.push(player.acc.mag())
}, 1000);

// BEGINNING OF THE OLD PROGRAM

const canvas = document.getElementById("canvas-demo");
const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

$backButton.addEventListener("click", goBackMenu);

$mainMenu.addEventListener("click", (e) => {
  startMenu();
});

let speedSelection = document.querySelector("#spdOptions");
let levelCompetence = document.querySelector("#competenceOptions");
let levelPredictability = document.querySelector("#predictabilityOptions");
let measureCompetenceType = document.querySelector("#measureCompetence");
let measurePredictabilityType = document.querySelector(
  "#measurePredictability"
);
// $modeScreenButton.addEventListener('click', (e) => {
//     startDemo()

// })

$submitGameMode.addEventListener("submit", (e) => {
  e.preventDefault();

  if (levelCompetence.options[levelCompetence.selectedIndex].value === "low") {
    // console.log('It works with comp')
    meanCompetence = 0.0;
    stddevCompetence = 300.0;
  } else if (
    levelCompetence.options[levelCompetence.selectedIndex].value === "high"
  ) {
    // console.log('It works with comp1')
    meanCompetence = 0.0;
    stddevCompetence = 100.0;
  } else if (
    levelCompetence.options[levelCompetence.selectedIndex].value === "none"
  ) {
    // console.log('It works with comp2')
  }

  if (
    levelPredictability.options[levelPredictability.selectedIndex].value ===
    "low"
  ) {
    // console.log('It works with pred')
    meanPredictability = 0.0;
    stddevPredRad = Math.PI;
  } else if (
    levelPredictability.options[levelPredictability.selectedIndex].value ===
    "high"
  ) {
    // console.log('It works with pred1')
    meanPredictability = 0.0;
    stddevPredRad = Math.PI / 4;
  } else if (
    levelPredictability.options[levelPredictability.selectedIndex].value ===
    "none"
  ) {
    // console.log('It works with pred2')
  }

  if (
    measureCompetenceType.options[measureCompetenceType.selectedIndex].value ===
    "version1"
  ) {
    // console.log('It works with comp measure')
  }

  if (
    measurePredictabilityType.options[measurePredictabilityType.selectedIndex]
      .value === "version1"
  ) {
    // console.log('It works with comp measure')
  }

  // const urlTest = window.location.search
  // const result = urlTest.slice(0, urlTest.indexOf('?'))
  // console.log(`The URL is ${urlTest.split('?')} and the other is ${result}`)
  // let urlModified = new URLSearchParams(urlTest)
  startDemo();
});

$startDemo.addEventListener("click", () => {
  if (!document.pointerLockElement) {
    canvas.focus();
    canvas.requestPointerLock({
      unadjustedMovement: false,
    });
  }
  $startDemo.disable = true
  newGame();
});

function baseVector(agent, player) {
  distance = Math.sqrt(
    (player.position.x - agent.position.x) ** 2 +
      (player.position.y - agent.position.y) ** 2
  );

  if (distance !== 0) {
    agent.angle = Math.atan2(
      player.position.y - agent.position.y,
      player.position.x - agent.position.x
    );
    agent.velocity = Math.min(distance, agent.maxVelocity);
  }
}

// let compMeasurementCounter = 0
let compMeasurement = 0;
let gameStarted = false;

let playing = false;

function calculateCurvature(speedX, speedY, accX, accY) {
  let curve =
    Math.abs(speedX * accY - accX * speedY) /
    (speedX ** 2 + speedY ** 2) ** (3 / 2);

  return curve;
}

socket.on("end", (finish) => {
  console.log(`The value of finish is: ${finish}`);
  if (finish) {
    gameStarted = false;
    console.log("The experiment is finished");
    document.getElementById("time").innerHTML = "X";
    document.getElementById("timeRemaining").innerHTML = "X";

    // if(document.pointerLockElement) {
    //     canvas.exitPointerLock();
    // }
  } else {
    let seconds = 10;
    document.getElementById("time").innerHTML = seconds;
    if (restIntervalId !== undefined) {
      clearInterval(restIntervalId);
    }
    restIntervalId = setInterval(() => {
      seconds--;
      if (seconds < 0) {
        clearInterval(restIntervalId);
        restIntervalId = undefined;
        playing = true;
        socket.emit("rest_end");
      } else {
        document.getElementById("time").innerHTML = seconds;
      }
    }, 1000);
  }
});

function newGame() {
  prevX = 200;
  prevY = 200;

  agentIdealPrevX = 500;
  agentIdealPrevY = 200;
  agentWavesPrevX = 500;
  agentWavesPrevY = 200;
  // var urlParams = new URLSearchParams(window.location.search);
  urlParams = new URLSearchParams(window.location.search);
  room = urlParams.get("room");
  socket.emit("start", room);
  socket.on("beginGame", (roundBeginning) => {
    console.log(`The round is beginning: ${roundBeginning}`);
    if (!roundBeginning) {
      // console.log("The experiment will begin")
      document.getElementById("timeRemaining").innerHTML = "X";
      playing = false;
    } else if (roundBeginning) {
      console.log("playing", playing);
      gameStarted = true;
      let timeRoundGame = 21;
      document.getElementById("timeRemaining").innerHTML = timeRoundGame;
      gameIntervalId = setInterval(() => {
        timeRoundGame--;
        document.getElementById("timeRemaining").innerHTML = timeRoundGame;
        if (timeRoundGame <= 0) {
          console.log("Time", timeRoundGame);
          console.log("Id", gameIntervalId);
          clearInterval(gameIntervalId);
          gameIntervalId = undefined;
          playing = false;
          gameStarted = false;
          socket.emit("round_end");
        }
      }, 1000);
    }
    demoGame();
  });
}

function validationGame() {}

function demoGame() {
  console.log(`The demo is: ${playing}`);
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

  // let average = 0;
  // let average2 = 0;
  let targetX = canvas.width / 2 + 50;
  let targetY = canvas.height / 2 + 50;
  ctx.fillStyle = "black";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "black";
  // valueSlider.innerHTML = slider.value;

  // canvas.addEventListener("click", async () => {
  //     if(!document.pointerLockElement) {
  //       await canvas.requestPointerLock({
  //         unadjustedMovement: true,
  //       });
  //     }
  // });
  // socket.on('beginParameters', function(times) {

  // })
  // console.log(document.pointerLockElement)

  // console.log(`The movement of mouse in x: ${movementX} and in Y: ${movementY}`)

  document.addEventListener("pointerlockchange", lockChangeAlert, false);
  function lockChangeAlert() {
    if (document.pointerLockElement === canvas) {
      console.log("The pointer lock status is now locked");
    } else {
      console.log("The player is outside the canvas");
    }
  }

  // function lockChangeAlert() {
  // if (document.pointerLockElement === canvas) {
  //     console.log("The pointer lock status is now locked");
  //     document.addEventListener("mousemove", game.render(ctx,e), false);
  // } else {
  //     console.log("The pointer lock status is now unlocked");
  //     document.removeEventListener("mousemove", game.render(ctx,e), false);
  // }
  // }

  // document.addEventListener("pointerlockchange", lockChangeAlert, false);

  // function lockChangeAlert() {
  // if (document.pointerLockElement === canvas) {
  //     console.log("The pointer lock status is now locked");
  //     document.addEventListener("mousemove", updatePosition, false);
  // } else {
  //     console.log("The pointer lock status is now unlocked");
  //     document.removeEventListener("mousemove", updatePosition, false);
  // }
  // }

  if (playing) {
    // What happens when the human disconnects.
    socket.on("disconnected", function (socketId) {});

    socket.on(
      "scoresSimilar",
      (
        similarityScore,
        distanceScore,
        predPersonScore,
        predAgentScore,
        similarityNoRotScore,
        distanceNoRotScore
      ) => {
        console.log("ENTERED THE SCORES FUNCTION");
        $similarityM.innerHTML = `Competence: Shape: ${similarityScore}. Distance: ${distanceScore}`;
        $similarNoRotM.innerHTML = `Competence: ShapeNoRot: ${similarityNoRotScore} Distance: ${distanceNoRotScore}`;
        $distanceM.innerHTML = `Predictability: Human: ${predPersonScore}. Agent: ${predAgentScore}.`;
      }
    );

    socket.on("movementVelocityProfile", (speedAcc, speedDecc) => {
      // console.log(speedAcc)
      // timesProfile ++;
      // console.log(timesProfile)
      console.log(`ENTERED FUNCTION OF PROFILE`);
      game.agent.velocityProfile = speedAcc;
      // console.log(game.agent.velocityProfile)
    });

    // socket.on('end', function( finish) {
    //     if (finish) {
    //         gameStarted = false
    //         console.log("The experiment is finished")
    //         document.getElementById('time').innerHTML = 'X'
    //         document.getElementById('timeRemaining').innerHTML = 'X'

    //         // if(document.pointerLockElement) {
    //         //     canvas.exitPointerLock();
    //         // }

    //     } else {
    //         let seconds = 10
    //         document.getElementById('time').innerHTML = seconds
    //         if (restIntervalId !== undefined)  {
    //          clearInterval(restIntervalId)
    //         }
    //         restIntervalId = setInterval(() => {
    //             seconds --
    //             if (seconds <0) {
    //                 clearInterval(restIntervalId)
    //                 restIntervalId = undefined
    //                 playing = true;
    //             } else {
    //                  document.getElementById('time').innerHTML = seconds
    //             }
    //         }, 1000);
    //     }
    // })

    playerPositions["X"].push(200);
    let counterTest = 0;

    let average = (array) => array.reduce((a, b) => a + b) / array.length;
    // let activateWaves = true

    setInterval(() => {
      testLogic = false;
    }, 500);

    const game = new Game(canvas, socket, room);

    if (game.mouse.x !== undefined && game.mouse.y !== undefined) {
      prevMoveX = game.mouse.x;
      prevMoveY = game.mouse.y;
    }

    game.render(ctx);
    let animationId = undefined;
    // console.log(game)
    function animate() {
      //console.log(`The game is: ${playing}`);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // valueSlider.innerHTML = slider.value;
      let valSlider = parseInt(slider.value);
      game.render(ctx, random, targetX, targetY, valSlider);
      // console.log(Number.isInteger(valSlider))
      // slider.oninput = function () {
      //     valueSlider.innerHTML = this.value;
      // };
      // console.log(slider.value)
      // valueSlider.innerHTML = slider.value;
      if (playing) {
        animationId = requestAnimationFrame(animate);
        speeds.push(game.player.speedX);
        speeds2.push(game.player.speedY);
        // accelXPlayer.push(game.player.prevAccX)
        // accelYPlayer.push(game.player.prevAccY)
        // console.log(game.agent.prevAccX)
        // console.log(game.agent.prevAccY)
        accelXAgent.push(game.agent.prevAccX);
        accelYAgent.push(game.agent.prevAccY);
        // mouseSpeedX.push((game.mouse.x - prevMoveX) / 17.77)
        // mouseSpeedY.push((game.mouse.y - prevMoveY) / 17.77)

        // mouseSpeedXMax.push(Math.abs((game.mouse.x - prevMoveX) / 17.77))
        // mouseSpeedYMax.push(Math.abs((game.mouse.y - prevMoveY) / 17.77))

        // if (game.agent.movementDecision) {

        // }

        // socket.emit('movementDecisionAgent', room, game.agent.maxSpeed, game.agent.trajectoryMovement.length - 1);

        // socket.on('movementVelocityProfile', (speedAcc, speedDecc) => {
        //     game.agent.velocityProfile = speedAcc;
        //     console.log(speedAcc)
        // })

        if (speeds.length >= 2) {
          accelXPlayer.push(
            speeds[speeds.length - 1] - speeds[speeds.length - 2]
          );
          // console.log(`The acceleration of the player is: ${accelXPlayer[accelXPlayer.length - 1]}`)
        }

        // console.log(speeds)

        if (speeds2.length >= 2) {
          accelYPlayer.push(
            speeds2[speeds2.length - 1] - speeds2[speeds2.length - 2]
          );
          // console.log(`The acceleration of the player in Y is: ${accelYPlayer[accelXPlayer.length - 1]}`)
        }

        // console.log(`The acceleration in X: ${accelXPlayer[accelXPlayer.length - 1]} and in Y: ${accelYPlayer[accelYPlayer.length - 1]}`)

        if (accelXPlayer.length >= 2) {
          jerkXPlayer =
            accelXPlayer[accelXPlayer.length - 1] -
            accelXPlayer[accelXPlayer.length - 2];
          jerksXPlayer.push(
            accelXPlayer[accelXPlayer.length - 1] -
              accelXPlayer[accelXPlayer.length - 2]
          );
          // console.log(`The jerk X of the player: ${jerkXPlayer}`)
        }

        if (accelYPlayer.length >= 2) {
          jerkYPlayer =
            accelYPlayer[accelYPlayer.length - 1] -
            accelYPlayer[accelYPlayer.length - 2];
          jerksYPlayer.push(
            accelYPlayer[accelYPlayer.length - 1] -
              accelYPlayer[accelYPlayer.length - 2]
          );
          // console.log(`The jerk Y of the player: ${jerkYPlayer}`)
        }

        if (accelXAgent.length >= 2) {
          jerkXAgent =
            accelXAgent[accelXAgent.length - 1] -
            accelXAgent[accelXAgent.length - 2];
          jerksXAgent.push(
            accelXAgent[accelXAgent.length - 1] -
              accelXAgent[accelXAgent.length - 2]
          );
          // console.log(`The jerk of X is: ${jerkXAgent}`)
        }

        if (accelYAgent.length >= 2) {
          jerkYAgent =
            accelYAgent[accelYAgent.length - 1] -
            accelYAgent[accelYAgent.length - 2];
          jerksYAgent.push(
            accelYAgent[accelYAgent.length - 1] -
              accelYAgent[accelYAgent.length - 2]
          );
          // console.log(`The jerk of Y is: ${jerkYAgent}`)

          // console.log(`The magnitude of jerk is: ${game.player.defineMagnitude(jerkXAgent, jerkYAgent)}`)
        }

        // console.log(`The jerk in X: ${jerksXPlayer[jerksXPlayer.length - 1]} and in Y: ${jerksYPlayer[jerksYPlayer.length - 1]}`)
        // console.log(`The jerk in X: ${jerksXAgent[jerksXAgent.length - 1]} and in Y: ${jerksYAgent[jerksYAgent.length - 1]}`)

        // if (game.agent.accX !== undefined) {
        //     jerkX = game.agent.accX - prevAccelerationX
        // }

        // if (game.agent.accY !== undefined) {
        //     jerkY = game.agent.accY - prevAccelerationY
        // }

        mouseSpeedX.push(game.mouse.x - prevMoveX);
        mouseSpeedY.push(game.mouse.y - prevMoveY);

        rotationAgent =
          (Math.atan2(
            game.agent.collisionY - prevMoveAgentY,
            game.agent.collisionX - prevMoveAgentX
          ) *
            180.0) /
          Math.PI;
        rotation =
          (Math.atan2(game.mouse.y - prevMoveY, game.mouse.x, prevMouseX) *
            180.0) /
          Math.PI;
        mouseSpeedXMax.push(Math.abs(game.mouse.x - prevMoveX));
        mouseSpeedYMax.push(Math.abs(game.mouse.y - prevMoveY));

        // Calculate curvature

        // curvaturePlayer = calculateCurvature(game.player.speedX)

        if (
          accelXPlayer[accelXPlayer.length - 1] !== undefined &&
          accelYPlayer[accelYPlayer.length - 1] !== undefined
        ) {
          // if (game.player.speedX !== 0 || game.player.speedY !== 0) {
          // curvaturePlayer = calculateCurvature(game.player.speedX, game.player.speedY, game.player.prevAccX, game.player.prevAccY)
          curvaturePlayer = calculateCurvature(
            game.player.speedX,
            game.player.speedY,
            accelXPlayer[accelXPlayer.length - 1],
            accelYPlayer[accelYPlayer.length - 1]
          );

          // console.log(`The speed X: ${game.player.speedX} speed Y: ${game.player.speedY} accelX: ${accelXPlayer[accelXPlayer.length - 1]} accelY: ${accelYPlayer[accelYPlayer.length - 1]} and the curvature: ${curvaturePlayer} `)

          // console.log(`The curvature is: ${curvaturePlayer}`)

          // } else {
          //     curvaturePlayer = 0;
          // }

          // console.log(`The curvature of the player is: ${curvaturePlayer}`)

          // if (curvaturePlayer > 10) {
          // console.log(`The speed X: ${game.player.speedX} speed Y: ${game.player.speedY} accelX: ${game.player.prevAccX} accelY: ${game.player.prevAccY} `)
          // console.log(`The curvature is: ${curvaturePlayer}`)
          // }
          if (curvaturePlayer !== NaN && curvaturePlayer !== null) {
            curvaturesPlayer.push(curvaturePlayer);
            curvaturePlayer = 0;
          } else {
            console.log(`The function is working`);
          }

          // console.log(curvaturePlayer !== NaN)

          // console.log(curvaturesPlayer[curvaturesPlayer.length-1])

          // console.log(curvaturePlayer)
          // console.log(curvaturePlayer)
        }

        if (game.agent.accX !== undefined && game.agent.accY !== undefined) {
          curvatureAgent = calculateCurvature(
            game.agent.speedX,
            game.agent.speedY,
            game.agent.prevAccX,
            game.agent.prevAccY
          );
          curvaturesAgent.push(curvatureAgent);
          // console.log(`The speed X: ${game.agent.speedX} speed Y: ${game.agent.speedY} accelX: ${game.agent.prevAccX} accelY: ${game.agent.prevAccY} `)
          // console.log(`The curvature of the agent is: ${curvatureAgent}`)
        }

        // console.log(`The difference between player and agent is: ${Math.abs(curvaturePlayer - curvatureAgent)}`)

        if (
          !game.player.movementDecision &&
          game.player.prevMoveDec !== game.player.movementDecision
        ) {
          // console.log(curvaturesPlayer)
          // console.log(`The max curvature of the PLAYER is: ${Math.max(...curvaturesPlayer)}`)
          // console.log(`This works~!!!!`)
          socket.emit("calculateMeasuresPlayer", room);
          curvaturesPlayer = [];
        }

        //  console.log(`First condition: ${!game.player.movementDecision} and second condition: ${game.player.prevMoveDec !== game.player.movementDecision}`)

        if (
          !game.agent.movementDecision &&
          game.agent.prevMoveDec !== game.agent.movementDecision
        ) {
          socket.emit("calculateMeasuresAgent", room);
          curvaturesAgent = [];
        }

        // console.log(`The max curvature of the agent is: ${Math.max(...curvaturesAgent)}`)

        // curvatureAgent = calculateCurvature(game.agent.speedX, game.agent.speedY, game.agent.accX, game.agent.accY)

        // console.log(`The acceleration of the agent in X is: ${game.agent.accX} and in Y: ${game.agent.accY}`)
        // console.log(`The curvature of the agent is: ${curvatureAgent}`)

        socket.emit(
          "locationAgent",
          room,
          game.agent.collisionX,
          game.agent.collisionY,
          rotationAgent,
          game.agent.speedX,
          game.agent.speedY,
          game.agent.prevAccX,
          game.agent.prevAccY,
          jerkXAgent,
          jerkYAgent
        );
        socket.emit(
          "locationPlayer",
          room,
          game.player.collisionX,
          game.player.collisionY,
          rotation,
          speeds[speeds.length - 1],
          speeds2[speeds2.length - 1],
          accelXPlayer[accelXPlayer.length - 1],
          accelYPlayer[accelYPlayer.length - 1],
          jerkXPlayer,
          jerkYPlayer
        );

        // moveTextX.innerText = `Mouse Speed in X: ${game.mouse.x - prevMoveX}`
        // moveTextY.innerText = `Mouse Speed in Y: ${game.mouse.y - prevMoveY}`

        // if (game.agent.movementDecision === false) {
        //     socket.emit('calculateMeasures', room)
        // }

        prevMoveX = game.mouse.x;
        prevMoveY = game.mouse.y;

        prevMoveAgentX = game.agent.collisionX;
        prevMoveAgentY = game.agent.collisionY;
        prevAccelerationX = game.agent.accX;
        prevAccelerationY = game.agent.accY;
      } else {
        cancelAnimationFrame(animationId);
      } // console.log(`The collision of the agent is: ${game.agent.collisionX} and ${game.agent.collisionY}`)
      // console.log(`The target of the agent is: ${targetX} and ${targetY}`)
    }
    if (gameStarted) {
      animate();
    }

    // MOUSE MOVEMENTS
    canvas.addEventListener("mousemove", function (event) {
      let mouseX = event.pageX - canvas.offsetLeft;
      let mouseY = event.pageY - canvas.offsetTop;
      document.getElementById("objectCoords-HAT").innerHTML =
        "Object Coordinates: " + mouseX + ", " + mouseY;
      xpos = mouseX;
      ypos = mouseY;
      // prevX = mouseX
      // prevY = mouseY

      let rot = (Math.atan2(mouseY - prevY, mouseX - prevX) * 180.0) / Math.PI;
      let dist = Math.sqrt(
        Math.pow(mouseY - prevY, 2) + Math.pow(mouseX - prevX, 2)
      );
      // prevX = mouseX;
      // prevY = mouseY;
      // while(rotation - rot > 180) {
      //     rotation -= 360;
      // }
      // while(rot - rotation > 180) {
      //     rotation += 360;
      // }
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
