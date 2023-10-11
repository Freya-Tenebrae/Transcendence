<template>
	<main role="game">
		<div>
			<h1>Game zone</h1>
			<p>Player 1 : <em id= "player1-score">0</em> - Player 2 : <em id="player2-score">0</em>
			</p>
			<!-- temporary : start and stop the game -->
			<li>
				<button id="start-game">Start game</button>
			</li>
			<li>
				<button id="stop-game">Stop game</button>
			</li>
		</div>
		<canvas id="canvas" width="800" height="600"></canvas>
	</main>
</template>

<script setup lang="ts">

var canvas;
var game;

const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 5;

//Draw the game zone : https://www.alsacreations.com/tuto/lire/1484-introduction.html
function draw() {
	var context = canvas.getContext('2d');
	
	context.fillStyle = 'purple';
	context.fillRect(0, 0, context.width, context.height);
	
	// Draw middle line in the game zone
	context.strokeStyle = 'yellow';
	context.beginPath();
	context.moveTo(canvas.width / 2, 0);
	context.lineTo(canvas.width / 2, canvas.height);
	context.stroke();
	
	// Draw players
	context.fillStyle = 'white';
	context.fillRect(0, game.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
	context.fillRect(canvas.width - PLAYER_WIDTH, game.computer.y, PLAYER_WIDTH, PLAYER_HEIGHT);
	
	// Draw ball, maybe replaced later
	context.beginPath();
	context.fillStyle = 'white';
	context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
	context.fill();
}

//Game loader in the page : https://developer.mozilla.org/fr/docs/Web/API/Document/DOMContentLoaded_event
document.addEventListener('DOMContentLoaded', function () {
	canvas.document.getElementById('canvas');
	// Draw players & ball in the zone
	game = {
		player1: {
			y: canvas.height / 2 - PLAYER_HEIGHT / 2
		},
		player2: {
			y: canvas.height / 2 - PLAYER_HEIGHT / 2
		},
		ball: {
			x: canvas.width / 2,
			y: canvas.height / 2,
			r: 5,
			speed: {
				x: 2,
				y: 2
			}
		}
	}
	draw();
	play();
});

// Mouse move event
canvas.addEventListener('mousemove', player1Move);


// Ball animation
function play() {
	draw();

	player2Move();			// will change later
	ballMove();

	requestAnimationFrame(play);
}

// Players movements + collision
function player1Move(event) {
	var canvasLocation = canvas.getBoundingClientRect();
	var mouseLocation = event.clientY - canvasLocation.y;

	if (mouseLocation < PLAYER_HEIGHT/2)
		game.player1.y = 0;
	else if (mouseLocation > canvas.height - PLAYER_HEIGHT/2)
		game.player1.y = canvas.height - PLAYER_HEIGHT;
	else
		game.player1.y = mouseLocation - PLAYER_HEIGHT/2;
}

function player2Move() {
	game.player2.y += game.ball.speed.y * 0.85; // will change when backend will be linked for multiplayer tests, for now just a bot playing
}

// collide function when ball collides with the players
function collide(player) {
	// When the player doesn't hit the ball
	if (game.ball.y < player.y || game.ball.y > player.y + PLAYER_HEIGHT) {
		// reset the ball and the players position to the center
		game.ball.x = canvas.width / 2;
		game.ball.y = canvas.height / 2;
		game.player1.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
		game.player2.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
		// reset the ball's speed
		game.ball.speed.x = 2;
	}
	else {
		// Increase ball's speed & change its direction
		game.ball.speed.x *= -1.2;
		changeDirection(player.y);
	}
}

// Ball movement + collision
function ballMove() {
	// rebounds on the top & bottom of the canvas
	if (game.ball.y > canvas.height || game.ball.y < 0)
		game.ball.speed.y *= -1;
	// rebounds at players collission
	if (game.ball.x > canvas.width - PLAYER_WIDTH)
		collide(game.player2);
	else if (game.ball.x < PLAYER_WIDTH)
		collide(game.player1);
	game.ball.x += game.ball.speed.x;
	game.ball.y += game.ball.speed.y;
}

// ball trajectory changer
function changeDirection(playerPosition) {
	var impact = game.ball.y - playerPosition - PLAYER_HEIGHT / 2;
	var ratio = 100 / (PLAYER_HEIGHT / 2);
	//"randomizer" to get a value betwwen 0 and 10 for the y speed of the ball, 0 if it hits the center of the player, 10 if it hits the borders
	game.ball.speed.y = Math.round(impact * ratio / 10);
}

</script>