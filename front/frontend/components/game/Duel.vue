<template>
    <div v-if="isDuelPending && !showGame" class="custom-modal-background">
        <div v-if="isDuelPending && !showGame && duelAccepted" class="matchmaking-container">
            <h1>Duel</h1>
            <img src="~/assets/icons/matchmaking.svg" class="matchmaking-loading" alt="loading" />
            <button v-if="!showGame" @click="cancelDuel">Annuler</button>
        </div>
        <div v-else-if="isDuelPending && !duelAccepted && !showGame && !duelFriend" class="matchmaking-container">
            <h2>Demande de duel </h2>
            <button v-if="!showGame" @click="acceptDuel">Accepter</button>
            <button v-if="!showGame" @click="cancelDuel">Refuser</button>
        </div>
    </div>
    <Game v-if="showGame" @closeGame="gameOver" />
</template>

<script>
import { useCookies } from "vue3-cookies"; // cookies

export default {

    name: "Duel",
    data() {
        return {
            // isDuelInvited: false,
            showGame: false,
        };
    },
    setup() {
        const { cookies } = useCookies();
        const state = reactive({
            userId: cookies.get("userId"),
            token: cookies.get("authToken"),
            gameId: cookies.get("gameId"),
            duelAccepted: false,
            isDuelPending: true,
            cookies,
        });
        return state;
    },
    mounted() {
        this.loopDuel();
    },
    emits: ['cancelDuel'],
    props: ["duelFriend"],
    methods: {
        async resetGame() {
            this.showGame = false;
            this.isDuelPending = false;
            this.duelAccepted = false;
            this.cookies.remove("gameId");
        },
        async gameOver() {
            this.resetGame();
            this.$emit('cancelDuel');
        },
        async loopDuel() {
            const baseUrl = `http://${window.location.hostname}`;
            this.intervalId = setInterval(async () => {
                try {
                    const response = await fetch(`${baseUrl}:2000/matchmaking/userId/${this.userId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${this.token}`,
                        },
                    });
                    if (!response.ok) {
                        throw new Error('Error getting duel');
                    }

                    const m = await response.json();
                    this.duelAccepted = m.isDuelAccepted;
                    if (m) {
                        if (m.isDuel && m.idGameLinked > 0) {
                            this.cookies.set("gameId", m.idGameLinked);
                            this.showGame = true;
                            clearInterval(this.intervalId);
                        }
                        else if (m.isDuel && m.idGameLinked > 0 && m.isOver) {
                            this.cookies.remove("gameId");
                            this.$emit('cancelDuel');
                            clearInterval(this.intervalId);
                        }
                    }
                    else {
                        // console.log('ERROR');
                    }
                } catch (error) {
                    this.isDuelPending = false;
                    this.$emit('cancelDuel');
                    // console.log('Error in duel:', error);
                    clearInterval(this.intervalId);
                }
            }, 1000);
        },
        async acceptDuel() {
            const baseUrl = `http://${window.location.hostname}`;
            const response = await fetch(`${baseUrl}:2000/matchmaking/acceptDuel/${this.userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.token}`,
                },
            });
        },
        async cancelDuel() {
            const baseUrl = `http://${window.location.hostname}`;
            const response = await fetch(`${baseUrl}:2000/matchmaking/cancelDuel/${this.userId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.token}`,
                },
            });
            this.isDuelPending = false;
            this.$emit('cancelDuel');
            // console.log('Duel annulé avec succès');
        },
        // hide the box when the duel is accepted or cancelled
        // hideDuelBox() {
        // this.$el.querySelector('.duel-box').classList.remove('show');
        // }
    }
}

</script>

<style>
@import '~/assets/css/matchmaking.css';
</style>