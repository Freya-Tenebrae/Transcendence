<template>
  <div>
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
    this.draw();
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
    draw(){
      var game;
      var context = canvas.getContext('2d');
      // var anim;

      // (canvas.width /2, canvas.height / 2) should be defined as the new (0,0)
      // and canvas.width /2, canvas.height / 2 should be the new unit (+1,0, +1,0) to match the backend unit method
      const PLAYER_HEIGHT = 100;
      const PLAYER_WIDTH = 5;
      const MAX_SPEED = 12;

      // Draw field
      context.fillStyle = 'purple';
      context.fillRect(0, 0, canvas.width, canvas.height);
      // Draw middle line
      context.strokeStyle = 'white';
      context.beginPath();
      context.moveTo(canvas.width / 2, 0);
      context.lineTo(canvas.width / 2, canvas.height);
      context.stroke();
      context.save(); // save the line and canvas position
      context.translate(canvas.width / 2, canvas.height / 2); // change the origin of the canvas x & y

      // Draw players
      context.fillStyle = 'blue';
      context.fillRect(-canvas.width / 2, 0, 5, -50);
      context.fillRect(-canvas.width / 2, 0, 5, 50);

      context.fillStyle = 'red';
      context.fillRect(canvas.width / 2, 0, -5, -50);
      context.fillRect(canvas.width / 2, 0, -5, 50);
      // context.fillRect(canvas.width - PLAYER_WIDTH, game.computer.y, PLAYER_WIDTH, PLAYER_HEIGHT);

      // Draw ball
      context.beginPath();
      context.fillStyle = 'white';
      context.arc(0, 0, 5, 0, Math.PI * 2, false);
      context.fill();
    },
  },
};
</script>

<style>
/*Styles pour les boutons */
.icon-home, .icon-login,.icon-register {
  width: 24px;
  height: 24px;
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
.game-zone {
  margin-bottom: 10px;
  margin-left: 20%;
  margin-right: 20%;
  width:60%;
  height:60%;
  
}
</style>
