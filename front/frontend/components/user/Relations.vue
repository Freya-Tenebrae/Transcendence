<template>
  <!-- ajouter des onglets pour pouvoir naviguer entre les listes d'amis, d'invitations, d'attente et de personnes bloquées -->
  <div id="friendListContainer" class="list-container" v-if="isFriendListOpen">
    <div class="tab">
      <div class="relation-header">
        <div class="tab-relation" v-for="(tabItem, index) in tabs" :key="index" @click="changeIndex(index)"
          :class="{ 'active-tab': tab === index }">{{ tabItem.icon }}</div>
      </div>
      <div class="tab-item">
        <!-- Contenu de l'onglet Amis -->
        <div v-show="currentIndex === 0">
          <ul class="user-list-content">
            <li v-for="friend in friendList" :key="friend" class="user-item">
              <span class="friend-btn" @click.stop="showContextMenu($event, friend)">{{ friend }}</span>
              <div v-if="selectedFriend === friend" class="context-menu"
                :style="{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }">
                <div @click="chatWithFriend(friend)">Chat</div>
                <div @click="createDuel(friend)">Duel</div>
                <div @click="inviteToChannel(friend)">Inviter à un channel</div>
                <div @click="showProfile(friend)">Profil</div>
                <div @click="deleteFriend(friend)">Supprimer</div>
              </div>
            </li>
          </ul>
          <div class="add-friend">
            <input type="text" v-model="friend" placeholder="Ajouter un ami" @keyup.enter="acceptOrSendFriendRequest">
            <button @click="acceptOrSendFriendRequest" class="add-friend-btn">+</button>
          </div>
        </div>
      </div>
      <div class="tab-item">
        <!-- Contenu de l'onglet Invitaton -->
        <div v-show="currentIndex === 1">
          <ul class="user-list-content">
            <li v-for="sending in sendingList" :key="sending" class="user-item">
              {{ sending }}
            </li>
          </ul>
        </div>
      </div>
      <!-- Contenu de l'onglet En attente -->
      <div class="tab-item">
        <div v-show="currentIndex === 2">
          <div class="friend-list-header" v-if="isWaitingListOpen">En attente<span class="close-friend-list"
              @click="closeRelationList">&times;</span></div>
          <ul class="user-list-content">
            <li v-for="pending in pendingList" :key="pending" class="user-item">
              {{ pending }}
              <button @click="acceptFriend(pending)" class="accept-user-btn">✓</button>
            </li>
          </ul>
        </div>
      </div>
      <div class="tab-item">
        <!-- Contenu de l'onglet Bloqués -->
        <div v-show="currentIndex === 3">
          <div class="friend-list-header" v-if="isBlockListOpen">Bloqués<span class="close-friend-list"
              @click="closeRelationList">&times;</span></div>
          <ul class="user-list-content">
            <li v-for="blocked in blockedList" :key="blocked" class="user-item">
              <span class="friend-btn" @click.stop="showContextMenu($event, blocked)">{{ blocked }}</span>
              <div v-if="selectedBlocked === blocked" class="context-menu"
                :style="{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }">
                <div @click="deleteBlockedUser(blocked)">Supprimer</div>
              </div>
            </li>
          </ul>
          <div class="add-block">
            <input type="text" v-model="blocked" placeholder="Bloquer un utilisateur" @keyup.enter="blockUser">
            <button @click="blockUser" class="add-friend-btn">+</button>
          </div>
        </div>
      </div>
      <div class="tab-item" v-show="currentIndex === 4" @click="closeRelationList">
      </div>
    </div>
  </div>
</template>
  
<script>
import { useCookies } from "vue3-cookies"; // cookies
import PrivateChat from "../chat/PrivateChat.vue"; // chat
import Duel from "../game/Duel.vue";
export default {
  data() {
    return {
      tab: null,
      tabs: [     //les îcones peuvent être remplacées par des images pour un meilleur rendu
        { name: 'Amis', icon: '👥' },
        { name: 'Invitations', icon: '📨' },
        { name: 'En attente', icon: '⏳' },
        { name: 'Bloqués', icon: '🚫' },
        { name: 'Close', icon: '❌' },
      ],
      newFriend: '', // utilisé pour la liaison de données avec le champ d'entrée
      isRelationListOpen: true, // Variable de contrôle pour l'affichage de la liste d'amis
      isFriendListOpen: true, // Variable de contrôle pour l'affichage de la liste d'amis
      isInviteListOpen: false, // Variable de contrôle pour l'affichage de la liste d'amis
      isWaitingListOpen: false, // Variable de contrôle pour l'affichage de la liste d'amis
      isBlockListOpen: false, // Variable de contrôle pour l'affichage de la liste d'amis
      isPrivateChatOpen: false, // Contrôle l'affichage de PrivateChat
      selectedFriend: null,
      selectedBlocked: null,
      menuPosition: { x: 0, y: 0 }
    };
  },
  setup() {
    const { cookies } = useCookies();
    const state = reactive({
      userId: cookies.get("userId"),
      token: cookies.get("authToken"),
      cookies,
      blockedList: [],
      blockedListId: [],
      friendList: [],
      friendListId: [],
      sendingList: [],
      sendingListId: [],
      pendingList: [],
      pendingListId: [],
      currentIndex: 0, // index de l'onglet actif
      friend: '',
      blocked: '',
    });
    return state;
  },
  components: {
    PrivateChat,
    Duel,
  },
  mounted() {
    this.startLoop();
    document.addEventListener('click', this.closeDropdown);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.closeDropdown);
  },
  methods: {
    showContextMenu(event, user) {
      if (this.friendList.includes(user)) {
        this.selectedFriend = user;
      } else if (this.blockedList.includes(user)) {
        this.selectedBlocked = user;
      }
      this.menuPosition.x = event.clientX;
      this.menuPosition.y = event.clientY;
    },
    closeDropdown() {
      this.selectedFriend = null;
    },
    chatWithFriend(friend) {
      this.$emit('openPrivateChat', friend);
    },
    inviteToChannel(friend) {
      this.$emit('inviteToChannel', friend);
    },
    async createDuel(friend) {
      friend = await this.getUser(friend);
      this.$emit('createDuel', friend[0].id);
    },
    async showProfile(friend) {
      friend = await this.getUser(friend);
      this.$emit('showProfile', friend[0].id);
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
    async getUser(user) {
      try {
        const baseUrl = `http://${window.location.hostname}`;
        const field = "nickname";
        const searchstring = user; // user's nickname
        const sort = "id";
        const asc = "asc";
        if (searchstring === '' || searchstring === null || searchstring.length  > 100) {
          return;
        }
        const response = await fetch(`${baseUrl}:2000/api/users/${field}/${searchstring}/${sort}/${asc}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`,
          },
        });
        const data = await response.json();
        // console.log(data);
        return data;
      } catch (error) {
        return;
      }
    },
    async getFriendList() {
      try {
        const baseUrl = `http://${window.location.hostname}`;
        const response = await fetch(`${baseUrl}:2000/relation/findMyFriend/${this.userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`,
          },
        });
        const newfriendListId = await response.json();
        const newfriendList = [];
        for (let i = 0; i < newfriendListId.length; i++) {
          var temp = await this.getUserById(newfriendListId[i]);
          if (temp != newfriendList[i])
            newfriendList.push(temp);
        }
        this.friendList = newfriendList;
        this.friendListId = newfriendListId;
      } catch (error) {
        return;
      }
    },

    async getSendingList() { // invitation envoyée
      try {
        const baseUrl = `http://${window.location.hostname}`;
        const response = await fetch(`${baseUrl}:2000/relation/findFriendEmmitedRequest/${this.userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`,
          },
        });
        const newsendingList = [];
        const newsendingListId = await response.json();
        for (let i = 0; i < newsendingListId.length; i++) {
          var temp = await this.getUserById(newsendingListId[i]);
          if (temp != newsendingList[i])
            newsendingList.push(temp);

        }
        // console.log(this.blockedlist);
        this.sendingList = newsendingList;
        this.sendingListId = newsendingListId;
      } catch (error) {
        return;
      }
    },
    async getPendingList() { // invitations reçues
      try {
        const baseUrl = `http://${window.location.hostname}`;
        const response = await fetch(`${baseUrl}:2000/relation/findMyPendingRequest/${this.userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`,
          },
        });
        const newpendingList = [];
        const newpendingListId = await response.json();
        for (let i = 0; i < newpendingListId.length; i++) {
          var temp = await this.getUserById(newpendingListId[i]);
          if (temp != newpendingList[i])
            newpendingList.push(temp);
        }
        this.pendingList = newpendingList;
        this.pendingListId = newpendingListId;
        // console.log(this.blockedlist);
      } catch (error) {
        return;
      }
    },

    async getBlockedList() {// fonctionne
      try {
        const baseUrl = `http://${window.location.hostname}`;
        const response = await fetch(`${baseUrl}:2000/relation/findMyBlocked/${this.userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`,
          },
        });
        const newblockedList = [];
        const newblockedListId = await response.json();
        for (let i = 0; i < newblockedListId.length; i++) {
          var temp = await this.getUserById(newblockedListId[i]);
          if (temp != newblockedList[i])
            newblockedList.push(temp);
        }
        this.blockedList = newblockedList;
        this.blockedListId = newblockedListId;
        // console.log(this.blockedlist);
      } catch (error) {
        return;
      }
    },
    async blockUser(user) { // fonctionne
      try {
        const baseUrl = `http://${window.location.hostname}`;
        user = this.blocked;
        const search = await this.getUser(user);
        if (search) {
          // console.log(search.id);
          const response = await fetch(`${baseUrl}:2000/relation/blockSomeone/${this.userId}/${search[0].id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.token}`,

            },
          });
          this.blocked = ''; // Réinitialiser après l'envoi
        }
      } catch (error) {
        return;
      }
    },
    async deleteBlockedUser(user) {
      try {
        // const search = await this.getUser(user);
        var idtofind = null
        const baseUrl = `http://${window.location.hostname}`;
        for (let i = 0; i < this.blockedList.length; i++)
          if (this.blockedList[i] == user)
            idtofind = this.blockedListId[i];
        const response = await fetch(`${baseUrl}:2000/relation/unBlockSomeone/${this.userId}/${idtofind}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`,
          },
        });
      } catch (error) {
        return;
      }
    },
    async acceptOrSendFriendRequest(user) {
      try {
        const baseUrl = `http://${window.location.hostname}`;
        user = this.friend;
        const search = await this.getUser(user);
        if (search) {
          const response = await fetch(`${baseUrl}:2000/relation/emmitOrAcceptFriendRequest/${this.userId}/${search[0].id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.token}`,
            },
          });
          this.friend = ''; // Réinitialiser après l'envoi

        }
      }
      catch (error) {
        return;
      }

    },
    async acceptFriend(user) {
      try {
        // const search = await this.getUser(user);
        var idtofind = null;
        for (let i = 0; i < this.pendingList.length; i++)
          if (this.pendingList[i] == user)
            idtofind = this.pendingListId[i];
        const baseUrl = `http://${window.location.hostname}`;
        if (user) {
          const response = await fetch(`${baseUrl}:2000/relation/emmitOrAcceptFriendRequest/${this.userId}/${idtofind}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.token}`,
            },
          });
        }
      } catch (error) {
        return;
      }
    },
    async deleteFriend(user) {
      try {
        // const search = await this.getUser(user);
        var idtofind = null;
        for (let i = 0; i < this.friendList.length; i++)
          if (this.friendList[i] == user)
            idtofind = this.friendListId[i];
        const baseUrl = `http://${window.location.hostname}`;
        if (user) {
          const response = await fetch(`${baseUrl}:2000/relation/removeFriend/${this.userId}/${idtofind}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.token}`,
            },
          });
          for (let i = 0; i < this.friendListId.length; i++) {
            if (this.friendListId[i] == idtofind) {
              this.friendListId.splice(i, 1);
              this.friendList.splice(i, 1);
            }
          }
        }
      } catch (error) {
        return;
      }
    },

    async refreshLists() {
      try {
        await this.getFriendList();
        await this.getSendingList();
        await this.getPendingList();
        await this.getBlockedList();
      } catch (error) {
        return;
      }
    },
    startLoop() {
      this.refreshLists(); // Appel initial
      setInterval(this.refreshLists, 1000); // Exécutez la boucle toutes les 5 secondes
    },

    showList() {
      if (this.currentIndex === 0)
        this.getFriendList();
      else if (this.currentIndex === 1)
        this.getSendingList();
      else if (this.currentIndex === 2)
        this.getPendingList();
      else if (this.currentIndex === 3)
        this.getBlockedList();
    },

    changeIndex(index) {
      if (index === 4) { // Si l'index est 4 (l'onglet Fermer), fermez la liste de relations
        this.closeRelationList();
      }
      this.currentIndex = index;
    },
    closeRelationList() {
      this.$emit('closeFriendList');
    },
  },
};
</script>
  
<style>
@import '~/assets/css/friendlist.css';
</style>
  