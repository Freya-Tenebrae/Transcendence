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

//Draw the game zone
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
	
	// Draw ball
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
		)
	)
	draw();
});

</script>