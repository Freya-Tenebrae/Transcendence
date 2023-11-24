<template>
    <!-- <div class="busy-screen" v-if="!isSpectating"> -->
    <!-- <p>Vous êtes en jeu ou en matchmaking. Vous allez être retourné au menu principal.</p> -->
    <!-- <button @click="$emit('close-match-list')" class="btn-confirm">OK</button> -->
    <!-- </div> -->
    <div v-if="searching" class="match-list">
        <h2>Liste des matchs en cours :</h2>
        <div v-if="matchList.length !== 0" v-for="match in matchList">
            <div v-if="!match.isOver">
                <button v-if="match.userId1 != this.userId || match.userId2 !=this.userId" @click="accessMatch(match.id)" class="match-btn">
                    {{ match.isRanked ? 'Classé' : 'Normal' }} : {{ users[match.userId1] }} vs {{ users[match.userId2] }}
                    |
                    {{ match.scoreUser1 }} : {{ match.scoreUser2 }}
                </button>
            </div>
        </div>
        <div v-else-if="matchList.length === 0">
            <p class="empty-match-list">Aucun match en cours</p>
        </div>
    </div>
    <div v-if="!searching && showGame && isSpectating">
        <Game v-if="showGame" @close-game="gameOver" />
    </div>
    <button @click="showGame = false; isSpectating = false; $emit('close-match-list')" class="quit-game-btn">
        {{ showGame ? 'Quitter la partie' : 'Retour' }}
    </button>
</template>

<script>
import Game from './Game.vue';
import { useCookies } from "vue3-cookies";

export default {
    name: 'Spectate',
    data() {
        return {
            searching: true,
            showGame: false,
            isSpectating: false,
            users: {},
        };
    },
    setup() {
        const { cookies } = useCookies();
        const state = reactive({
            userId: cookies.get("userId"),
            token: cookies.get("authToken"),
            cookies,
            matchList: [],
            gameData: null,
        });
        return state;
    },
    emits: ['close-match-list', 'startGame', 'showGame', 'stopGame', 'isSpectating'],
    mounted() {
        if (!this.showGame)
            this.loopSearchMatch();
        else
            this.startGameLoop();
        //console.log('match UserId1:',this.matchList.userId1, 'match UserId2:',this.matchList.userId2, 'userId:',this.userId, 'liste des users:' , this.users);
    },
    methods: {
        gameOver() {
            this.showGame = false;
        },
        async getUserById(id) {
            const baseUrl = `http://${window.location.hostname}`;
            const response = await fetch(`${baseUrl}:2000/api/user/id/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`,
                },
            });
            const data = await response.json();
            return data.nickname;
        },
        async fetchUser(id) {
            if (!this.users[id]) {
                this.users[id] = await this.getUserById(id);
            }
        },
        async loopSearchMatch() {
            const userId = this.cookies.get("userId");
            const token = this.cookies.get('authToken');
            const baseUrl = `http://${window.location.hostname}`;
            this.searching = true;
            this.intervalId = setInterval(async () => {
                try {
                    const response = await fetch(`${baseUrl}:2000/game`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    if (!response.ok) {
                        throw new Error('Error getting match list');
                    }
                    const m = await response.json();
                    if (m) {
                        for (let i = 0; i < m.length; i++) {
                            this.matchList.push(m[i]);
                            this.fetchUser(m[i].userId1);
                            this.fetchUser(m[i].userId2);
                            clearInterval(this.intervalId);
                        }
                    } else {
                        console.log('Aucun match en cours');
                    }
                } catch (error) {
                    clearInterval(this.intervalId);
                }
            }, 1000);
        },
        stopLoop() {
            clearInterval(this.intervalId);
        },
        async accessMatch(gameId) { // voir pq ça renvoie une game vide
            const baseUrl = `http://${window.location.hostname}`;
            this.stopLoop();
            const response = await fetch(`${baseUrl}:2000/game/gameId/${gameId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Error getting the match');
            }
            const m = await response.json();
            if (m) {
                this.gameData = m;
                //console.log(this.gameData);
                if (this.gameData.userId1 === this.userId || this.gameData.userId2 === this.userId) {
                    // emettre un message d'erreur "Vous ne pouvez pas rejoindre votre propre partie en tant que specateur, retournez dans votre partie" et renvoyer au menu
                    alert('Vous ne pouvez pas rejoindre votre propre partie en tant que specateur, retournez dans votre partie');
                    this.$emit('close-match-list');
                }
                else {
                    this.cookies.set("gameId", gameId);
                    this.$emit('isSpectating', true);
                    this.$emit('showGame', true);
                    this.isSpectating = true;
                    this.showGame = true;
                    this.searching = false;
                }
            }
            else
                console.log('Aucun match en cours');
        },
    },
    components: {
        Game,
    },
};
</script>

<style>
@import "~/assets/css/spectate.css";
</style>