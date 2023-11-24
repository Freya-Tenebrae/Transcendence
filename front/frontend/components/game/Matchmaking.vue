<!-- Matchmaking.vue -->
<template>
  <div v-if="searching && !showGame" class="matchmaking-container">
    <h1>Matchmaking</h1>
    <!-- <p>Recherche en cours...</p> -->
    <img src="~/assets/icons/matchmaking.svg" class="matchmaking-loading" alt="loading" />
    <button v-if="!showGame" @click="cancelMatchmakingForUser">Annuler</button>
  </div>
  <Game v-if="showGame" @closeGame="gameOver" />
</template>
  
<script>
import Game from './Game.vue';
import { useCookies } from "vue3-cookies"; // cookies

export default {
  name: 'Matchmaking',
  data() {
    return {
      searching: true,
      showGame: false,
    };
  },
  setup() {
    const { cookies } = useCookies();
    return { cookies };
  },
  mounted() {
    if (!this.showGame)
      this.loopMatchmaking();
  },
  emits: ['cancelMatchmaking'],
  methods: {
    gameOver() {
      this.showGame = false;
      this.searching = false;
      this.$emit('cancelMatchmaking');
    },
    async loopMatchmaking() {
      const userId = this.cookies.get("userId");
      const token = this.cookies.get('authToken'); // get the token from the cookies
      const baseUrl = `http://${window.location.hostname}`;
      this.intervalId = setInterval(async () => {
        try {
          const response = await fetch(`${baseUrl}:2000/matchmaking/userId/${userId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error('Error getting matchmaking');
          }
          const m = await response.json();
          if (m) {
            if (m == undefined)
            {
              console.log('ERROR');
              this.searching = false;
              this.$emit('cancelMatchmaking');
            }
            else if (!m.isDuel && m.idGameLinked > 0) {
              this.cookies.set("gameId", m.idGameLinked);
              this.showGame = true;
              clearInterval(this.intervalId);
            }
          } else {
            console.log('ERROR');
            this.searching = false;
            this.$emit('cancelMatchmaking');
          }
        } catch (error) {
          this.searching = false;
          this.$emit('cancelMatchmaking');
          // console.log('Error in loopMatchmaking:', error);
          clearInterval(this.intervalId);
        }
      }, 1000);
    },
    stopLoop() {
      clearInterval(this.intervalId);
    },

    async cancelMatchmakingForUser() {
      const userId = this.cookies.get("userId");
      const token = this.cookies.get('authToken'); // get le token dans les cookies
      const baseUrl = `http://${window.location.hostname}`;
      try {
        const response = await fetch(`${baseUrl}:2000/matchmaking/cancel/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Erreur lors de l’annulation du matchmaking');
        }

        const result = await response.json();

        if (result == false) {
          console.log('Le matchmaking n’a pas pu être annulé');
        }
        else {
          this.searching = false;
          this.$emit('cancelMatchmaking');
          console.log('Matchmaking annulé avec succès');
          // stop loop
          return await response.json();
        }
      } catch (error) {
        // console.log(userId);
        // console.log(token);
        // console.log('Erreur lors de l’annulation du matchmaking pour l’utilisateur :', error);
      }
    },
  },
};
</script>
<style>
@import '~/assets/css/matchmaking.css';
</style>