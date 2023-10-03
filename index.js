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
let roundBeginningRExperiment = false;
// let totalGameTime = 30000;
// let playing = false
// let playerPositionsTest = []
// let agentPositionsTest = []
// let agent2PositionsTest= []
let dataPlayer = [];
let dataPlayerPosition = [];
let dataAgent = [];
let dataAgentPosition = [];
let arrayVariations = [];

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

// Total amount of Rounds for the Simulation
const totalRoundTimesSimulation = 8;

// Total amount of Rounds for the Experiment
const totalRoundTimesRExperiment = 8;

// Current amount of rounds for the training
let currentRoundTraining = 0;
let currentRoundTrainingTotal = 0;

let currentRoundValidation = 0;
let currentRoundValidationTotal = 0;

let currentRoundSimulation = 0;
let currentRoundSimulationTotal = 0;

let currentRoundRExperiment = 0;
let currentRoundRExperimentTotal = 0;

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

  const startSimulationServer = (room) => {
    console.log('The simulation begins in room ' + room);
    socket.emit("endSimulation", false);
    socket.emit("currentRoundSimulation", currentRoundSimulation)
  }

  const startRExperimentServer = (room) => {
    console.log('The experiment begins in room ' + room);
    socket.emit("endRExperiment", false);
    socket.emit("currentRoundRExperiment", currentRoundRExperiment)
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
  socket.on("start-simulation", (room) => startSimulationServer(room));
  socket.on("start-experiment", (room) => startRExperimentServer(room));

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

  socket.on("rest-end-simulation", (room) => {
    roundBeginningSimulation = true;
    socket.emit("beginGameSimulation", roundBeginningSimulation);
    socket.to(room).emit("startSimulation");
    if (mongoClient !== undefined) {
      const db = mongoClient.db(dbName);
      db.collection("round_begin").insert({ time: new Date(), room: room});
    }
  })

  socket.on("rest_end_real_experiment", (room) => {
    roundBeginningRExperiment = true;
    socket.emit("beginGameRExperiment", roundBeginningRExperiment);
    socket.to(room).emit("startRExperiment");
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

      
    } else {
      roundBeginningValidation = false;
      socket.emit("beginGameValidation", roundBeginningValidation);
      socket.emit("endValidation", false);
    }
  })


  socket.on("round_end_real_experiment", (room) => {
    currentRoundRExperiment++;
    currentRoundRExperimentTotal++;
    console.log(`The current round in the experiment is: ${currentRoundRExperiment}`)
    socket.emit("currentRoundRExperiment", currentRoundRExperiment)

    
    let finalDataPlayerPosition = JSON.stringify(dataPlayerPosition)
    let textFilePlayerPosition = "scores_player_experiment_position_" + socket.id + "_Round" + currentRoundRExperimentTotal + ".json"
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
      let textFileAgentPosition = "scores_agent_experiment_position_" + socket.id + "_Round" + currentRoundRExperimentTotal + ".json"
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

      // fs.writeFile(textFileAgentPosition, finalDataAgentPosition, (err) => {
      //   if (err) {
      //     throw err;
      //   } else {
      //     console.log("successful upload");
      //   }
      //   console.log("JSON data experiment agent is saved.");
      // });


    if (currentRoundRExperiment >= totalRoundTimesRExperiment) {
      roundBeginningRExperiment = false;
      socket.emit("beginGameRExperiment", roundBeginningRExperiment);
      socket.emit("endRExperiment", true);
      console.log("We entered the end of the experiment.");
      currentRoundRExperimentTotal = 0;
      currentRoundRExperiment = 0;
      let dataVariations = JSON.stringify(arrayVariations);
      let textFileVariations = "variations_participant_" + socket.id + ".json"
      fs.writeFile(textFileVariations, dataVariations, (err) => {
        if (err) {
          throw err;
        } else {
          console.log("successful upload");
        }
        console.log("JSON data experiment for variations is saved")
      })

    } else {
      roundBeginningRExperiment = false;
      socket.emit("beginGameRExperiment", roundBeginningRExperiment);
      socket.emit("endRExperiment", false);
    }
  })



    // FUNCTION THAT DEFINES WHAT HAPPENS AT THE END OF THE SIMULATION ROUND

  // socket.on("round_end_simulation", (room) => {
  //     currentRoundSimulation++;
  //     currentRoundSimulationTotal++;
  //     console.log(`The current round in the simulation is: ${currentRoundSimulation}`)
  //     socket.emit("currentRoundSimulation", currentRoundSimulation)
  
      
  //     let finalDataAgentBotPosition = JSON.stringify(dataAgentBotPosition)
  //     let textFileAgentBotPosition = "scores_agentBot_simulation_position_" + socket.id + "_Round" + currentRoundSimulationTotal + ".json"
  //     dataAgentBotPosition = [];  
  //     fs.writeFile(textFileAgentBotPosition, finalDataAgentBotPosition, (err) => {
  //         if (err) {
  //           throw err;
  //         } else {
  //           console.log("successful upload");
  //         }
  //         console.log("JSON data experiment player is saved.");
  //       });
  
  //       // WRITE THE SCORES OF THE AGENT IN A JSON FILE.
  //       let finalDataAgentPosition = JSON.stringify(dataAgentBotPosition);
  //       let textFileAgentPosition = "scores_agent_simulation_position_" + socket.id + "_Round" + currentRoundSimulationTotal + ".json"
  //       // let textFileAgent = "scores_agent_validation" + socket.id + "_Round" + currentRoundValidationTotal + ".json";
  //       dataAgentBotPosition = [];
  //       fs.writeFile(textFileAgentPosition, finalDataAgentPosition, (err) => {
  //         if (err) {
  //           throw err;
  //         } else {
  //           console.log("successful upload");
  //         }
  //         console.log("JSON data experiment agent is saved.");
  //       });
  
  //       fs.writeFile(textFileAgentPosition, finalDataAgentPosition, (err) => {
  //         if (err) {
  //           throw err;
  //         } else {
  //           console.log("successful upload");
  //         }
  //         console.log("JSON data experiment agent is saved.");
  //       });
  
  
  //     if (currentRoundSimulation >= totalRoundTimesSimulation) {
  //       roundBeginningSimulation = false;
  //       socket.emit("beginGameSimulation", roundBeginningSimulation);
  //       socket.emit("endSimulation", true);
  //       console.log("We entered the end of the simulation.");
  //       currentRoundSimulationTotal = 0;
  //       currentRoundSimulation = 0;
  
  //     } else {
  //       roundBeginningSimulation = false;
  //       socket.emit("beginGameSimulation", roundBeginningSimulation);
  //       socket.emit("endSimulation", false);
  //     }
  // })




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
  socket.on("locationAgentBot",
    (room, x, y, rotation, differenceRotation, speedX, speedY, accelX, accelY, jerkX, jerkY) => {
      if (roundBeginning || roundBeginningTraining || roundBeginningValidation) {
        socket.to(room).emit("location", socket.id, x, y);

        let metricsAgentBot = {
          time: new Date(),
          nano: performance.now(),
          room: room,
          x: x,
          y: y,
          rotation: rotation,
          differenceRotation: differenceRotation,
        }
        dataAgentBotPosition.push(metricsAgentBot);
      }
    }
  );

  // FUNCTION OF RECEIVING THE VARIATIONS.
  socket.on("variationDefinition", (variations) => {
    arrayVariations = variations;
  })

  // FUNCTION THAT GATHERS THE DATA OF THE AGENT EVERY FRAME
  socket.on("locationAgent",
    (room, x, y, rotation, differenceRotation, speedX, speedY, accelX, accelY, jerkX, jerkY) => {
      if (roundBeginning || roundBeginningTraining || roundBeginningValidation || roundBeginningRExperiment) {
        socket.to(room).emit("location", socket.id, x, y);
        


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

  

  // FUNCTION TO TAKE THE VALUES OF THE PLAYER EVERY FRAME
  socket.on(
    "locationPlayer",
    (room, x, y, rawX, rawY, rotation, differenceRotation, forceX, forceY, speedX, speedY, accelX, accelY, jerkX, jerkY) => {
      io.to(room).emit("locationPlayer", socket.id, x, y, rotation);
      // console.log("The position in x is: " + x)
      // console.log(`The registered position in x: ${x} and Position in Y: ${y}`)

      if (roundBeginning || roundBeginningTraining || roundBeginningValidation || roundBeginningRExperiment) {
        socket.to(room).emit("location", socket.id, x, y);
        
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



http.listen(port, function () {
  console.log(`listening on: ${port}`);
});
