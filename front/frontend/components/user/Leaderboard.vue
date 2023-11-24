<template>
  <div v-if="showLB" class="player-list">
    <span class="close-btn" @click="closeLeaderboard">&times;</span>
    <h2>Classement des joueurs</h2>
    <ul>
      <li v-for="player in players" :key="player.id" class="player-item">
        {{ player.nickname }} - ELO: {{ player.elo }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Leaderboard',
  data() {
    return {
      players: [], // Initialisé vide, sera rempli par les données de l'API
      showLB: true,
    };
  },
  mounted() {
    this.fetchLeaderboard();
  },
  methods: {
    closeLeaderboard() {
      this.showLB = false;
      this.$emit('close-list');
    },
    async fetchLeaderboard() {
      try {
        // Utilisez cette ligne si vous avez besoin de l'URL de base, sinon supprimez-la
        const baseUrl = `http://${window.location.hostname}`;
        const response = await fetch(`${baseUrl}:2000/api/leaderboard`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        this.players = await response.json();
      } catch (error) {
        console.error('Erreur lors de la récupération du classement:', error);
      }
    },
  },
};
</script>

<style>
@import '~/assets/css/leaderboard.css';
</style>
