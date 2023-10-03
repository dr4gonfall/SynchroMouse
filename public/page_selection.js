class PageSelection {
  pageSelection(socket) {
    

    // PAGE SELECTORS
    // const $mainMenu = document.querySelector("#main-menu-button");


    // VALIDATION EXPERIMENT SEQUENCE
    const $mainVExperiment = document.querySelector("#v-experiment-begin");
    const $validationExperimentInstructions = document.querySelector("#validation-instructions-button");
    const $validationExperimentPage = document.querySelector("#button-begin-validation-experiment")

    const $mainRExperiment = document.querySelector('#r-experiment-begin');
    const $realExperimentInstructions = document.querySelector("#real-experiment-instructions-button");
    const $realExperimentPage = document.querySelector('#button-begin-real-experiment');

    // REAL EXPERIMENT FUNCTIONS FOR MENUS

    function startRealExperimentInstructions() {
      toggleScreen("start-screen", false);
      toggleScreen("real-experiment-instructions-en-alt", true);
    }

    function startRealTrainingSessionInstructions() {
      toggleScreen("real-experiment-instructions-en-alt", false);
      toggleScreen("instructions-training-session-en-alt", true);
    }

    function startRealExperiment() {
      toggleScreen("training-session-debrief-alt", false);
      toggleScreen("real-experiment", true);
    }
    
    // CANVAS VALIDATION EXPERIMENT SELECTION

    

    // Validation Experiment Functions for Menus

    function startValidationExperimentInstructions() {
      toggleScreen("start-screen", false);
      toggleScreen("validation-instructions-en", true);
    }

    function startTrainingSessionInstructions() {
      toggleScreen("validation-instructions-en", false);
      toggleScreen("instructions-training-session-en", true);
    }


    // VALIDATION EXPERIMENT SESSION

    function startValidationExperiment() {
      toggleScreen("training-session-debrief", false);
      toggleScreen("validation-experiment", true);
    }

    // VALIDATION EXPERIMENT SEQUENCE

    // Go from main screen to the validation experiment instructions.
    // $mainVExperiment.addEventListener("click", (e) => {
    //   startValidationExperimentInstructions();
    // });
    // Go from the validation experiment instructions to the training session instructions.
    $validationExperimentInstructions.addEventListener("click", (e) => {
      startTrainingSessionInstructions()
    })
    
    // Go from the training debrief to the validation experiment.
    $validationExperimentPage.addEventListener("click", (e) => {
      console.log(`Is clicked`)
      startValidationExperiment();
    })

    // REAL EXPERIMENT SEQUENCE

    // Go from main screen to the real experiment instructions.
    $mainRExperiment.addEventListener("click", (e) => {
      startRealExperimentInstructions();
    })

    // Go from the real experiment instructions to the training session instructions.
    $realExperimentInstructions.addEventListener("click", (e) => {
      startRealTrainingSessionInstructions();
    })

    $realExperimentPage.addEventListener("click", (e) => {
      startRealExperiment();
    })

    // $simulationPage.addEventListener("click", (e) => {
    //   startSimulation();
    // })
    
  }
}
