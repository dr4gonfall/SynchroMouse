class PageSelection {
  pageSelection(socket) {
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

    // PAGE SELECTORS
    const $mainMenu = document.querySelector("#main-menu-button");


    // VALIDATION EXPERIMENT SEQUENCE
    const $mainVExperiment = document.querySelector("#v-experiment-begin");
    const $validationExperimentInstructions = document.querySelector("#validation-instructions-button");
    const $trainingSessionExperiment = document.querySelector("#button-training-instructions-en")
    // const $trainingSessionEnd = document.querySelector("#button-training-session");
    const $validationExperimentPage = document.querySelector("#button-begin-validation-experiment")
    const $validationExperimentBegin = document.querySelector("#startValidationExperiment")


    // CANVAS VALIDATION EXPERIMENT SELECTION

    // // Training Canvas Definition
    // const canvasTraining = document.getElementById("training-game");
    // const ctxTraining = canvasTraining.getContext("2d");
    // // Training Canvas Dimensions
    // canvasTraining.width = 800;
    // canvasTraining.height = 500;
    // // Canvas Validation Experiment Definition
    // const canvasValidation = document.getElementById("canvas-validation-game");
    // const ctxValidation = canvasValidation.getContext("2d");
    // // Canvas Validation Experiment Dimensions
    // canvasValidation.width = 800;
    // canvasValidation.height = 500;

    // // Demo Canvas Definition
    // const canvas = document.getElementById("canvas-demo");
    // const ctx = canvas.getContext("2d");
    // // Demo Canvas Dimensions
    // canvas.width = 800;
    // canvas.height = 500;

    // Timers Definition

    // Training Session Timers Definition
    // let timerBetweenRoundsTraining = document.getElementById("time-training-prelim");
    // let timerRoundsTraining = document.getElementById("time-training-round");
    // // Training number of rounds
    // let roundNumber = 0;
    // // Validation Experiment Timers Definition
    // let timerBetweenRoundsValidation = document.getElementById("time-validation-prelim");
    // let timerRoundsValidation = document.getElementById("time-validation-round")


    // BUTTONS AND FORMS

    // Form that defines parameters for the demo.
    const $submitGameMode = document.querySelector("#form");
    const $startDemo = document.querySelector("#startNow");
    const $backButton = document.querySelector("#goBack");
    const $similarityM = document.querySelector("#similarityMeasure");
    const $distanceM = document.querySelector("#distanceMeasure");
    const $similarNoRotM = document.querySelector("#similarNoRotMeasure");

    let urlParams;
    let admin = false;

    let restIntervalId = undefined;
    let gameIntervalId = undefined;


    let timer = 0;

    // COUNTER FOR THE NUMBER OF ROUNDS
    let numberOfRounds = 0;

    // CANVAS DEFINITION FOR GAMES

    // MENU
    function startMenu() {
      toggleScreen("start-screen", false);
      toggleScreen("mode-screen", true);
    }

    // Validation Experiment Functions for Menus

    function startValidationExperimentInstructions() {
      toggleScreen("start-screen", false);
      toggleScreen("validation-instructions-en", true);
    }

    function startTrainingSessionInstructions() {
      toggleScreen("validation-instructions-en", false);
      toggleScreen("instructions-training-session-en", true);
    }

    function startTrainingDebrief() {
      toggleScreen("training-session", false);
      toggleScreen("training-session-debrief", true);
    }

    // TRAINING GAME

    // function startTrainingSession() {
    //   toggleScreen("instructions-training-session-en", false);
    //   toggleScreen("training-session", true);
    //   if (!document.pointerLockElement) {
    //     canvasTraining.focus();
    //     canvasTraining.requestPointerLock({
    //       unadjustedMovement: false,
    //     });
    //   }
    //   $trainingSessionEnd.disabled = true;
    //   newTraining();
    // }

    // From training to training debrief

    function startTrainingSessionDebrief() {
      toggleScreen("training-session", false);
      toggleScreen("training-session-debrief", true);
    }

    // VALIDATION EXPERIMENT SESSION

    function startValidationExperiment() {
      toggleScreen("training-session-debrief", false);
      toggleScreen("validation-experiment", true);
    }


    // function startDemo() {
    //   toggleScreen("mode-screen", false);
    //   toggleScreen("demo", true);

    //   socket.on("beginGame", function () {
    //     urlParams = new URLSearchParams(window.location.search);

    //     if (urlParams.has("room")) {
    //       room = urlParams.get("room");
    //       // Possibility of removing given new configuration.
    //       // Is the user entering an admin or a player.
    //       socket.emit("join_room", room);
    //     }
    //   });
    // }

    // function goBackMenu() {
    //   toggleScreen("mode-screen", true);
    //   toggleScreen("demo", false);
    // }

    // BUTTON CLICKING FOR MENUS

    // DEMO SEQUENCE

    // $backButton.addEventListener("click", goBackMenu);

    // $mainMenu.addEventListener("click", (e) => {
    //   startMenu();
    // });

    // VALIDATION EXPERIMENT SEQUENCE

    // Go from main screen to the validation experiment instructions.
    $mainVExperiment.addEventListener("click", (e) => {
      startValidationExperimentInstructions();
    });
    // Go from the validation experiment instructions to the training session instructions.
    $validationExperimentInstructions.addEventListener("click", (e) => {
      startTrainingSessionInstructions()
    })
    // Go from the training session instructions to the training session.
    // $trainingSessionExperiment.addEventListener("click", (e) => {
    //   startTrainingSession()
    // })
    // Go from the training session to the training debrief.
    // $trainingSessionEnd.addEventListener("click", (e) => {
    //   startTrainingSessionDebrief();
    // })
    // Go from the training debrief to the validation experiment.
    $validationExperimentPage.addEventListener("click", (e) => {
      console.log(`Is clicked`)
      startValidationExperiment();
    })
    // $validationExperimentBegin.addEventListener("click", (e) => {
    //   if (!document.pointerLockElement) {
    //     canvas.focus();
    //     canvas.requestPointerLock({
    //       unadjustedMovement: false,
    //     });
    //   }
    //   $validationExperimentBegin.disable = true
    //   newValidation();
    // })


    // $startDemo.addEventListener("click", () => {
    //   if (!document.pointerLockElement) {
    //     canvas.focus();
    //     canvas.requestPointerLock({
    //       unadjustedMovement: false,
    //     });
    //   }
    //   $startDemo.disable = true
    //   newGame();
    // });



    // GAME EXPERIMENT
    // BEGINNING OF THE OLD PROGRAM

    // $backButton.addEventListener("click", goBackMenu);

    // $mainMenu.addEventListener("click", (e) => {
    //   startMenu();
    // });

    let speedSelection = document.querySelector("#spdOptions");
    let levelCompetence = document.querySelector("#competenceOptions");
    let levelPredictability = document.querySelector("#predictabilityOptions");
    let measureCompetenceType = document.querySelector("#measureCompetence");
    let measurePredictabilityType = document.querySelector("#measurePredictability");


    // $submitGameMode.addEventListener("submit", (e) => {
    //   e.preventDefault();

    //   if (levelCompetence.options[levelCompetence.selectedIndex].value === "low") {
    //     // console.log('It works with comp')
    //     meanCompetence = 0.0;
    //     stddevCompetence = 300.0;
    //   } else if (
    //     levelCompetence.options[levelCompetence.selectedIndex].value === "high"
    //   ) {
    //     // console.log('It works with comp1')
    //     meanCompetence = 0.0;
    //     stddevCompetence = 100.0;
    //   } else if (
    //     levelCompetence.options[levelCompetence.selectedIndex].value === "none"
    //   ) {
    //     // console.log('It works with comp2')
    //   }

    //   if (
    //     levelPredictability.options[levelPredictability.selectedIndex].value ===
    //     "low"
    //   ) {
    //     // console.log('It works with pred')
    //     meanPredictability = 0.0;
    //     stddevPredRad = Math.PI;
    //   } else if (
    //     levelPredictability.options[levelPredictability.selectedIndex].value ===
    //     "high"
    //   ) {
    //     // console.log('It works with pred1')
    //     meanPredictability = 0.0;
    //     stddevPredRad = Math.PI / 4;
    //   } else if (
    //     levelPredictability.options[levelPredictability.selectedIndex].value ===
    //     "none"
    //   ) {
    //     // console.log('It works with pred2')
    //   }

    //   if (
    //     measureCompetenceType.options[measureCompetenceType.selectedIndex].value ===
    //     "version1"
    //   ) {
    //     // console.log('It works with comp measure')
    //   }

    //   if (
    //     measurePredictabilityType.options[measurePredictabilityType.selectedIndex]
    //       .value === "version1"
    //   ) {
    //     // console.log('It works with comp measure')
    //   }
    //   startDemo();
    // });

  }
}
