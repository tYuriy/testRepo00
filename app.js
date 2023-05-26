var countdown = 10;
var isPaused = false;

let totalTimeMins = 20
let totalTimeSec = totalTimeMins * 60

let interval
let interval1
let interval2

const pauseButton = document.getElementById("pauseButton");
const title = document.getElementById('title')
const countdownDisplay = document.getElementById("countdown")
let isStarted = false
const startButton = document.getElementById("startButton")
const progress = document.getElementById('progress')
const progressText = document.getElementById('progress-text')

const period1 = 10
const period2 = 8

let exerciseTime = Math.ceil(totalTimeSec / (period1 + period2)) * (period1 + period2) + period1
let currentTime = 0

// get CSS variables values
const rootStyles = getComputedStyle(document.documentElement);
const primaryColor = rootStyles.getPropertyValue('--colorPrimary');
const secondaryColor = rootStyles.getPropertyValue('--colorPrimaryDark');

let progressBarFill = 0

function renderProgressColors(percent) {
  progressText.innerText = `${Math.min(percent, 99.9).toFixed(1)}%`
  progress.style.backgroundImage = `linear-gradient(to right, ${secondaryColor} ${percent}%, ${primaryColor} 0%)`
  progressText.style.backgroundImage = `linear-gradient(to right, ${primaryColor} ${percent}%, ${secondaryColor} 0%)`
}

let count = 0

startButton.addEventListener('click', () => {
  if (!isStarted) {
    isStarted = true
    runTimers()
    count++
  }
})


function pauseTimer() {
  isPaused = !isPaused;
  if (isPaused) {
      pauseButton.innerHTML = "Resume";
      clearInterval(interval);
      isStarted = false
  } else {
      pauseButton.innerHTML = "Pause";
      startTimer(countdown)
  }
}

function stopTimer() {
  console.log('stop');
  clearInterval(interval1);
  clearInterval(interval2);
  clearInterval(interval);
  isStarted = false
  countdownDisplay.classList.add('active')
  countdownDisplay.innerHTML = period1;
  progressText.innerText = '100.0'
  console.log('stop end');
}

function startTimer(seconds, callback) {
  if ('wakeLock' in navigator) {
    // Request a wake lock.
    navigator.wakeLock.request('screen').then(function(wakeLock) {
      // The wake lock has been acquired.
      console.log('Wake lock activated!');
    }).catch(function(error) {
      // The wake lock request has failed.
      console.error('Could not activate wake lock: ' + error);
    });
  } else {
    console.error('Wake lock not supported by this browser.');
  }
    let countdown = seconds;
    document.getElementById("countdown").innerHTML = countdown;
    interval = setInterval(() => {
        currentTime++;
        countdown--;
        renderProgressColors(currentTime / exerciseTime * 100)
        if (countdown <= 0) {
          document.getElementById("countdown").innerHTML = 0;
          clearInterval(interval);
          setTimeout(() => {
            if (callback) {
                callback();
            }
          }, 1000)
        } else {
            document.getElementById("countdown").innerHTML = countdown;
        }
    }, 1000);
    return interval; // Return interval ID for clearing later
}

function runTimers() {
  if(isStarted) {
    isStarted = true
    title.classList.add('pulse')
    title.innerText = 'PUUUUUSH!!!'
    title.style.fontWeight = 900;

    interval1 = startTimer(period1, () => {
      countdownDisplay.classList.remove('active')
      title.classList.remove('pulse')
      title.innerText = 'relax'
      title.style.fontWeight = 200;
      clearInterval(interval1);

      interval2 = startTimer(period2, () => {
        countdownDisplay.classList.add('active')
            clearInterval(interval2);

            // currentNumber++

            if (currentTime >= exerciseTime) {
              title.innerText = 'It is done!!!'
              console.log('stop block have to run');
              stopTimer();
            }
            runTimers(); // Launch the timer again
        });
    });
  }
}

