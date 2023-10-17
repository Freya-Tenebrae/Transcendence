<template>
  <div>
    <title>Cyberpong 2042</title>
    <div class="header">
    <img src="../assets/icons/home.svg" alt="Home-Icon" class="icon-home" @click="redirectToHome" />
    <div class="icon-container">
      <img src="../assets/icons/login.svg" alt="Login-Icon" class="icon-login" @click="showLoginModal = true" />
      <img src="../assets/icons/lock.svg" alt="Register-Icon" class="icon-register" @click="showRegisterModal = true" />
    </div>
  </div>
    
    <!-- Formulaire de connexion -->
    <div v-if="showLoginModal" class="custom-modal-background">
      <div class="custom-modal">
        <div class="custom-modal-header">
          <h5>Connexion</h5>
          <span @click="showLoginModal = false" class="custom-modal-close">&times;</span>
        </div>
        <div class="custom-modal-body">
          <!-- Contenu du formulaire connexion -->
          <form>
            <div class="form-group">
              <label for="email">Adresse e-mail </label>
              <input type="email" class="form-control" id="email" placeholder="Entrez votre adresse e-mail">
            </div>
            <div class="form-group">
              <label for="password">Mot de passe </label>
              <input type="password" class="form-control" id="password" placeholder="Entrez votre mot de passe">
            </div>
          </form>
        </div>
        <div class="custom-modal-footer">
          <button type="button" class="btn btn-primary" @click="showLoginModal = false">Se connecter</button>
          <img src="../assets/icons/42.svg" alt="Register-Icon" class="icon-register" @click="connectWith42" />
        </div>
      </div>
    </div>
      <!-- Fin du formulaire de connexion -->

  <div v-if="showRegisterModal" class="custom-modal-background">
      <div class="custom-modal">
        <div class="custom-modal-header">
          <h5>Inscription</h5>
          <span @click="showRegisterModal = false" class="custom-modal-close">&times;</span>
        </div>
        <div class="custom-modal-body">
          <!-- Contenu du formulaire d'inscription -->
          <form>
            <div class="form-group">
              <label for="register-email">Adresse e-mail</label>
              <input type="email" class="form-control" id="register-email" placeholder="Entrez votre adresse e-mail">
            </div>
            <div class="form-group">
              <label for="register-password">Mot de passe</label>
              <input type="password" class="form-control" id="register-password" placeholder="Entrez votre mot de passe">
            </div>
          </form>
        </div>
        <div class="custom-modal-footer">
          <button type="button" class="btn btn-primary" @click="showRegisterModal = false">S'inscrire</button>
        </div>
      </div>
    </div>
  </div>
  <!-- Temporaire : sera remplacé par la zone de score et des joueurs -->
  <h1 class="page-header"> GAME ZONE </h1>
  <p class="page-header"> Player 1 > 0 | 0 &lt Player 2</p>
  <canvas id="score-zone" width="640" height="120" class="player_score_zone"></canvas>
  <canvas id="canvas" width="640" height="480" class ="game-zone"></canvas>
    <!-- Fin du formulaire d'inscription -->
</template>

<script>
import axios from '../node_modules/axios';
export default {
  name: 'HomePage',
  data() {
    return {
      showLoginModal: false,
      showRegisterModal: false,
    };
  },
  mounted() {
    // Get the DPR and size of the canvas
    const dpr = window.devicePixelRatio;
    const rect = canvas.getBoundingClientRect();

    // Set the "actual" size of the canvas
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    var game = {
      player: {
        y: 0,
        score: 0
      },
      computer: {
        y: 0,
        score: 0
      },
      ball:{
        x: 0,
        y: 0,
        r: 5,
        speed: {
          x: 1.2,  //provisoire
          y: 1.2 //provisoire
        }
      }
    };

    this.score(game); //doesn't work properly, need checking
    this.draw_field();
    //this.computerMove(game);
    this.play(game); //doesn't work properly, need checking
  },
  methods: {
    redirectToHome() {
      window.location.reload();
    },
    connectWith42() {
      // Redirigez l'utilisateur vers la page d'authentification de 42
      const clientID = 'u-s4t2ud-953c08a4bf98abe8fd58ab07f5eeeaa867dbee781c748db3d0d45fd68e666727'; // client ID
      const redirectURI = 'http://localhost:2002/'; // URL de redirection
      const responseType = 'code';

      const authURL = `https://api.intra.42.fr/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=${responseType}`;

      window.location.href = authURL;
    },
    draw_field() {
      const dpr = window.devicePixelRatio;
      var context = canvas.getContext('2d');
      // Scale the context to ensure correct drawing operations
      context.scale(dpr, dpr);
      // Draw field
      context.fillStyle = 'purple';
      context.fillRect(0, 0, canvas.width, canvas.height);
      // Draw middle line
      context.strokeStyle = 'white';
      context.beginPath();
      context.moveTo(canvas.width/2, 0);
      context.lineTo(canvas.width/2, canvas.height);
      context.stroke();
      context.save(); // save the line and canvas position
      context.translate(canvas.width / 2, canvas.height / 2); // change the origin of the canvas x & y
    },
    draw(game){
      const dpr = window.devicePixelRatio;
      var context = canvas.getContext('2d');
      // Scale the context to ensure correct drawing operations
      context.scale(dpr, dpr);

      // var anim;

      // N.B: (canvas.width /2, canvas.height / 2) should be defined as the new (0,0)
      // and canvas.width /2, canvas.height / 2 should be the new unit (+1,0, +1,0) to match the backend unit method
      const PLAYER_HEIGHT = 100;
      const PLAYER_WIDTH = 5;
      const MAX_SPEED = 12;
      const FIELD_HEIGHT_LEN = canvas.height/2; //= 1.0 in height length
      const FIELD_WIDTH_LEN = canvas.width/2; //= 1.0 in width length

      // Draw players
      context.fillStyle = 'blue';
      context.fillRect(-FIELD_WIDTH_LEN, game.player.y, PLAYER_WIDTH, -PLAYER_HEIGHT/2);
      context.fillRect(-FIELD_WIDTH_LEN, game.player.y, PLAYER_WIDTH, PLAYER_HEIGHT/2);

      context.fillStyle = 'red';
      context.fillRect(FIELD_WIDTH_LEN, game.computer.y, -PLAYER_WIDTH, -PLAYER_HEIGHT/2);
      context.fillRect(FIELD_WIDTH_LEN, game.computer.y, -PLAYER_WIDTH, PLAYER_HEIGHT/2);

      // Draw ball
      context.beginPath();
      context.fillStyle = 'yellow';
      context.arc(game.ball.x, game.ball.y, 5, 0, Math.PI * 2, false);
      context.fill();
    },
    //change direction function
    changeDirection(game, playerPosition) {
      const PLAYER_HEIGHT = 100;
      var impact = game.ball.y - playerPosition - PLAYER_HEIGHT/2;
      var ratio = 100 / (PLAYER_HEIGHT / 2); // default height is 100, so ratio = 2
      
      game.ball.speed.y *= Math.round(impact * ratio / 10);
    },
    // collision function
    collide(game, player) {
      const PLAYER_HEIGHT = 100;
      
      if (game.ball.y < player.y - PLAYER_HEIGHT / 2 || game.ball.y > player.y + PLAYER_HEIGHT / 2 ) {
        //reset the ball and the players to the center
        game.ball.x = 0;
        game.ball.y = 0;
        game.player.y = 0;
        game.computer.y = 0;
        //reset speed
        game.ball.speed.x = 1.2;
      }
      else {
        //increase the speed (to change) + change its direction
        game.ball.speed.x *= -1.2;
        this.changeDirection(game, player.y);
      }
    },
    //change/show the game scores
    score(game){  // temporaire : il faut le mettre dans draw surement
      const dpr = window.devicePixelRatio;
      // Scale the context to ensure correct drawing operations
      var context = canvas.getContext('2d');
      context.scale(dpr, dpr);
      const FIELD_HEIGHT_LEN = canvas.height/2; //= 1.0 in height length

      var scoreP1 = game.player.score;
      var scoreP2 = game.computer.score;
      
      context.font = "16px Arial";
      context.fillStyle = "#0095DD";
      context.strokeText("Player 1: " + scoreP1, -FIELD_HEIGHT_LEN, 20);
      context.strokeText(" | " + scoreP2 + " : Player 2", -FIELD_HEIGHT_LEN, 20);
    },
    //player movement, will change with player2 introduction
    playerMove(event, game) {
      // get the mouse location in the canvas
      var canvasLocation = canvas.getBoundingClientRect();
      var mouseLocation = event.clientY - canvasLocation.y;

      if (mouseLocation < FIELD_HEIGHT_LEN)
      game.player.y = mouseLocation - PLAYER_HEIGHT / 2;
    },
    computerMove(game) {
      game.computer.y += game.ball.speed.y * 0.85;
    },
    ballMove(game) {
      const FIELD_HEIGHT_LEN = canvas.height/2; //= 1.0 in height length
      const FIELD_WIDTH_LEN = canvas.width/2; //= 1.0 in width length

      // rebounds on the top and bottom lines of the canvas
      if (game.ball.y > FIELD_HEIGHT_LEN || game.ball.y < -FIELD_HEIGHT_LEN)
        game.ball.speed.y *= -1.2;
      // collision with players
      if (game.ball.x >= FIELD_WIDTH_LEN - 10)
        this.collide(game.computer);
      else if (game.ball.x <= -FIELD_WIDTH_LEN + 10)
        this.collide(game.player);
      game.ball.x += game.ball.speed.x;
      game.ball.y += game.ball.speed.y;
    },
    play(game) {
      var anim;
      this.ballMove(game);
      this.draw(game); // makes weird drawings of the the players and the ball
      this.computerMove(game);
      anim = requestAnimationFrame(() => this.play(game));
    },
    stop(game) {
      var anim;

      cancelAnimationFrame(anim);

      game.player.score = 0;
      game.computer.score = 0;
    }
  },
};
</script>

<style>
/*Styles pour les boutons */
.icon-home, .icon-login,.icon-register {
  width: 24px;
  height: 24px;
  align-items: center;
  margin-top: auto;
}

/* Styles personnalisés pour le formulaire de connexion */
.custom-modal-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.custom-modal {
  background: #fff;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  max-width: 360px;
  width: 100%;
}

.custom-modal-header {
  background: #474444;
  color: #fff;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.custom-modal-header h5 {
  margin: 0;
  font-size: 20px;
}

.custom-modal-close {
  font-size: 24px;
  cursor: pointer;
}

.custom-modal-body {
  padding: 20px;
}

.custom-modal-footer {
  text-align: right;
  padding: 5px 20px;
}
.custom-modal-body input[type="email"],
.custom-modal-body input[type="password"] {
  border: 2px solid #474444;; /* Couleur de la bordure*/
  border-radius: 4px; /* Arrondir les coins */
  padding: 6px; /* Espacement à l'intérieur du champ */
  width: 100%; /* Largeur du champ */
  margin-bottom: 10px; /* Espacement entre les champs */
}
/* Style personnalisé pour le bouton "Se connecter" */
.custom-modal-footer button.btn-primary {
  background-color: #474444;
  color: #fff;
  border: none; /* Supprimer la bordure par défaut */
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer; /* Curseur de la main au survol */
  transition: background-color 0.3s ease; /* Animation de transition de couleur de fond */
}

/* Style de survol (hover) du bouton */
.custom-modal-footer button.btn-primary:hover {
  background-color: #0056b3; 
}

.header {
  display: flex;
  align-items: center; /* Aligner verticalement au centre */
  justify-content: space-between; /* Espacement égal entre les éléments */
  padding: 10px; /* Ajouter un peu d'espacement autour de l'en-tête */
}

.icon-container {
  display: flex;
  align-items: center; /* Aligner verticalement au centre */
}

.player_score_zone {
  margin-bottom: 10px;
  margin-left: auto;
  margin-right: auto;
  display:block;
  width: 10%;
  height: 10%;
}

.game-zone {
  margin-bottom: 10px;
  margin-left: 20%;
  margin-right: 20%;
  width:60%;
  height:60%;
}

.page-header {
  text-align: center;
}

</style>
<!-- TO DO :
- rebond sur les joueurs à corriger
- tracé des joueurs et de la balle à effacer
- transfert des données du frontend au backend de façon optimal
-->
