<template>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron&display=swap" rel="stylesheet">
  <div v-if="pageReady">
    <div>
      <title>Cyberpong 2042</title>
      <div class="header">
        <img src="~/assets/icons/home.svg" alt="Home-Icon" class="icon-home" @click="Home" />
        <div class="icon-container">
          <!-- Icône Profile (visible si l'utilisateur est connecté) -->
          <img v-if="isUserLoggedIn" src="~/assets/icons/user.svg" alt="Profile-Icon" class="icon-user"
            @click="isProfileOpen = !isProfileOpen" />
          <img v-if="isUserLoggedIn" src="~/assets/icons/friends.svg" alt="Register-Icon" class="icon-friends"
            @click="isFriendListOpen = !isFriendListOpen" />
          <img v-if="isUserLoggedIn" src="~/assets/icons/disconnect.svg" alt="Register-Icon" class="icon-door"
            @click="showLogoutConfirmation = true" />

          <!-- Icônes Login et Register (cachées si l'utilisateur est connecté) -->
          <img v-if="!isUserLoggedIn" src="~/assets/icons/login.svg" alt="Login-Icon" class="icon-login"
            @click="isLoginOpen = !isLoginOpen" />
          <img v-if="!isUserLoggedIn" src="~/assets/icons/lock.svg" alt="Register-Icon" class="icon-register"
            @click="isRegisterOpen = !isRegisterOpen" />
        </div>
      </div>
      <!-- Afficher le formulaire d'inscription -->
      <Register v-if="isRegisterOpen" @close="isRegisterOpen = false" />
      <!-- Afficher le formulaire de connexion -->
      <Login v-if="isLoginOpen" @close="isLoginOpen = false" :otpError="ErrorBool" :authorizationCode="authCode"
        :authError="authError" :idAuth="idAuth" />
      <!-- Afficher le profil -->
      <Profile v-if="isProfileOpen" :otherUserId="profileUserId" @closeProfile="isProfileOpen = false"
        @clearOtherUserId="clearOtherUserId" />
      <!-- Afficher la liste des channels -->
      <Channel v-if="showChannelList" @close-channel-list="handleCloseChannelList" @channel-joined="handleChannelJoined"
        :inviteMode="inviteMode" :friendToInvite="selectedFriend" />
      <!-- Afficher la liste des parties en cours pour le mode spectateur -->
      <Spectate v-if="showMatchList" @close-match-list="handleCloseMatchList" />
      <!-- Afficher le chat -->
      <PrivateChat v-if="isPrivateChatOpen" @close="isPrivateChatOpen = false" :friendFromRelation="selectedFriend"
        :channel="selectedChannel" @showProfile="showProfile" @createDuel="handleDuel" />
      <!-- Affiche la deconnexion -->
      <Logout :showlogout="showLoggedOut" :showconfirmation="showLogoutConfirmation" @close-logout="handleCloseLogout" />
      <!-- Afficher la liste des parties -->
      <Leaderboard v-if="showLeaderboard_" @close-list="handleCloseList" />
      <!--Affiche la liste d'amis  -->
      <FriendList v-if="isFriendListOpen" @closeFriendList="isFriendListOpen = false" @openPrivateChat="openPrivateChat"
        @createDuel="handleDuel" @showProfile="showProfile" @inviteToChannel="handleInviteChannel" />
      <!-- Afficher la fenêtre de duel -->
      <Duel v-if="showDuel" @cancelDuel="handleCloseDuel" :duelFriend="selectedFriend" />
      <Duel v-if="showAccept" @cancelDuel="handleCloseDuel" />
      <!-- Afficher le matchmaking -->
      <Matchmaking v-if="showMatchmaking" @cancelMatchmaking="handleCloseMatchmaking" />
    </div>
    <div v-if ="!showGame && !showMatchmaking" class="body">
      <div class="center-container">
        <button v-if="!isUserLoggedIn" @click="startOrLogin" class="start-login-btn">
          Connexion
        </button>
        <div
          v-if="isUserLoggedIn && !showGame  && !showAccept  && !showMatchmaking && !showDuel"
          class="menu-container">
          <button @click="createMatchmakingForUser(false)" class="menu-btn">Partie Rapide</button>
          <button @click="createMatchmakingForUser(true)" class="menu-btn">Partie Classée</button>
          <button @click="showOngoingGames" class="menu-btn">Mode Spectateur</button>
          <button @click="showOnlineChannel" class="menu-btn">Channel</button>
          <button @click="showLeaderboard" class="menu-btn">Classement</button>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="icon-container">
        <img v-if="isUserLoggedIn && !isPrivateChatOpen" src="~/assets/icons/chat.svg" alt="Chat-Icon" class="icon-chat"
          @click="isPrivateChatOpen = !isPrivateChatOpen" />
      </div>
    </div>
  </div>
  <div v-else class="loading-container">
    <title>Cyberpong 2042</title>
    <!-- <p class="loading-text">Chargement...</p> -->
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
/* auth */
import Login from './auth/Login.vue';
import Logout from './auth/Logout.vue';
import Register from './auth/Register.vue';
/* chat */
import PrivateChat from './chat/PrivateChat.vue';
import Channel from './chat/Channel.vue';
/* game */
import Matchmaking from './game/Matchmaking.vue';
import Duel from './game/Duel.vue';
import Spectate from './game/Spectate.vue';
/* user */
import Profile from './user/Profile.vue';
import Leaderboard from './user/Leaderboard.vue';
import FriendList from './user/Relations.vue';
import { useCookies } from "vue3-cookies"; // cookies

export default {
  name: 'HomePage',
  components: {
    Login,
    Logout,
    Register,
    PrivateChat,
    Channel,
    Matchmaking,
    Duel,
    Spectate,
    Profile,
    Leaderboard,
    FriendList,
  },
  setup(props, context) {
    const { cookies } = useCookies();
    const state = reactive({
      showGame: false,
      showLogoutConfirmation: false,
      showLoggedOut: false,
      showMenu: false,
      showLeaderboard_: false,
      showChannelList: false,
      showMatchmaking: false,
      showMatchList: false,
      pageReady: false,
      isLoginOpen: false,
      isRegisterOpen: false,
      isFriendListOpen: false,
      isUserLoggedIn: ref(false),
      isPrivateChatOpen: false,
      isProfileOpen: false,
      isSpectating: false,
      selectedFriend: null,
      selectedChannel: null,
      showDuel: false,
      showAccept: false,
      profileUserId: null,
      intervalId: null,
      isLoggedFailed: false,
      isLoggedSuccessfully: false,
      authCode: null,
      authError: null,
      inviteMode: false,
      ErrorBool: false,
      authCode: null,
      idAuth: null,
      intervalId2: null,

      cookies,
    });
    onMounted(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const JWT = urlParams.get('access_token');
      const userId = urlParams.get('id');
      const error = urlParams.get('error');
      state.authCode = urlParams.get('code');

      if (error === 'no2fa' || error === 'bad2fa') {
        state.isLoginOpen = true;
        state.authError = error;
        state.ErrorBool = true;
        state.idAuth = userId;
      }
      // console.log(JWT);
      // console.log(userId);
      if (JWT) {
        state.cookies.set("authToken", JWT);
      }
      if (userId) {
        state.cookies.set("userId", userId);
      }
      window.history.replaceState({}, document.title, "/");
      checkLoginStatus();
      watch(() => state.isUserLoggedIn, (newValue) => {
        if (newValue) {
          state.intervalId2 = setInterval(() => {
            heartBeat();
            // console.log("battement");
          }, 6000);
        } else {
          clearInterval(state.intervalId2);
        }
      });
      watch(() => state.isUserLoggedIn, (newValue) => {
        if (newValue) {
          state.intervalId = setInterval(() => { // ajouter verification en ligne
            loopDuelMatchmaking();
          }, 2000);
        } else {
          clearInterval(state.intervalId);
        }
      });
    });
    onUnmounted(() => {
      clearInterval(state.intervalId);
    });
    const heartBeat = async () => {
      const token = state.cookies.get('authToken'); // get le token dans les cookies
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/auth/heartbeat`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      // console.log("battement");
      if (!response.ok) {
        clearInterval(state.intervalId2);
        return;
      }
    };
    const handleInviteChannel = (friend) => {
      state.showChannelList = true;
      state.showMenu = false;
      state.selectedFriend = friend;
      state.inviteMode = true;
    };
    const handleChat = () => {
      state.isPrivateChatOpen = true;
      state.showMenu = false;
    };
    const handleCloseLogout = () => {
      state.showLogoutConfirmation = false;
      state.showLoggedOut = false;
    };
    const showProfile = (otherUserId) => {
      state.profileUserId = otherUserId;
      state.isProfileOpen = true;
      state.isFriendListOpen = false;
    };
    const clearOtherUserId = () => {
      state.profileUserId = null;
    };
    const handleDuel = (friend) => {
      state.showMenu = false;
      state.isPrivateChatOpen = false;
      state.selectedFriend = friend;
      createDuel();
    };
    const handleChannelJoined = (channelId) => {
      state.isPrivateChatOpen = true;
    };
    const openPrivateChat = (friend) => {
      state.selectedFriend = friend;
      state.isPrivateChatOpen = true;
      state.showChannelList = false;
    };
    const checkLoginStatus = () => {
      const authToken = state.cookies.get("authToken");
      setTimeout(() => {
        state.isUserLoggedIn = !!authToken;
        state.pageReady = true; // Maintenant, la page est prête à être affichée.
      }, 1); // Simule un délai de traitement
      return state.isUserLoggedIn;
    };
    const toggleFriendList = () => {
      state.emit('toggle-friend-list');
    };
    const refresh_page = () => {
      window.location.reload();
    };
    const startOrLogin = () => {
      if (state.isUserLoggedIn) {
        state.showMenu = true;
      } else {
        state.isLoginOpen = true;
      }
    };
    const startGame = () => {
      state.showMenu = false;
      state.showGame = true;
    };
    const handleUserLoggedIn = (isLoggedIn) => {
      state.isUserLoggedIn = isLoggedIn;
    };
    const handleCloseList = () => {
      state.showLeaderboard_ = false;
      state.showMenu = true;
    };
    const handleCloseChannelList = () => {
      state.showChannelList = false;
      state.showMenu = true;
    };
    const handleCloseMatchList = () => {
      state.showMatchList = false;
      state.showMenu = true;
    };
    const handleCloseMatchmaking = () => {
      state.showMatchmaking = false;
      state.showMenu = true;
    };
    const handleCloseDuel = () => {
      state.showDuel = false;
      state.showAccept = false;
      state.showMenu = true;
    };
    const handleQuitGame = () => {
      state.showGame = false; // Cela va cacher le composant Game
      state.showMenu = true; // Et cela va afficher à nouveau le menu principal
    };
    const showLeaderboard = () => {
      state.showLeaderboard_ = true; // Affiche le leaderboard
      state.showMenu = false; // Cache le menu
    };
    const showOnlineChannel = () => {
      state.showChannelList = true; // Affiche la liste des channels publics
      state.showMenu = false; // Cache le menu
    };
    const showOngoingGames = () => {
      state.showMatchList = true; // Affiche la liste des parties en cours
      state.showMenu = false; // Cache le menu
    };
    const Home = () => {
      state.showMenu = true;
      state.showGame = false;
      state.showDuel = false;
      state.showAccept = false;
      state.showMatchmaking = false;
      state.showMatchList = false;
      state.showChannelList = false;
      state.showLeaderboard_ = false;
      state.isPrivateChatOpen = false;
      state.isFriendListOpen = false;
      state.isProfileOpen = false;
    };
    const createMatchmakingForUser = async (isRanked) => {
      const userId = state.cookies.get("userId");
      const token = state.cookies.get('authToken'); // get le token dans les cookies
      const baseUrl = `http://${window.location.hostname}`;
      try {
        const response = await fetch(`${baseUrl}:2000/matchmaking/create/${userId}/${isRanked}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Erreur lors de la création du matchmaking');
        }
        state.showMatchmaking = true;
        state.showMenu = false;
        // console.log('Matchmaking créé avec succès');
        return await response.json();
      } catch (error) {
        // console.log(userId);
        // console.log(token);
        // console.log('Erreur lors de la création du matchmaking pour l’utilisateur :', error);
      }
    };
    const loopDuelMatchmaking = async () => {
      const userId = state.cookies.get("userId");
      const token = state.cookies.get('authToken'); // get the token from the cookies
      const baseUrl = `http://${window.location.hostname}`;
      state.intervalId = setInterval(async () => {
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
            if (m.isDuel && m.isDuelAccepted == false) {
              state.showAccept = true;
              state.showMenu = false;
              // console.log("Duel trouvé");
              clearInterval(state.intervalId);
            }
          } else {
            // console.log('ERROR');
          }
        } catch (error) {
          // console.log('Error in loopMatchmaking:', error);
          clearInterval(state.intervalId);
        }
      }, 1000);
    };
    const createDuel = async () => {
      const userId = state.cookies.get("userId");
      const token = state.cookies.get('authToken'); // get le token dans les cookies
      const targetId = state.selectedFriend;
      const baseUrl = `http://${window.location.hostname}`;
      try {
        const response = await fetch(`${baseUrl}:2000/matchmaking/initiateDuel/${userId}/${targetId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Erreur lors de la création du duel');
        }
        state.showDuel = true;
        const duel = await response.json();
        // state.semit('duelCreated', duel);
        // console.log(duel);
        return duel;
      } catch (error) {
        // console.log(userId);
        // console.log(token);
        // console.log('Erreur lors de la création du duel pour l’utilisateur :', error);
      }
    };
    return {
      ...toRefs(state),
      handleInviteChannel,
      showProfile,
      clearOtherUserId,
      handleDuel,
      handleChannelJoined,
      openPrivateChat,
      checkLoginStatus,
      toggleFriendList,
      refresh_page,
      startOrLogin,
      startGame,
      handleUserLoggedIn,
      handleCloseList,
      handleCloseChannelList,
      handleCloseMatchList,
      handleCloseMatchmaking,
      handleCloseDuel,
      handleQuitGame,
      showLeaderboard,
      showOnlineChannel,
      showOngoingGames,
      createMatchmakingForUser,
      loopDuelMatchmaking,
      createDuel,
      Home,
      heartBeat,
      handleChat,
      handleCloseLogout,

    };
  },
};
</script>

<style>
@import '~/assets/css/global.css';
</style>