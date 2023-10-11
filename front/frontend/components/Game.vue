<template>
	<main>
		<div>
			<h1>Game zone</h1>
			<canvas id="canvas" width="800" height="600"></canvas>
		</div>
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
	// Draw players in the zone
	game = (
		player1: (
			y: canvas.height/2 - PLAYER_HEIGHT/2
		),
		player2: (
			y: canvas.height/2 - PLAYER_HEIGHT/2
		),
		ball: (
			x: canvas.width /2,
			y: canvas.height/2,
			r: 5
			speed: {
				x: 2,
				y: 2
			}
		)
	)
	draw();
	play();
});

// Mouse move event
canvas.addEventListener('mousemove', player1Move);


// Ball animation
function play() {
	game.ball.x += game.ball.speed.x;
	game.ball.y += game.ball.speed.y;
	draw();
	player2Move();			// will change later

	requestAnimationFrame(play);
}

// Players movement
function player1Move(event) {
	var canvasLocation = canvas.getBoundingClientRect();
	var mouseLocation = event.clientY - canvasLocation.y;

	game.player1.y = mouseLocation - PLAYER_HEIGHT/2;
}

function player2Move() {
	game.player2.y += game.ball.speed.y * 0.85; // will change when backend will be linked for multiplayer tests, for now just a bot playing
}

</script>