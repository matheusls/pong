var canvas;
var canvasContext;

//ball related variables
var ballX = 50;
var ballSpeedX = 10;
var ballY = 50;
var ballSpeedY = 4;

//paddle related variables and constants
var playerPaddleY = 250;
var computerPaddleY = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;

//scores related variables and constants
var playerScore = 0;
var computerScore = 0;
const WINNING_SCORE = 2;
var showingWinScreen = false;

function getMousePosition(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;

    return {
        x : mouseX,
        y : mouseY
    };
}

function handleMouseClick(evt) {
    if(showingWinScreen) {
        playerScore = 0;
        computerScore = 0;
        showingWinScreen = false;
    }
}

window.onload = function () {
    console.log("Hello World!");
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    var framesPerSecond = 30;
    setInterval(function() {
        move();
        draw();
    }, 1000/framesPerSecond);

    canvas.addEventListener('mousedown', handleMouseClick);

    canvas.addEventListener('mousemove',
        function(evt) {
            var mousePosition = getMousePosition(evt);
            playerPaddleY = mousePosition.y-(PADDLE_HEIGHT/2);
    });
}

function ballReset() {
    if(playerScore >= WINNING_SCORE || computerScore >= WINNING_SCORE) {
        showingWinScreen = true;
    }

    ballSpeedX = 10;
    ballSpeedY = 4;
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}

function computerMovement() {
    var computerPaddleCenter = computerPaddleY + (PADDLE_HEIGHT/2);

    if(computerPaddleCenter < ballY - 35) {
        computerPaddleY += 6;
    }else {
        if(computerPaddleCenter > ballY + 35) {
            computerPaddleY -= 6;
        }
    }
}

function move() {
    if(showingWinScreen) {
        return;
    }

    computerMovement();

    ballX += ballSpeedX;


    if(ballX <= 0) {
        if(ballY > playerPaddleY && ballY < playerPaddleY+PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;

            var deltaY = ballY - (playerPaddleY + (PADDLE_HEIGHT/2));

            ballSpeedY = deltaY * 0.35;
        }else {
            computerScore++; // MUST BE BEFORE ballReset()
            ballReset();
        }
    }

    if(ballX >= canvas.width) {
        if(ballY > computerPaddleY && ballY < computerPaddleY+PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;
        }else {
            playerScore++; // MUST BE BEFORE ballReset()
            ballReset();
        }
    }

    ballY += ballSpeedY;

    if(ballY >= canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    if(ballY <= 0) {
        ballSpeedY = -ballSpeedY;
    }
}

function draw() {
    //drawing the background
    stylingRect(0, 0, canvas.width, canvas.height, 'black');

    if(showingWinScreen) {
        if(playerScore >= WINNING_SCORE) {
            canvasContext.fillStyle = 'white';
            canvasContext.font = 'bold 3em Arial';
            canvasContext.fillText("YOU WIN!", 300, 100, 300);
        }else if(computerScore >= WINNING_SCORE) {
            canvasContext.fillStyle = 'white';
            canvasContext.font = 'bold 3em Arial';
            canvasContext.fillText("YOU LOSE!", 300, 100, 300);
        }

        canvasContext.fillStyle = 'white';
        canvasContext.font = 'bold 1.5em Arial';
        canvasContext.fillText("Click to continue", 325, 550, 300);

        return;
    }

    //drawing the player paddle
    stylingRect(0, playerPaddleY, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');

    //drawing the computer paddle
    stylingRect((canvas.width - PADDLE_THICKNESS), computerPaddleY, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');

    //drawing the ball
    drawCircle(ballX, ballY, 10, 'white');

    //putting the scores on screen
    canvasContext.font = 'bold 1.5em Arial';
    canvasContext.fillText(playerScore, 100, 100, 50);
    canvasContext.fillText(computerScore, canvas.width-100, 100);

    for(var i = 0; i <= canvas.height; i += 40) {
        stylingRect(canvas.width/2-1, i, 2, 20, 'white');
    }
}

function drawCircle(centerX, centerY, radius, color) {
    canvasContext.fillStyle = color;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    canvasContext.fill();
}

function stylingRect(leftX, topY, width, height, color) {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(leftX, topY, width, height);
}