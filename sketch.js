let coords = [];
let state = {
  colorMode: 'white',
  curve1: [],
  curve2: [],
  score: 0,
  timer: 10,
  gameOver: false,
  showable: true,
  highScore: 0
};

function setup() {
  initialize = () => {
    canvas = createCanvas(windowWidth, windowHeight);

    state.showable = true;
    coords = [];
    state.showable = true;
    state.gameOver = false;
    state.colorMode = 'white';
    state.curve1 = [];
    state.curve2 = [];
    state.timer = 10;
    timerCountdown(true, 1000);
    setTimeout(() => {
      state.showable = false;
    }, 2000);

    newCoords = () => {
      let x, y, randColor;
      for (let i = 0; i < 4; i++) {
        x = Math.floor(random(90, windowWidth - 45));
        y = Math.floor(random(90, windowHeight - 45));
        randColor = color(random(0, 255), random(0, 255), random(0, 255));
        coords.push({
          x: x,
          y: y,
          color: randColor,
          selected: false,
          pairable: false
        });
      }
      return coords;
    };
    coords = newCoords();
  };
  initialize();
}

function draw() {
  noStroke();
  noFill();
  if (state.colorMode === 'white') {
    background(255, 255, 255);
    strokeWeight(1);
    stroke(0);
    textSize(30);
    text(`Score: ${state.score}`, 10, 30);
    text(`High Score: ${state.highScore}`, 400, 30);
    text(`Timer: ${state.timer}`, 200, 30);
  } else {
    background(0);
    strokeWeight(1);
    stroke(255, 255, 255);
    textSize(30);
    text(`Score: ${state.score}`, 10, 30);
    text(`High Score: ${state.highScore}`, 400, 30);
    text(`Timer: ${state.timer}`, 200, 30);
  }

  strokeWeight(3);

  if (state.curve1.length) {
    curve(...state.curve1);
  }
  if (state.curve2.length) {
    bezier(...state.curve2);
  }
  noStroke();
  noFill();

  for (coordinate of coords) {
    if (
      !coordinate['color'] &&
      state.colorMode === 'white' &&
      coordinate['selected']
    ) {
      let black = color(0);
      fill(black);
    } else if (
      !coordinate['color'] &&
      state.colorMode === 'dark' &&
      coordinate['selected']
    ) {
      let white = color(255, 255, 255);
      fill(white);
    } else if (state.showable) {
      fill(coordinate['color']);
    } else {
      noFill();
    }

    circle(coordinate['x'], coordinate['y'], 90);
  }

  if (state.timer === 0) {
    state.gameOver = true;
    stroke(150, 255, 255);
    fill(150, 255, 255);
    textSize(30);
    text(`Press Any Key To Restart`, windowWidth / 2 - 150, 30);
    textSize(40);
    text('GAME OVER', windowWidth / 2 - 100, 200);
    noLoop();
  }

  if (state.curve2.length && state.curve1.length) {
    stroke(150, 255, 255);
    fill(150, 255, 255);
    textSize(40);
    text(`Great job!`, windowWidth / 2 - 150, 200);
  }
}

function timerCountdown(on, time) {
  if (on) {
    timer = setInterval(() => {
      state.timer--;
    }, time);
  } else clearInterval(timer);
}

function mousePressed() {
  if (!state.showable) {
    for (coordinate of coords) {
      if (
        Math.abs(coordinate['x'] - mouseX) < 45 &&
        Math.abs(coordinate['y'] - mouseY) < 45 &&
        coordinate['selected'] === false
      ) {
        coordinate['selected'] = true;
        coordinate['color'] = false;
        coordinate['pairable'] = true;
        checkForPairs(coordinate);
      }
    }
  }
  
  if (state.curve2.length && state.curve1.length) {
    state.score++;
    if (state.score > state.highScore) {
      state.highScore = state.score;
    }
    timerCountdown(false, 1000);
    setTimeout(() => {
      initialize();
    }, 1000);
  }

  if (state.colorMode === 'white') {
    state.colorMode = 'dark';
  } else {
    state.colorMode = 'white';
  }
}

function checkForPairs(coord1) {
  for (coordinate of coords) {
    if (
      coordinate['pairable'] &&
      coordinate['x'] !== coord1['x'] &&
      coordinate['y'] !== coord1['y']
    ) {
      connectPairs(coord1, coordinate);
    }
  }
}

function connectPairs(coord1, coord2) {
  let coordsToDraw = [];
  let coordsNotPairable = [];
  for (coordinate of coords) {
    if (!coordinate['pairable']) {
      coordsNotPairable.push(coordinate);
    }
  }

  coord1['pairable'] = false;
  coord2['pairable'] = false;
  if (state.curve1.length) {
    coordsToDraw.push(
      coord1['x'],
      coord1['y'],
      coordsNotPairable[0]['x'],
      coordsNotPairable[0]['y'],
      coordsNotPairable[1]['x'],
      coordsNotPairable[1]['y'],
      coord2['x'],
      coord2['y']
    );
    state.curve2 = coordsToDraw;
  } else {
    coordsToDraw.push(
      coordsNotPairable[0]['x'],
      coordsNotPairable[0]['y'],
      coord1['x'],
      coord1['y'],
      coord2['x'],
      coord2['y'],
      coordsNotPairable[1]['x'],
      coordsNotPairable[1]['y']
    );

    state.curve1 = coordsToDraw;
  }
}

function keyPressed() {
  if (state.gameOver) {
    gameOver = false;
    state.score = 0;
    timerCountdown(false, 1000);
    initialize();
    loop();
  }
}
