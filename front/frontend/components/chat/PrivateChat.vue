<template>
  <div v-if="isPrivateChatOpen" id="chatContainer" class="chat-container-hidden">
    <div class="chat-body"> <!-- Ajoutez cette ligne -->
      <ul class="channel-list-chat">
        <span @click="closeChat" class="close-chat">&times;</span>
        <img class="pm-img" @click="changeChat('private', $event)" src="~/assets/icons/mp.svg" />
        <li v-for="channel in joinedChannels" :key="channel.id" class="channel-item">
          <img :class="{ 'active-channel': activeChannel === channel.id }" :src="channel.pathImage" class="pm-img"
            @click="changeChannel(channel)" />
        </li>
      </ul>
      <ul v-if="showPrivateMessages" class="pm-chat">
        <li v-for="privateMessage in privateMessageList" :key="privateMessage.id" class="pm-item"
          :class="{ 'active-user': activeUser === privateMessage.id }">
          <button class="pm-btn" @click="handleButtonClick($event, privateMessage)">
            <img :src="privateMessage.pathAvatar" alt="User Avatar" class="user-img" />
            <span class="user-nickname">{{ privateMessage.nickname }}</span>
          </button>
          <div v-if="activeUser" class="context-menu" :style="{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }"
            @mouseup.stop="closeDropdown">
            <div v-if="Number(userId) !== activeUser" @mousedown.stop="createDuel(activeUser)">
              Inviter en duel</div>
            <div v-if="Number(userId) !== activeUser" @mousedown.stop="showProfile(activeUser)">
              Voir le profil</div>
          </div>
        </li>
      </ul>
      <ul v-if="!showPrivateMessages" class="pm-chat">
        <li v-for="user in usersOfChannel" :key="user.id" class="pm-item"
          :class="{ 'banned-user': user.userStatus === 'BANNED' }">
          <button class="pm-btn" @click="showUserContextMenu($event, user)">
            <img :src="user.pathAvatar" alt="User Avatar" class="user-img" />
            <span class="user-nickname">{{ user.nickname }}</span>
          </button>
          <div v-if="selectedUser" class="context-menu"
            :style="{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }" @mouseup.stop="closeDropdown">
            <div v-if="Number(userId) !== selectedUser" @mousedown.stop="createDuel(selectedUser)">
              Inviter en duel</div>
            <div v-if="Number(userId) !== selectedUser" @mousedown.stop="showProfile(selectedUser)">
              Voir le profil</div>
            <div
              v-if="(userStatus === 'ADMIN' || userStatus === 'OWNER') && (selectedStatus !== 'OWNER' || selectedStatus === 'ADMIN') && selectedStatus !== 'MUTED' && Number(userId) !== selectedUser"
              @mousedown.stop="muteFromChannel(activeChannel, selectedUser)">
              Mettre en sourdine</div>
            <div
              v-if="(userStatus === 'ADMIN' || userStatus === 'OWNER') && (selectedStatus !== 'OWNER' || selectedStatus === 'ADMIN') && selectedStatus == 'MUTED' && Number(userId) !== selectedUser"
              @mousedown.stop="unMuteFromChannel(activeChannel, selectedUser)">
              Retablir la parole</div>
            <div
              v-if="(userStatus === 'ADMIN' || userStatus === 'OWNER') && (selectedStatus !== 'OWNER' || selectedStatus === 'ADMIN') && Number(userId) !== selectedUser"
              @mousedown.stop="kickFromChannel(activeChannel, selectedUser)">
              Expulser</div>
            <div
              v-if="(userStatus === 'ADMIN' || userStatus === 'OWNER') && (selectedStatus !== 'OWNER' || selectedStatus === 'ADMIN') && selectedStatus !== 'BANNED' && Number(userId) !== selectedUser"
              @mousedown.stop="banFromChannel(activeChannel, selectedUser)">
              Bannir</div>
            <div
              v-if="(userStatus === 'ADMIN' || userStatus === 'OWNER') && (selectedStatus !== 'OWNER' || selectedStatus === 'ADMIN') && selectedStatus == 'BANNED' && Number(userId) !== selectedUser"
              @mousedown.stop="unBanFromChannel(activeChannel, selectedUser)">
              Debannir</div>
            <div
              v-if="userStatus === 'OWNER' && (selectedStatus !== 'OWNER' || selectedStatus === 'ADMIN') && selectedStatus == 'MEMBER' && Number(userId) !== selectedUser"
              @mousedown.stop="promoteFromChannel(activeChannel, selectedUser)">
              Promouvoir</div>
            <div v-if="userStatus === 'OWNER' && selectedStatus === 'ADMIN' && Number(userId) !== selectedUser"
              @mousedown.stop="demoteFromChannel(activeChannel, selectedUser)">
              Destituer</div>
            <div v-if="userStatus === 'OWNER' && selectedStatus === 'ADMIN' && Number(userId) !== selectedUser"
              @mousedown.stop="giveOwnershipChannelToUser(activeChannel, selectedUser)">
              Transferer les droits du channel</div>
            <div v-if="userStatus === 'OWNER' && Number(userId) == selectedUser"
              @mousedown.stop="deleteChannel(activeChannel, selectedUser)">
              Supprimer le serveur</div>
            <div v-if="userStatus !== 'OWNER' && Number(userId) == selectedUser"
              @mousedown.stop="leaveChannel(activeChannel, selectedUser)">
              Quitter le serveur</div>
            <!-- Autres options du menu contextuel -->
          </div>
        </li>
      </ul>
      <div v-if="showPrivateMessages" class="chat-content">
        <div v-for="   message    in    privateMessages   " :key="message" class="chat-message">
          <div class="message-header">
            <img :src="message.pathAvatar" alt="User Avatar" class="user-img" />
            <span class="user-nickname">{{ message.nickname + " " }}</span>
            <span class="message-date">{{ formatMessageDate(message.date) }}</span>
          </div>
          <div
            :class="{ 'my-message': message.userId1 === Number(userId), 'other-message': message.userId1 !== Number(userId) }">
            <template v-if="editingMessage !== message.date">
              <span @mousedown.stop="showContextMenu($event, message)">{{ message.content }}</span>
              <div v-if="selectedMessage === message.content" class="context-menu"
                :style="{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }" @mouseup.stop="closeDropdown">
                <div @mousedown.stop="startEditing(message.date, message.content)">Modifier</div>
                <div @mousedown.stop="deleteMsg(activeUser, message.date)">Supprimer</div>
              </div>
            </template>
            <template v-else>
              <input type="text" v-model="editingContent"
                @keyup.enter="updateMsg(activeUser, message.date, editingContent)">
              <button @click="updateMsg(activeUser, message.date, editingContent)"> ✓</button>
            </template>
          </div>
        </div>
      </div>
      <div v-if="showChannels" class="chat-content">
        <div v-for="   message    in    allMessageFromChannel   " :key="message" class="chat-message">
          <div class="message-header">
            <img :src="message.pathAvatar" alt="User Avatar" class="user-img" />
            <span class="user-nickname">{{ message.nickname + " " }}</span>
            <span class="message-date">{{ formatMessageDate(message.date) }}</span>
          </div>
          <div
            :class="{ 'my-message': message.userId1 === Number(userId), 'other-message': message.userId1 !== Number(userId) }">
            <template v-if="editingMessage !== message.date">
              <span @mousedown.stop="showContextMenu($event, message)">{{ message.content }}</span>
              <div v-if="selectedMessage === message.content" class="context-menu"
                :style="{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }" @mouseup.stop="closeDropdown">
                <div @mousedown.stop="startEditing(message.date, message.content)">Modifier</div>
                <div @mousedown.stop="deleteMsg(activeUser, message.date)">Supprimer</div>
              </div>
            </template>
            <template v-else>
              <input type="text" v-model="editingContent"
                @keyup.enter="updateMsgToChannel(activeChannel, message.date, editingContent)">
              <button @click="updateMsgToChannel(activeChannel, message.date, editingContent)"> ✓</button>
            </template>
          </div>
        </div>
        <p class="muted-banned" v-if="userStatus === 'BANNED'">Vous avez été banni</p>
        <p class="muted-banned" v-if="userStatus === 'MUTED'">Vous avez été mute</p>
        <p class="invited" v-if="userStatus === 'INVITED'">Vous avez été invité,aller dans channel</p>
      </div>
    </div>
    <div class="chat-input-container">
      <img :src="myAvatarPath" alt="My Avatar" class="my-img" />
      <!-- <span class="status-indicator" :class="userStatusColor">Online</span> -->
      <span class="my-nickname">{{ myNickname }}</span>
      <input v-if="activeUser || activeChannel" id="messageContent" type="text" placeholder="Envoyer un message"
        v-model="messageContent"
        @keyup.enter="activeChannel ? sendMsgToChannel(activeChannel, messageContent) : sendMsg(activeUser, messageContent)" />
    </div>
  </div>
</template>
<script>
import { useCookies } from "vue3-cookies"; // cookies
import { ref, reactive, onMounted } from 'vue';
export default {
  props: ['friendFromRelation', 'channel', 'createDuel'],
  setup(props, context) {
    const { cookies } = useCookies();
    const state = reactive({
      userId: cookies.get("userId"),
      token: cookies.get("authToken"),
      cookies,
      privateMessages: [],
      privateMessageList: [],
      activeUser: null,
      isPrivateChatOpen: true,
      editingMessage: null,
      messageContent: '',
      showPrivateMessages: false,
      selectedMessage: null,
      menuPosition: { x: 0, y: 0 },
      editingContent: '',
      usersData: {},
      privateMessageListId: [],
      pmFromChannel: null,
      myAvatarPath: null,
      myNickname: null,
      joinedChannels: [],
      activeChannel: null,
      usersOfChannel: [],
      userStatus: null,
      selectedUser: null,
      selectedStatus: null,
      messageOwnerStatus: null,
      allMessageFromChannel: [],
      showChannels: false,
      showChannelsUsers: false,
      status: null,
      otherstatus: null,
      blockedList: [],
    });
    onMounted(() => {
      getUserAvatarNickName();
      startLoopChat();   // Exécutez la boucle toutes les 1 seconde
      document.addEventListener('click', closeDropdown);
    });
    onUnmounted(() => {
      document.removeEventListener('click', closeDropdown);
    });
    const createDuel = (user) => {
      context.emit('createDuel', user);
    };
    const handleButtonClick = (event, user) => {
      getMsgs(user);
      showUserContextMenu(event, user);
    };
    const addToPrivateChat = (user) => {
      if (!state.privateMessageList.includes(user.username)) {
        state.privateMessageList.push(user.username);
        state.privateMessageListId.push(user.userId);
        changeChat('private');
        state.pmFromChannel = user.name;
      }
    };

    const getBlockedList = async () => {// fonctionne
      try {
        const baseUrl = `http://${window.location.hostname}`;
        const response = await fetch(`${baseUrl}:2000/relation/findMyBlocked/${state.userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.token}`,
          },
        });
        const newblockedList = await response.json();
        state.blockedList = newblockedList;
        // console.log(state.blockedList);
      } catch (error) {
        // console.log(error);
        return;
      }
    };
    const haveMessagesChanged = (oldMessages, newMessages) => {
      // Comparer la longueur des listes
      if (oldMessages.length !== newMessages.length) return true;

      // Comparer chaque message
      for (let i = 0; i < oldMessages.length; i++) {
        if (oldMessages[i].id !== newMessages[i].id ||
          oldMessages[i].content !== newMessages[i].content) {
          return true;
        }
      }
      return false;
    };
    const showContextMenu = (event, message) => {
      event.preventDefault(); // Pour empêcher le menu contextuel par défaut du navigateur

      if (message.userId1 === Number(state.userId) || message.userId === Number(state.userId) || state.userStatus === 'OWNER' || state.userStatus === 'ADMIN') {
        state.selectedMessage = message.content;
        state.menuPosition.x = event.clientX;
        state.menuPosition.y = event.clientY;

        event.stopPropagation();
      }
    };

    document.addEventListener('click', (event) => {
      // Fermer le menu contextuel seulement si l'utilisateur clique en dehors du menu
      if (!event.target.classList.contains('context-menu')) {
        closeDropdown();
      }
    });

    const closeDropdown = () => {
      // event.preventDefault();
      // Ajouter un délai avant de fermer le menu peut parfois aider
      setTimeout(() => {
        state.selectedMessage = null;
        state.selectedUser = null;
      }, 1000);
    };

    const showUserContextMenu = (event, user) => {
      // event.preventDefault();
      state.selectedUser = user.userId;
      state.selectedStatus = user.status;
      state.menuPosition.x = event.clientX;
      state.menuPosition.y = event.clientY;
      if (state.showPrivateMessages != false) {
        getMsgs(user.userId);
      }
      event.stopPropagation();
    };
    const formatMessageDate = (date) => {
      const messageDate = new Date(date);
      const now = new Date();

      if (!isNaN(messageDate)) {
        if (messageDate.toDateString() === now.toDateString()) {
          // Si la date du message est aujourd'hui
          return "Aujourd'hui à " + messageDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        } else if (messageDate.toDateString() === new Date(now.setDate(now.getDate() - 1)).toDateString()) {
          // Si la date du message est hier
          return "Hier à " + messageDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        } else {
          // Si la date du message est avant hier
          return messageDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) + " à " + messageDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        }
      } else {
        // console.error('Invalid date:', date);
        return;
      }
    };
    const showProfile = async (friend) => {
      context.emit('showProfile', friend);
    };
    const changeChat = async (chat, event) => {
      if (chat == "private") {
        state.showPrivateMessages = true;
        state.showChannels = false;
        state.activeChannel = null;
        event.target.classList.add('active-chat');
      }
    };
    const startEditing = (date, content) => {
      state.editingMessage = date;
      state.editingContent = content; // Initialisez avec le contenu actuel
    };
    const finishEditing = () => {
      state.editingMessage = null;
    };
    const getUser = async (user) => {
      try {
        const baseUrl = `http://${window.location.hostname}`;
        const field = "nickname";
        const searchstring = user; // user's nickname
        const sort = "id";
        const asc = "asc";
        const response = await fetch(`${baseUrl}:2000/api/users/${field}/${searchstring}/${sort}/${asc}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.token}`,
          },
        });
        const data = await response.json();
        // console.log(data);
        return data;
      } catch (error) {
        return;
      }
    };
    const getUserAvatarNickName = async () => {
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/api/user/id/${state.userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
      });
      const data = await response.json();
      state.myAvatarPath = data.pathAvatar;
      state.myNickname = data.nickname;
      // await heartCheckMySelf();
    };
    const getUserById = async (id) => {
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/api/user/id/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
      });
      const data = await response.json();
      // console.log(data);
      // console.log(`User for ID ${id}:`, data); // Ajoutez cette ligne
      return data;
    };
    const sendMsg = async (otherUser) => {
      const baseUrl = `http://${window.location.hostname}`;
      const input = document.querySelector('input');
      const msg = input.value;
      if (msg && msg.length <= 500) {
        const response = await fetch(`${baseUrl}:2000/privateMessage/newMessageToUser/${state.userId}/${otherUser}/${msg}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.token}`,
          },
        });
        // console.log(response.json());
        state.messageContent = ''; // Effacez le contenu du message après l'envoi
      }
    };
    const closeChat = () => {
      context.emit('close');
    };

    const getPMList = async () => {
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/privateMessage/getAllUserWithPrivateMessage/${state.userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
      });

      const newPrivateMessageListId = await response.json();
      const newPrivateMessageList = [];

      if (props.friendFromRelation) {
        const search = await getUser(props.friendFromRelation);

        if (search && search.length > 0 && !newPrivateMessageListId.includes(search[0].id)) {
          newPrivateMessageListId.push(search[0].id);
        }
      }
      if (state.pmFromChannel) {
        const search = await getUser(state.pmFromChannel);

        if (search && search.length > 0 && !newPrivateMessageListId.includes(search[0].id)) {
          newPrivateMessageListId.push(search[0].id);
        }
      }

      for (let i = 0; i < newPrivateMessageListId.length; i++) {
        var temp = await getUserById(newPrivateMessageListId[i]);
        if (!newPrivateMessageList.includes(temp))
          newPrivateMessageList.push(temp);
        // Stockez les données utilisateur
        state.usersData[newPrivateMessageListId[i]] = temp;
      }

      state.privateMessageList = newPrivateMessageList;
      state.privateMessageListId = newPrivateMessageListId;
    };
    const getMsgs = async (otherUser) => {
      if (!otherUser) {
        // console.log('Aucun utilisateur actif sélectionné');
        return;
      }
      const baseUrl = `http://${window.location.hostname}`;
      var idtofind = null;
      for (let i = 0; i < state.privateMessageList.length; i++)
        if (state.privateMessageList[i] == otherUser)
          idtofind = state.privateMessageListId[i];
      if (idtofind)
        state.activeUser = idtofind;
      const response = await fetch(`${baseUrl}:2000/privateMessage/getAllMessageFromUser/${state.userId}/${state.activeUser}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
      });
      const newMessages = await response.json();

      // Mettre à jour les messages seulement s'ils ont changé
      if (haveMessagesChanged(state.privateMessages, newMessages)) {
        state.privateMessages = newMessages;
      }


      for (let message of state.privateMessages) {
        let user = state.usersData[message.userId1];
        if (!user) {
          // Si les données de l'utilisateur ne sont pas disponibles, les récupérer
          user = await getUserById(message.userId1);
          state.usersData[message.userId1] = user;
        }
        if (user) {
          message.nickname = user.nickname;
          message.pathAvatar = user.pathAvatar;
        }
      }
    };

    const updateMsg = async (otherUser, dateMsg, content) => {
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/privateMessage/updateMessageToUser/${state.userId}/${otherUser}/${dateMsg}/${content}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
      });
      finishEditing();
    };
    const deleteMsg = async (otherUser, dateMsg) => {
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/privateMessage/deleteMessageToUser/${state.userId}/${otherUser}/${dateMsg}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
      });
    };
    const joinedChannel = async () => {
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/channel/myChannel/${state.userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
      });
      const newMyChannelListId = await response.json();
      // console.log(newMyChannelListId);
      const newMyChannelList = [];
      for (let i = 0; i < newMyChannelListId.length; i++) {
        var temp = newMyChannelListId[i];
        if (!newMyChannelList.some(channel => channel.name === temp.name))
          newMyChannelList.push(temp);
      }
      state.joinedChannels = newMyChannelList;
    };
    const changeChannel = (channel) => {
      state.activeChannel = channel.id;
      state.showPrivateMessages = false;
      state.showChannels = true;
      changeChat('channel');
      getUsersOfChannel(channel.id);
    };
    const refreshChats = async () => {
      try {
        if (state.activeUser)
          await getMsgs(state.activeUser);
        await getPMList();
        await joinedChannel();
        await getBlockedList();
        if (state.activeChannel) {
          await getUsersOfChannel(state.activeChannel);
          await getAllMessageFromChannel(state.activeChannel);
        }
        // await heartCheck();
        // console.log(state.activeChannel);
        // console.log(state.userStatus);
        // console.log(state.allMessageFromChannel);
        // console.log(state.joinedChannels);
        // console.log(state.privateMessageList);
      } catch (error) {
        // console.error('Erreur lors de la mise à jour des chats :', error);
      }
    };
    const getUsersOfChannel = async (channelId) => {

      const baseUrl = `http://${window.location.hostname}`;
      state.activeChannel = channelId;
      const response = await fetch(`${baseUrl}:2000/channel/getUsersOfChannel/${channelId}/${state.userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
      });
      const users = await response.json();
      const userIds = users.map(user => user.userId);

      // Supprimer les utilisateurs qui ne sont plus dans la liste
      state.usersOfChannel = state.usersOfChannel.filter(user => userIds.includes(user.userId));

      for (let user of users) {
        const userData = await getUserById(user.userId);
        const existingUser = state.usersOfChannel.find(u => u.userId === user.userId);
        if (existingUser) {
          existingUser.nickname = userData.nickname;
          existingUser.pathAvatar = userData.pathAvatar;
          existingUser.status = user.status;
        } else {
          state.usersOfChannel.push({
            userId: user.userId,
            nickname: userData.nickname,
            pathAvatar: userData.pathAvatar,
            status: user.status
          });
        }
      }
      for (let user of users) {
        if (user.userId === Number(state.userId)) {
          state.userStatus = user.status;
          break;
        }
      }
      // Trier les utilisateurs par statut
      const statusOrder = ['OWNER', 'ADMIN', 'MEMBER', 'BANNED'];
      state.usersOfChannel.sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));
      changeChat('channel');
    };
    const getAllMessageFromChannel = async (channelId) => {
      if (!channelId) {
        state.activeChannel = null;
        return;
      }
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/channel/getAllMessageFromChannel/${channelId}/${state.userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
      });
      const newMessages = await response.json();
      const filteredMessages = newMessages.filter(message => !state.blockedList.includes(message.userId));

      // Check if the filtered messages have changed
      if (haveMessagesChanged(state.allMessageFromChannel, filteredMessages)) {
        // Update the messages only if they have changed
        state.allMessageFromChannel = filteredMessages;
      } else {
        // If the filtered messages have not changed, return early
        return;
      }

      for (let message of state.allMessageFromChannel) {
        let user = state.usersData[message.userId];
        if (!user) {
          user = await getUserById(message.userId);
          state.usersData[message.userId1] = user;
        }
        if (user) {
          message.nickname = user.nickname;
          message.pathAvatar = user.pathAvatar;
        }
      }
      state.activeChannel = channelId;
      changeChat('channel');
    };
    const sendMsgToChannel = async (activeChannel) => {
      const baseUrl = `http://${window.location.hostname}`;
      const input = document.querySelector('input');
      const msg = input.value;
      if (msg && msg.length <= 500) {
        const response = await fetch(`${baseUrl}:2000/channel/newMessageToChannel/${activeChannel}/${state.userId}/${msg}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.token}`,
          },
        });
        // console.log(response.json());
        state.messageContent = ''; // Effacez le contenu du message après l'envoi
      }
    };
    const updateMsgToChannel = async (activeChannel, dateMsg, content) => {
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/channel/updateMessageToChannel/${activeChannel}/${state.userId}/${dateMsg}/${content}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
      });
      finishEditing();
    };
    const deleteMsgToChannel = async (activeChannel, idmsg, dateMsg) => {
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/channel/deleteMessageFromChannel/${activeChannel}/${state.userId}/${idmsg}/${dateMsg}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
      });
    };
    const kickFromChannel = async (channelId, userIdToKick) => {
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/channel/KickFromChannel/${channelId}/${state.userId}/${userIdToKick}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
      });
    };
    const muteFromChannel = async (channelId, userIdToMute) => {
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/channel/muteFromChannel/${channelId}/${state.userId}/${userIdToMute}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
      });
    };
    const unMuteFromChannel = async (channelId, userIdToUnMute) => {
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/channel/unmuteFromChannel/${channelId}/${state.userId}/${userIdToUnMute}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
      });
    };
    const banFromChannel = async (channelId, userIdToBan) => {
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/channel/banFromChannel/${channelId}/${state.userId}/${userIdToBan}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
      });
    };

    const unBanFromChannel = async (channelId, userIdToUnBan) => {
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/channel/unBanFromChannel/${channelId}/${state.userId}/${userIdToUnBan}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
      });
    };
    const demoteFromChannel = async (channelId, userIdToDemote) => {
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/channel/demoteFromChannel/${channelId}/${state.userId}/${userIdToDemote}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
      });
    };
    const promoteFromChannel = async (channelId, userIdToPromote) => {
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/channel/promoteFromChannel/${channelId}/${state.userId}/${userIdToPromote}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
      });
    };
    const leaveChannel = async () => {
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/channel/leaveChannel/${state.activeChannel}/${state.userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
      });
      state.activeChannel = null;
      state.showChannelsUsers = false
      state.showChannels = false;
      state.showPrivateMessages = true;
      state.usersOfChannel = [];
    };
    const deleteChannel = async () => {
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/channel/deleteChannel/${state.activeChannel}/${state.userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
      });
      state.activeChannel = null;
      state.showChannelsUsers = false
      state.showChannels = false;
      state.showPrivateMessages = true;
      state.usersOfChannel = [];
    };
    const giveOwnershipChannelToUser = async (channelId, userIdToPromote) => {
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/channel/giveOwnershipChannelTo/${channelId}/${state.userId}/${userIdToPromote}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
      });
    };
    const startLoopChat = () => {
      refreshChats(); // Appel initial
      setInterval(refreshChats, 500); // Exécutez la boucle toutes les 5 secondes
    };
    return {
      ...toRefs(state),
      addToPrivateChat,
      showContextMenu,
      showUserContextMenu,
      closeDropdown,
      formatMessageDate,
      getMsgs,
      updateMsg,
      deleteMsg,
      refreshChats,
      startLoopChat,
      sendMsg,
      closeChat,
      showProfile,
      changeChat,
      startEditing,
      finishEditing,
      getUserById,
      getUser,
      getPMList,
      joinedChannel,
      changeChannel,
      getUsersOfChannel,
      getAllMessageFromChannel,
      sendMsgToChannel,
      updateMsgToChannel,
      deleteMsgToChannel,
      kickFromChannel,
      muteFromChannel,
      unMuteFromChannel,
      banFromChannel,
      unBanFromChannel,
      demoteFromChannel,
      promoteFromChannel,
      leaveChannel,
      deleteChannel,
      giveOwnershipChannelToUser,
      createDuel,
      // heartCheck,
      handleButtonClick,
      // userStatusColor,
      getBlockedList,
    };
  },
};
</script>


<style>
@import '~/assets/css/chat.css';
</style>