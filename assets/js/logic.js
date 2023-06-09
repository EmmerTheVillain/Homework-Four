// variables to keep track of quiz state
var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;

// variables to reference DOM elements
var questionsEl = document.getElementById('questions');
var timerEl = document.getElementById('time');
var choicesEl = document.getElementById('choices');
var submitBtn = document.getElementById('submit');
var startBtn = document.getElementById('start');
var initialsEl = document.getElementById('initials');
var feedbackEl = document.getElementById('feedback');

//sound effect variables
var sfxCorrect = new Audio('assets/sfx/correct.wav');
var sfxIncorrect = new Audio('assets/sfx/incorrect.wav');

function startQuiz() {
  // hide start screen
  var startScreenEl = document.getElementById('start-screen');
  startScreenEl.setAttribute('class', 'hide');

  // un-hide questions section
  questionsEl.removeAttribute('class');

  // start timer
  timerId = setInterval(clockTick, 1000);

  // show starting time
  timerEl.textContent = time;
//run getQuestion function
  getQuestion();
}

function getQuestion() {
  // get current question object from array
  var currentQuestion = questions[currentQuestionIndex];

  // update title with current question
  var titleEl = document.getElementById('question-title');
  titleEl.textContent = currentQuestion.title;

  // clear out old question choices
  choicesEl.innerHTML = '';

  // loop to create new choices
  for (var i = 0; i < currentQuestion.choices.length; i++) {
    // create new button for each choice
    var choice = currentQuestion.choices[i];
    var choiceNode = document.createElement('button');
    choiceNode.setAttribute('class', 'choice');
    choiceNode.setAttribute('value', choice);

    choiceNode.textContent = i + 1 + '. ' + choice;

    // display on the page
    choicesEl.appendChild(choiceNode);
  }
}
//function to handle timer and correct/incorrect choice options
function questionClick(event) {
  var buttonEl = event.target;

  // if the clicked element is not a choice button, do nothing.
  if (!buttonEl.matches('.choice')) {
    return;
  }

  // check if user guessed wrong
  if (buttonEl.value !== questions[currentQuestionIndex].answer) {
    // penalize time
    time -= 15;
    if(time < 0){
      time = 0;
    }
    // display new time on page
  timerEl.textContent = time;
    //play incorrect sound
  sfxIncorrect.play();
  //feedback text output
  feedbackEl.textContent = 'Incorrect! -15 Seconds!'
}else{
    //play correct sound
    sfxCorrect.play();
    //feedback text output
    feedbackEl.textContent = 'Correct!';
  }
  //unhide feedback
  feedbackEl.setAttribute('class', 'feedback');
  //rehide feedback after a second
  setTimeout(function() {
    feedbackEl.setAttribute('class', 'hide');
  }, 1000)
  // move to next question
  currentQuestionIndex++;

  // check if we've run out of time or questions 
  if (time <= 0 || currentQuestionIndex === questions.length) {
    //ends quiz
    quizEnd();
  } else {
    //get next question
    getQuestion();
  }
}

//function to end quiz and move to end screen
function quizEnd() {
  // stop timer
 clearInterval(timerId);
  // show end screen
  var endScreenEl = document.getElementById('end-screen');
  endScreenEl.removeAttribute('class');

  // show final score
  var finalScoreEl = document.getElementById('final-score');
  finalScoreEl.textContent = time;

  // hide questions section
  questionsEl.setAttribute('class', 'hide');
}
//time clock function
function clockTick() {
  // update time
  time--;
  // decrement the variable we are using to track time
  timerEl.textContent = time;
  // check if user ran out of time
  if (time <= 0) {
    quizEnd();
  }
}
//function to save highscore to local storage and move to highscore page
function saveHighscore() {
  // get value of input box
  var initials = initialsEl.value.trim();

  // make sure value wasn't empty
  if (initials !== '') {

    // sets highscore variable and parses saved scores from localstorage, or if not any, set to empty array
    var highscores =
      JSON.parse(window.localStorage.getItem('highscores')) || [];

    // format new score object for current user
    var newScore = {
      score: time,
      initials: initials,
    };

    // save to localstorage
    highscores.push(newScore);
    window.localStorage.setItem('highscores', JSON.stringify(highscores));

    // redirect to next page
    window.location.href = 'highscores.html';
  }
}

function checkForEnter(event) {
  //checks if button if highscore submit button is pressed and runs saveHighscore when it is
  if (event.key === 'Enter') {
    saveHighscore();
  }
}

// user clicks button to submit initials
submitBtn.onclick = saveHighscore;

// user clicks button to start quiz
startBtn.onclick = startQuiz;

// user clicks on element containing choices
choicesEl.onclick = questionClick;

initialsEl.onkeyup = checkForEnter;
