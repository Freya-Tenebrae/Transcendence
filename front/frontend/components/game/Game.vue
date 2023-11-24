<!-- Game.vue -->
<template>
  <div class="body-container">
    <div class="style-container">
      <div class="title-container">
        CYBERPONG
      </div>
      <div class="end-screen" v-if="gameOver">
        <p>Game Over</p>
        <p>Score Final: {{ leftScore }} - {{ rightScore }}</p>
        <p v-if="leftScore > rightScore">Victoire de {{ player1Nickname }}</p>
        <p v-else-if="leftScore < rightScore">Victoire de {{ player2Nickname }}</p>
        <p v-else>Égalité</p>
        <button @click="closeGamePage" class="btn-confirm">OK</button>
      </div>
      <div class="countdown" v-if="timer > 119">{{ (5 + Math.ceil(timer)) - 125 }}</div>
      <div class="timer-container">
        <div class="timer">{{ Math.floor(timer / 60) }}:{{ Math.floor(timer) % 60 < 10 ? '0' : '' }}{{ Math.floor(timer) %
          60 }}</div>
        </div>
        <div class="score-container">
          <div class="left-score">{{ leftScore }}</div>
          <div class="right-score">{{ rightScore }}</div>
        </div>
        <div class="user-info-container">
          <div class="player-info left-player">
            <h3 class="player-nickname">{{ player1Nickname }}</h3>
            <p v-if="isRanked">ELO: {{ player1Elo }}</p>
          </div>
          <div class="player-info right-player">
            <h3 class="player-nickname">{{ player2Nickname }}</h3>
            <p v-if="isRanked">ELO: {{ player2Elo }}</p>
          </div>
        </div>

        <br>
        <div class="game-container">
          <div class="flex-container">
            <div ref="stageContainer"></div>

          </div>
        </div>
        <div v-if="isRanked" class="powerup-bar-container">
          <div class="powerup-bar1">
            <div class="powerup-bar1-filling"
              :style="{ width: Math.round(100 - player1Power) + '%', left: Math.round(player1Power) + '%' }"></div>
          </div>
          <div class="powerup-bar2">
            <div class="powerup-bar2-filling" :style="{ width: Math.round(100 - player2Power) + '%' }"></div>
          </div>
        </div>

        <div v-if="isRanked" class="ranked-powerups-container">
          <div class="powerup-p1-icon-container">
            <div
              :class="{ 'sandevistanSmash1On': player1PwSmashActive == true, 'sandevistanSmash1Off': player1PwSmashActive == false }">
              <div class="cooldownEffects"
                :style="{ height: Math.round(player1Cooldown * 20) + '%', bottom: Math.round(100 - player1Cooldown * 20) + '%' }">
                <p v-if="player1Cooldown != 0" class="cooldownTimer"> {{ Math.round(player1Cooldown) }} </p>
              </div>
            </div>
            <div
              :class="{ 'sandevistanGuard1On': player1PwGuardActive == true, 'sandevistanGuard1Off': player1PwGuardActive == false }">
              <div class="cooldownEffects"
                :style="{ height: Math.round(player1Cooldown * 20) + '%', bottom: Math.round(100 - player1Cooldown * 20) + '%' }">
                <p v-if="player1Cooldown != 0" class="cooldownTimer"> {{ Math.round(player1Cooldown) }} </p>
              </div>
            </div>
          </div>
          <div class="powerup-p2-icon-container">
            <div
              :class="{ 'sandevistanGuard2On': player2PwGuardActive == true, 'sandevistanGuard2Off': player2PwGuardActive == false }">
              <div class="cooldownEffects"
                :style="{ height: Math.round(player2Cooldown * 20) + '%', bottom: Math.round(100 - player2Cooldown * 20) + '%' }">
                <p v-if="player2Cooldown != 0" class="cooldownTimer"> {{ Math.round(player2Cooldown) }} </p>
              </div>
            </div>
            <div
              :class="{ 'sandevistanSmash2On': player2PwSmashActive == true, 'sandevistanSmash2Off': player2PwSmashActive == false }">
              <div class="cooldownEffects"
                :style="{ height: Math.round(player2Cooldown * 20) + '%', bottom: Math.round(100 - player2Cooldown * 20) + '%' }">
                <p v-if="player2Cooldown != 0" class="cooldownTimer"> {{ Math.round(player2Cooldown) }} </p>
              </div>
            </div>
          </div>
        </div>
        <br>
        <br>
        <p v-if="!isSpectating">ArrowUp = Up</p>
        <p v-if="!isSpectating">ArrowDown = Down </p>
        <p v-if="!isSpectating">PowerUp1 = 1</p>
        <p v-if="!isSpectating">PowerUp2 = 2</p>
      </div>
    </div>
</template>

<script>
import { Stage, Layer, Rect, Circle } from 'konva';
import { reactive } from 'vue';
import { useCookies } from "vue3-cookies"; // cookies
export default {
  name: 'Game',
  setup() {
    const { cookies } = useCookies();

    const state = reactive({
      userId: cookies.get("userId"),
      gameId: cookies.get("gameId"),
      token: cookies.get("authToken"),
      stage: null,
      leftPaddle: null,
      rightPaddle: null,
      ball: null,
      leftScore: 0,
      rightScore: 0,
      gameInterval: null,
      timer: null,
      keyUpPressed: false,
      keyDownPressed: false,
      movement: 0, // 1 = down, 0 = nothing, -1 = up
      gameOver: false,
      cookies,
      player1Nickname: '',
      player1Elo: 0,
      player2Nickname: '',
      player2Elo: 0,
      player1Id: 0,
      player2Id: 0,
      powerUp1Active: false,
      powerUp2Active: false,
      player1Power: 0,
      player1Cooldown: 0,
      player1PwSmashActive: false,
      player1PwGuardActive: false,
      player2Power: 0,
      player2Cooldown: 0,
      player2PwSmashActive: false,
      player2PwGuardActive: false,
      isRanked: false,
      isSpectating: false,
    });
    return state;
  },
  emits: ['closeGame'],
  //
  methods: {
    closeGamePage() {
      this.$emit('closeGame');
    },
    handleKeyDown(e) {
      if (e.code === 'ArrowUp') {
        this.keyUpPressed = true; // L'utilisateur appuie sur la flèche du haut
      }
      else if (e.code === 'ArrowDown') {
        this.keyDownPressed = true; // L'utilisateur appuie sur la flèche du bas
      }
      else if (e.code === 'Digit1') {
        this.powerUp1Active = true; // Active le power-up 1
      }
      else if (e.code === 'Digit2') {
        this.powerUp2Active = true; // Active le power-up 2
      }
    },

    handleKeyUp(e) {
      if (e.code === 'ArrowUp') {
        this.keyUpPressed = false; // L'utilisateur relâche la touche
      }
      else if (e.code === 'ArrowDown') {
        this.keyDownPressed = false; // L'utilisateur relâche la touche
      }
      else if (e.code === 'Digit1') {
        this.powerUp1Active = false; // Désactive le power-up 1
      }
      else if (e.code === 'Digit2') {
        this.powerUp2Active = false; // Désactive le power-up 2
      }
    },
    createGameObjects() {
      this.stage = new Stage({
        container: this.$refs.stageContainer,
        width: 500,
        height: 300,
      });

      const layer = new Layer();
      this.stage.add(layer);

      this.ball = new Circle({  // Utilisation de Circle
        x: 0,
        y: 0,
        radius: 5,
        fill: '#0affd1',
        shadowColor: '#0affd1',
        shadowBlur: 10,
        shadowOffset: { x: 0, y: 0 },
        shadowOpacity: 0.6
      });

      const leftBorder = new Rect({
        x: 0,
        y: 0,
        width: 0.05 * this.stage.width(),
        height: this.stage.height(),
        fill: '#2c2c2c',
      });
      layer.add(leftBorder);

      const rightBorder = new Rect({
        x: 0.95 * this.stage.width(),
        y: 0,
        width: 0.05 * this.stage.width(),
        height: this.stage.height(),
        fill: '#2c2c2c',
      });
      layer.add(rightBorder);

      layer.add(this.ball);

      this.leftPaddle = new Rect({
        x: 0.02 * this.stage.width(),
        y: this.stage.height() / 2 - 30,
        width: 0.03 * this.stage.width(),
        height: 0.2 * this.stage.height(),
        fillLinearGradientStartPoint: { x: 0, y: 0 },
        fillLinearGradientEndPoint: { x: 0, y: 60 },
        fillLinearGradientColorStops: [0, '#9f00c5', 1, '#0affd1'],
        shadowColor: '#ff2079',
        shadowBlur: 10,
        shadowOffset: { x: 0, y: 0 },
        shadowOpacity: 0.6
      });
      layer.add(this.leftPaddle);

      this.rightPaddle = new Rect({
        x: 0.95 * this.stage.width(),
        y: this.stage.height() / 2 - 30,
        width: 0.03 * this.stage.width(),
        height: 0.2 * this.stage.height(),
        fillLinearGradientStartPoint: { x: 0, y: 0 },
        fillLinearGradientEndPoint: { x: 0, y: 60 },
        fillLinearGradientColorStops: [0, '#0affd1', 1, '#9f00c5'],
        shadowColor: '#0affd1',
        shadowBlur: 10,
        shadowOffset: { x: 0, y: 0 },
        shadowOpacity: 0.6
      });
      layer.add(this.rightPaddle);
      layer.draw();
    },
    async getGame() {
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/game/gameId/${this.gameId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });
      const gameData = await response.json();
      return gameData; // Make sure to return the actual game data
    },
    async updateGame() {
      this.takedirectionPlayer();
      const baseUrl = `http://${window.location.hostname}`;
      if (this.movement == 1)
        await fetch(`${baseUrl}:2000/game/playerGoDown/${this.gameId}/${this.userId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${this.token}`,
          },
        });
      else if (this.movement == -1)
        await fetch(`${baseUrl}:2000/game/playerGoUp/${this.gameId}/${this.userId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${this.token}`,
          },
        });
      else
        await fetch(`${baseUrl}:2000/game/playerStopMoving/${this.gameId}/${this.userId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${this.token}`,
          },
        });

    },
    async sandevistanSmash() {
      const baseUrl = `http://${window.location.hostname}`;
      await fetch(`${baseUrl}:2000/game/sandevistanSmash/${this.gameId}/${this.userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });
    },
    async sandevistanGuard() {
      const baseUrl = `http://${window.location.hostname}`;
      await fetch(`${baseUrl}:2000/game/sandevistanGuard/${this.gameId}/${this.userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });
    },
    async takedirectionPlayer() {
      if (this.keyDownPressed == true && this.keyUpPressed == true) {
        this.movement = 0;
      }
      else if (this.keyDownPressed == true) {
        this.movement = 1;
      }
      else if (this.keyUpPressed == true) {
        this.movement = -1;
      }
      else {
        this.movement = 0;
      }
    },
    async startGameLoop() {
      let game = await this.getGame();
      if (game) {
        //id
        this.player1Id = game.userId1;
        this.player2Id = game.userId2;
        this.isRanked = game.isRanked;
        // console.log(game.isRanked);
        await this.fetchUsersById();
        this.gameInterval = setInterval(async () => {
          if (this.userId == this.player1Id || this.userId == this.player2Id)
            await this.updateGame();
          else
            this.isSpectating = true;
          if (this.powerUp1Active) {
            await this.sandevistanSmash();
          }
          if (this.powerUp2Active) {
            await this.sandevistanGuard();
          }
          game = await this.getGame();
          if (!game || game.isOver) {
            clearInterval(this.gameInterval);
            this.isSpectating = false; // optional
            this.gameInterval = null;
            this.cookies.remove("gameId");
            this.gameOver = true; // ecran de fin
            // console.log('game.isOver');
          } else {
            // set les positions des raquettes par rapport a la reponse du serveur

            this.player1Power = game.player1_power;
            this.player1Cooldown = game.player1_powerUpCooldown;
            this.player2Power = game.player2_power;
            this.player2Cooldown = game.player2_powerUpCooldown;
            this.player1PwSmashActive = game.player1_powerUpSandevistanSmash,
            this.player1PwGuardActive = game.player1_powerUpSandevistanGuard,
            this.player2PwSmashActive = game.player2_powerUpSandevistanSmash,
            this.player2PwGuardActive = game.player2_powerUpSandevistanGuard,
            //timer
            this.timer = game.timeRemaining;
            //score
            this.leftScore = game.scoreUser1;
            this.rightScore = game.scoreUser2;
            //paddle
            this.leftPaddle.y(((1 + game.player1_posY) / 2 * this.stage.height()) - 0.1 * this.stage.height());
            this.rightPaddle.y(((1 + game.player2_posY) / 2 * this.stage.height()) - 0.1 * this.stage.height());
            //ball
            this.ball.x(((1 + game.ball_posX) / 2 * (this.stage.width() * 0.90)) + this.stage.width() * 0.05);
            this.ball.y((1 + game.ball_posY) / 2 * this.stage.height());

            this.stage.draw(); // Redessiner la scène
          }
        }, 10);
      } else {
        // handle error if the game could not be retrieved
      }
    },
    //   stopGameLoop() {
    //   if (this.gameInterval) {
    //     clearInterval(this.gameInterval);
    //     this.gameInterval = null;
    //   }
    //   this.gameOver = true; // Écran de fin.
    //   this.cookies.remove("gameId");
    //   console.log('Le jeu est terminé');
    //   window.removeEventListener('keydown', this.handleKeyDown);
    //   window.removeEventListener('keyup', this.handleKeyUp);
    // },
    async fetchUsersById() {
      const baseUrl = `http://${window.location.hostname}`; // Remplacez 'port' par le port réel où votre backend est exécuté
      try {
        // Récupérer les informations pour le joueur 1
        const responsePlayer1 = await fetch(`${baseUrl}:2000/api/user/id/${this.player1Id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.token}`,
          },
        });
        if (!responsePlayer1.ok) {
          throw new Error(`HTTP error! status: ${responsePlayer1.status}`);
        }
        const player1Data = await responsePlayer1.json();
        this.player1Nickname = player1Data.nickname;
        this.player1Elo = player1Data.elo;

        // Récupérer les informations pour le joueur 2
        const responsePlayer2 = await fetch(`${baseUrl}:2000/api/user/id/${this.player2Id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.token}`,
          },
        });
        if (!responsePlayer2.ok) {
          throw new Error(`HTTP error! status: ${responsePlayer2.status}`);
        }
        const player2Data = await responsePlayer2.json();
        this.player2Nickname = player2Data.nickname;
        this.player2Elo = player2Data.elo;

      } catch (error) {
        console.error("Could not fetch user data: ", error);
      }
    },
  },
  mounted() {
    this.createGameObjects();
    this.startGameLoop();
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  },
};
</script>

<style>
@import '~/assets/css/game.css';
</style>