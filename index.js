var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
const fs = require("fs");
const MongoClient = require("mongodb").MongoClient;
// const Spline = require("cubic-spline");

// const curveMatcher = require("curve-matcher")
// const paper = require("paper")
// const smoothCurve = require("chaikin-smooth")

// const {makeid} = require('./utils')

// let timesAgentDec = 0;
// let playPositions = [];
// let positionData = [];
// let speedXPlayer = [];
// let speedYPlayer = [];
// let accelXPlayer = [];
// let accelYPlayer = [];
// let jerkXPlayer = [];
// let jerkYPlayer = [];

// let agePositions = [];
// let accelXAgent = [];
// let accelYAgent = [];
// // Competence Measurements
// let speedXAgent = [];
// let speedYAgent = [];
// let jerkXAgent = [];
// let jerkYAgent = [];
// let rotationPlayer = [];

// // Predictability Measurements
// let rotationAgent = [];
// let curvatureAgent = [];
// let curvaturePlayer = [];
// let agePositions2 = [];

// // let rotDifferencesWaveAgent = []
// // let rotDifferencesIdealAgent = []
// let rotDifferencesPlayer = [];

// // let velocityAgentWaves = []
// // let velocityAgent = []
// // let velocityPlayer = []

// let amountSharpTurnsAgent;
// let amountSharpTurnsPlayer = 0;

// let prevAgePositions = []
// let prevAgePositions2 = []
// let prevPlayPositions = []
let roundBeginning = false;
let roundBeginningTraining = false;
let roundBeginningValidation = false;
// let totalGameTime = 30000;
// let playing = false
// let playerPositionsTest = []
// let agentPositionsTest = []
// let agent2PositionsTest= []
let dataPlayer = [];
let dataPlayerPosition = [];
let dataAgent = [];
let dataAgentPosition = [];

const port = process.env.PORT || 3000;

const rooms = {}; //maintains current state for rooms
const rooms_history = {}; //maintains historical state for point calculation
const room_score = {}; //keeps track of the total score for each room

// let arrayTest = [];

// Experiment Scores
let room_predictability = {};
let room_integrity = {};
let room_competence = {};
let times = 0;


// Total amount of Rounds for the game
const totalRoundTimes = 2;

// Total amount of Rounds for the training
const totalRoundTimesTraining = 5;

// Total amount of Rounds for the validation
const totalRoundTimesValidation = 8;
// Current amount of rounds for the training
let currentRoundTraining = 0;
let currentRoundTrainingTotal = 0;

let currentRoundValidation = 0;
let currentRoundValidationTotal = 0;
let numberUsers = 0;
// let smoothFinal = []
// let smoothAgentFinal = []

const url = "mongodb://localhost:27017";
// const uri = "mongodb+srv://gonzad5:Warcraft3dan@cluster0.qbahja0.mongodb.net/?retryWrites=true&w=majority";
const dbName = "synchromouse";
var mongoClient = undefined;
// MongoClient.connect(url, function(err, client) {
//     mongoClient = client;
//     console.log("Connected to database");
// });

// MongoClient.connect(uri, {useNewUrlParser: true}, function(err, client) {

//     if (err) {
//         return console.log('Unable to connect to database')
//     }
//     mongoClient = client;
//     console.log("Connected to database");
// });

// for (let i = 0; i < 50; i++) {
//     console.log(spline.at(i* 0.1));

// }
// console.log(spline)

app.use(express.static("public"));

// Open connection when a player connects.
io.on("connection", (socket) => {

  numberUsers++;
  console.log("a user connected", socket.id);
  console.log(`The number of users is: ${numberUsers}`)





  const startServer = (room) => {
    console.log("game begins in room " + room);
    room_score[room] = 0;
    // Initialization of scores.
    room_predictability[room] = 0;
    // room_integrity[room] = 0
    room_competence[room] = 0;
    // Return to the initial state.
    socket.emit("endGame", false);
  };

  const startTrainingServer = (room) => {
    console.log("The training begins in room " + room);
    socket.emit("endTraining", false);
    socket.emit("currentRoundTraining", currentRoundTraining);
  }

  const startValidationServer = (room) => {
    console.log("The validation begins in room " + room);
    socket.emit("endValidation", false);
    console.log(`The current round for test is: ${currentRoundValidation}`)
    socket.emit("currentRoundValidation", currentRoundValidation);
  }


  // Emits the begin event.
  // socket.emit("beginGame");

  // Opens connection when a person enters the experiment
  socket.on("join_room", (room) => {
    console.log(socket.id + " wants to join " + room);
    socket.join(room);
    // Possible future modification in terms of one player (human) per room.
    if (!(room in rooms)) {
      // Initialization of parameters and scores.
      rooms[room] = {};
      rooms_history[room] = {};
      room_score[room] = 0;
      // Measurements for each of the rooms.
      room_predictability[room] = 0;
      // room_integrity[room] = 0
      room_competence[room] = 0;
    }
    // Introduction of the initial position for the player with their rooms list and history.
    rooms[room][socket.id] = { x: 0, y: 0, rotation: 0 };
    rooms_history[room][socket.id] = [];
    // Emits location event to the particular room.
    socket.to(room).emit("location", socket.id, 0, 0, 0);
  });

  // When an admin wants to enter the room.
  socket.on("join_admin", (room) => {
    console.log(socket.id + " wants to join " + room + " as admin");
    socket.join(room);
  });

  let roundTime = 30000

  // When the validation begins.





  // When the training begins.
  socket.on("start-training", (room) => startTrainingServer(room));
  socket.on("start-validation", (room) => startValidationServer(room));

  socket.on("rest_end_training", (room) => {
    roundBeginningTraining = true;
    socket.emit("beginGameTraining", roundBeginningTraining);
    socket.to(room).emit("startTraining");
    if (mongoClient !== undefined) {
      const db = mongoClient.db(dbName);
      db.collection("round_begin").insert({ time: new Date(), room: room });
    }
  })

  socket.on("rest_end_validation", (room) => {
    roundBeginningValidation = true;
    socket.emit("beginGameValidation", roundBeginningValidation);
    socket.to(room).emit("startValidation");
    if (mongoClient !== undefined) {
      const db = mongoClient.db(dbName);
      db.collection("round_begin").insert({ time: new Date(), room: room });
    }
  })

  // FUNCTION THAT DEFINES WHAT HAPPENS AT THE END OF THE TRAINING ROUND

  socket.on("round_end_training", (room) => {
    currentRoundTraining++;
    currentRoundTrainingTotal++;
    console.log(currentRoundTraining)
    socket.emit("currentRoundTraining", currentRoundTraining)

    // WRITE THE SCORES OF THE PLAYER IN A JSON FILE.
    // let finalDataPlayer = JSON.stringify(dataPlayer);
    let finalDataPlayerPosition = JSON.stringify(dataPlayerPosition);
    let textFilePlayerPosition = "scores_player_training_position_" + socket.id + "_Round" + currentRoundTrainingTotal + ".json"
    // let textFilePlayer = "scores_player_training" + socket.id + "_Round" + currentRoundTrainingTotal + ".json";
    dataPlayerPosition = [];
    // fs.writeFile(textFilePlayer, finalDataPlayer, (err) => {
    //   if (err) {
    //     throw err;
    //   } else {
    //     console.log("successful upload");
    //   }
    //   console.log("JSON data training player is saved.");
    // });
    fs.writeFile(textFilePlayerPosition, finalDataPlayerPosition, (err) => {
      if (err) {
        throw err;
      } else {
        console.log("successful upload")
      }
      console.log("JSON data training player is saved.");
    })

    // WRITE THE SCORES OF THE AGENT IN A JSON FILE.
    // let finalDataAgent = JSON.stringify(dataAgent);
    let finalDataAgentPosition = JSON.stringify(dataAgentPosition);
    let textFileAgentPosition = "scores_agent_training_position_" + socket.id + "_Round" + currentRoundTrainingTotal + ".json";
    // let textFileAgent = "scores_agent_training" + socket.id + "_Round" + currentRoundTrainingTotal + ".json";
    dataAgentPosition = []
    // fs.writeFile(textFileAgent, finalDataAgent, (err) => {
    //   if (err) {
    //     throw err;
    //   } else {
    //     console.log("successful upload");
    //   }
    //   console.log("JSON data training agent is saved.");
    // });
    fs.writeFile(textFileAgentPosition, finalDataAgentPosition, (err) => {
      if (err) {
        throw err;
      } else {
        console.log("successful upload");
      }
      console.log("JSON data training agent is saved.");
    });

    let textFile
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



    if (currentRoundTraining >= totalRoundTimesTraining) {
      roundBeginningTraining = false;
      socket.emit("beginGameTraining", roundBeginningTraining);
      socket.emit("endTraining", true);
      console.log("We entered the end of the training.");

      currentRoundTraining = 0;
      currentRoundTrainingTotal = 0;




    } else {
      roundBeginningTraining = false;
      socket.emit("beginGameTraining", roundBeginningTraining);
      socket.emit("endTraining", false);
    }
  })

  // FUNCTION THAT DEFINES WHAT HAPPENS AT THE END OF THE VALIDATION ROUND

  socket.on("round_end_validation", (room) => {
    currentRoundValidation++;
    currentRoundValidationTotal++;
    console.log(`The current round in the validation is: ${currentRoundValidation}`)
    socket.emit("currentRoundValidation", currentRoundValidation)

    
    let finalDataPlayerPosition = JSON.stringify(dataPlayerPosition)
    let textFilePlayerPosition = "scores_player_experiment_position_" + socket.id + "_Round" + currentRoundValidationTotal + ".json"
    dataPlayerPosition = [];  
    fs.writeFile(textFilePlayerPosition, finalDataPlayerPosition, (err) => {
        if (err) {
          throw err;
        } else {
          console.log("successful upload");
        }
        console.log("JSON data experiment player is saved.");
      });

      // WRITE THE SCORES OF THE AGENT IN A JSON FILE.
      let finalDataAgentPosition = JSON.stringify(dataAgentPosition);
      let textFileAgentPosition = "scores_agent_experiment_position_" + socket.id + "_Round" + currentRoundValidationTotal + ".json"
      // let textFileAgent = "scores_agent_validation" + socket.id + "_Round" + currentRoundValidationTotal + ".json";
      dataAgentPosition = [];
      fs.writeFile(textFileAgentPosition, finalDataAgentPosition, (err) => {
        if (err) {
          throw err;
        } else {
          console.log("successful upload");
        }
        console.log("JSON data experiment agent is saved.");
      });

      fs.writeFile(textFileAgentPosition, finalDataAgentPosition, (err) => {
        if (err) {
          throw err;
        } else {
          console.log("successful upload");
        }
        console.log("JSON data experiment agent is saved.");
      });


    if (currentRoundValidation >= totalRoundTimesValidation) {
      roundBeginningValidation = false;
      socket.emit("beginGameValidation", roundBeginningValidation);
      socket.emit("endValidation", true);
      console.log("We entered the end of the validation.");
      currentRoundValidationTotal = 0;
      currentRoundValidation = 0;

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
    } else {
      roundBeginningValidation = false;
      socket.emit("beginGameValidation", roundBeginningValidation);
      socket.emit("endValidation", false);
    }
  })




  // When the game begins.
  socket.on("start", (room) => startServer(room));

  // FUNCTION OF THE END OF THE ROUND FOR THE DEMO GAME
  socket.on("rest_end", (room) => {
    console.log("Recibi rest_end");
    room_score[room] = 0;
    // Initialization of scores.
    room_predictability[room] = 0;
    // room_integrity[room] = 0
    room_competence[room] = 0;
    //Emit start when the countdown ends.
    roundBeginning = true;
    socket.emit("beginGame", roundBeginning);
    socket.to(room).emit("start");
    if (mongoClient !== undefined) {
      const db = mongoClient.db(dbName);
      db.collection("round_begin").insert({ time: new Date(), room: room });
    }
  });

  // FUNCTION THAT DEFINES WHAT HAPPENS AT THE END OF THE GAME WITH THE FILE CREATION

  socket.on("round_end", (room) => {
    times++;
    console.log(times)
    if (times >= totalRoundTimes) {
      roundBeginning = false;
      socket.emit("beginGame", roundBeginning);
      socket.emit("endGame", true);
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
    } else {
      roundBeginning = false;
      socket.emit("beginGame", roundBeginning);
      socket.emit("endGame", false);
    }
  });

  // socket.on('movementDecisionAgent', (room) => {

  // })

  // Definition of the location socket.

  // FUNCTION THAT GATHERS THE DATA OF THE AGENT EVERY FRAME
  socket.on("locationAgent",
    (room, x, y, rotation, differenceRotation, speedX, speedY, accelX, accelY, jerkX, jerkY) => {
      if (roundBeginning || roundBeginningTraining || roundBeginningValidation) {
        socket.to(room).emit("location", socket.id, x, y);
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


        let metricsAgent = {
          time: new Date(),
          nano: performance.now(),
          room: room,
          x: x,
          y: y,
          rotation: rotation,
          differenceRotation: differenceRotation,
        }
        dataAgentPosition.push(metricsAgent);
      }
    }
  );

  // FUNCTION TO CREATE A MOVEMENT PROFILE FOR THE AGENT (NOT FUNCTIONING)

  // socket.on("movementDecisionAgent", (room, maxSpeed, points) => {
  //   // io.to(room).emit('')
  //   if (roundBeginning) {
  //     const xs = [0, 2, maxSpeed];
  //     const ys = [0, 1, maxSpeed];

  //     const xs2 = [maxSpeed, 2, 0];
  //     const ys2 = [maxSpeed, 1, 0];

  //     // const splineAccel = new Spline(xs, ys);
  //     // const splineDecc = new Spline(xs2, ys2);

  //     let speedAcc = [];
  //     let speedDecc = [];

  //     // for (let i = 0; i < 50; i++) {
  //     //     console.log(splineDecc.at(i* 0.1));

  //     // }

  //     for (let i = 1; i < points + 1; i++) {
  //       // console.log(spline.at(i* 0.1));
  //       // speedAcc.push({ x: i - 1, y: splineAccel.at(i * 1) });
  //       // speedDecc.push({x: i, y: splineDecc.at(i * 0.8)})
  //     }

  //     // for (let index = 0; index < array.length; index++) {
  //     //     const element = array[index];

  //     // }

  //     // console.log('ENTERED')
  //     // console.log(speedAcc)
  //     timesAgentDec++;
  //     // console.log(timesAgentDec)
  //     // console.log(speedAcc)
  //     socket.emit("movementVelocityProfile", speedAcc, speedDecc);
  //   }
  // });

  // FUNCTION TO TAKE THE VALUES OF THE PLAYER EVERY FRAME
  socket.on(
    "locationPlayer",
    (room, x, y, rawX, rawY, rotation, differenceRotation, forceX, forceY, speedX, speedY, accelX, accelY, jerkX, jerkY) => {
      io.to(room).emit("locationPlayer", socket.id, x, y, rotation);
      // console.log("The position in x is: " + x)
      // console.log(`The registered position in x: ${x} and Position in Y: ${y}`)

      if (roundBeginning || roundBeginningTraining || roundBeginningValidation) {
        socket.to(room).emit("location", socket.id, x, y);
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
        let metricsPlayer = {
          time: new Date(),
          nano: performance.now(),
          room: room,
          x: x,
          y: y,
          rawX: rawX,
          rawY: rawY,
          rotation: rotation,
          differenceRotation: differenceRotation,
          forceX: forceX,
          forceY: forceY,
        }
        dataPlayerPosition.push(metricsPlayer);
      }

      if (!(room in rooms)) {
        rooms[room] = {};
        rooms_history[room] = {};
        room_score[room] = 0;
        // Initialization of scores.
        room_predictability[room] = 0;
        // room_integrity[room] = 0
        room_competence[room] = 0;
      }
      if (!(socket.id in rooms[room])) {
        rooms[room][socket.id] = { x: 0, y: 0, rotation: 0 };
        rooms_history[room][socket.id] = [];
      }
      rooms_history[room][socket.id].push({ x: x, y: y, rotation: rotation });
      rooms[room][socket.id] = { x: x, y: y, rotation: rotation };

      if (mongoClient !== undefined) {
        const db = mongoClient.db(dbName);
        db.collection("locations").insert({
          time: new Date(),
          room: room,
          socketId: socket.id,
          x: x,
          y: y,
          rotation: rotation,
        });
      }
    }
  );

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

  socket.on("disconnect", () => {
    console.log(socket.id + " disconnected");
    roundBeginning = false;
    for (room in rooms) {
      if (socket.id in rooms[room]) {
        delete rooms[room];
        delete rooms_history[room];
        io.to(room).emit("disconnected", socket.id);
      }
    }
  });
});

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

http.listen(port, function () {
  console.log(`listening on: ${port}`);
});
