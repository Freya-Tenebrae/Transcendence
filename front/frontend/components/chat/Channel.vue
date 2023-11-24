<template>
  <div v-if="showChannels" class="channel-list">
    <span class="close-btn" @click="closeChannelList">&times;</span>
    <h2>Liste des Channels</h2>
    <ul>
      <li v-if="!inviteMode" v-for="channel in channelList" :key="channel.id" class="channel-item">
        <button class="channel-btn" @click="joinChannelPassword(channel)">{{ channel.name }}</button>
      </li>
      <li v-if="inviteMode" v-for="channel in inviteChannels" :key="channel.id" class="channel-item">s
        <button class="channel-btn" @click="inviteUserToChannel(channel.id, friendToInvite)">{{ "Inviter a : " +
          channel.name }}</button>
      </li>
    </ul>
    <button v-if="!showCreateChannelForm && !inviteMode" @click="showCreateChannelForm = true"
      class="create-channel-btn">Créer un
      Channel</button>
    <form v-if="showCreateChannelForm" class="create-channel-form"
      @submit.prevent="createChannel(newChannelName, newChannelPrivacy, newChannelPassword)">

      <h2>Créer un nouveau Channel</h2>
      <label>
        Nom du Channel :
        <input v-model="newChannelName" type="name">
      </label>
      <br>
      <input hidden type="text" autocomplete="username" value="{{...}}">
      <label>
        Mot de passe du Channel :
        <input v-model="newChannelPassword" type="password" autocomplete="new-password" placeholder="Mot de passe">
      </label>
      <br>
      <label>
        Privé :
        <input v-model="newChannelPrivacy" type="checkbox">
      </label>

      <!-- <label>
        Image du Channel :
        <input type="file" @change="uploadImage">
      </label> -->
      <br>
      <br>
      <div v-if="channelErrors.length > 0">
        <ul>
          <li class="errors" v-for="error in channelErrors" :key="error">{{ error }}</li>
        </ul>
      </div>
      <button type="submit" class="confirm-create">Créer</button>
      <br>
      <button type="button" class="cancel-btn" @click="showCreateChannelForm = false">Annuler</button>
    </form>
    <form v-if="showPasswordForm" class="password-form" @submit.prevent="joinChannel(selectedChannel)">
      <h2>Entrez le mot de passe pour "{{ selectedChannel?.name }}"</h2>
      <input hidden type="text" autocomplete="username" value="{{...}}">
      <input type="password" v-model="channelPassword" placeholder="Mot de passe" autocomplete="new-password">
      <button type="submit" class="confirm-create">Rejoindre</button>
      <button type="button" class="cancel-btn" @click="showPasswordForm = false">Annuler</button>
    </form>
  </div>
</template>
  
<script>
import { useCookies } from "vue3-cookies"; // cookies
import { onMounted, reactive, toRefs, ref } from "vue"; // reactive
export default {
  name: 'Channel',
  props: ['inviteMode', 'friendToInvite'],
  setup(props, context) {
    const { cookies } = useCookies();
    const state = reactive({
      userId: cookies.get("userId"),
      token: cookies.get("authToken"),
      cookies,
      channelList: [],
      channelListId: [],
      myChannels: [],
      usersOfChannel: [],
      activeChannel: null,
      inviteChannels: [],
      showChannels: true,
      activeChannelId: null,
      isChannelRoomVisible: false,
      editingMessage: null,
      messageContent: '',
      showCreateChannelForm: false,
      newChannelName: '',
      newChannelPassword: '',
      newChannelPrivacy: false,
      newChannelImage: null,
      showPasswordModal: false,
      channelErrors: [],
      selectedChannel: null,
      channelPassword: '',
      showPasswordForm: false,
    });
    onMounted(() => {
      startLoopChannelList();
    });
    const newChannelImage = ref(null);

    const uploadImage = async (event) => {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch('https://api.imgur.com/3/image', {
          method: 'POST',
          headers: {
            Authorization: 'Client-ID YOUR_CLIENT_ID'
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        newChannelImage.value = data.data.link;
        console.log(`File uploaded successfully at ${data.data.link}`);
      } catch (error) {
        return;
      }
    };
    ///////////////////////// Getter functions /////////////////////////////
    const getChannelList = async () => {
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/channel/PublicChannels`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
      });
      const newchannelListId = await response.json();
      const newchannelList = [];
      for (let i = 0; i < newchannelListId.length; i++) {
        var temp = newchannelListId[i];
        if (!newchannelList.some(channel => channel.name === temp.name))
          newchannelList.push(temp);
      }
      state.channelList = newchannelList;
      // console.log(state.channelList);
      //return state.channelList;
    };
    const getMyChannel = async () => {
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/channel/myChannel/${state.userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
      });
      const newMyChannelListId = await response.json();
      const newMyChannelList = [];
      for (let i = 0; i < newMyChannelListId.length; i++) {
        var temp = newMyChannelListId[i];
        if (!newMyChannelList.some(channel => channel.name === temp.name))
          newMyChannelList.push(temp);
      }
      state.myChannels = newMyChannelList;

      // Appeler getMyChannelWithPrivileges pour chaque channel dans myChannels
      const privilegesPromises = state.myChannels.map(channel => getMyChannelWithPrivileges(channel.id));

      // Attendre que toutes les promesses soient résolues
      const privilegesLists = await Promise.all(privilegesPromises);

      // Fusionner toutes les listes de privilèges en une seule liste
      state.inviteChannels = [].concat(...privilegesLists);
    };
    const getMyChannelWithPrivileges = async (channelId) => {
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/channel/myChannelWithPrivileges/${channelId}/${state.userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
      });
      const newMyChannelWithPrivileges = await response.json();
      return newMyChannelWithPrivileges;
    };
    ///////////////////////// refresh functions /////////////////////////////
    const refreshChannels = async () => {
      try {
        if (props.inviteMode)
          await getMyChannel();
        await getChannelList();
        state.channelErrors = [];
        // console.log(state.channelList);
      } catch (error) {
        return;
      }
    };
    const startLoopChannelList = async () => {
      refreshChannels();
      setInterval(refreshChannels, 2000); // Exécutez la boucle toutes les 5 secondes
    };
    const closeChannelList = () => {
      state.showChannels = false;
      context.emit('close-channel-list');
    };
    ///////////////////////// Create functions /////////////////////////////

    const createChannel = async (channelName, channelPrivacy, channelPass) => {
      const baseUrl = `http://${window.location.hostname}`;
      let response;
      if (!channelName) {
        state.channelErrors.push('Nom du channel manquant');
        return;
      }
      if (channelPass != null && channelPass != '' && channelName.length < 100 && channelPass.length < 100) {
        response = await fetch(`${baseUrl}:2000/channel/createChannel/${state.userId}/${channelName}/${channelPrivacy}/${channelPass}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.token}`,
          }
        });
      }
      else {
        response = await fetch(`${baseUrl}:2000/channel/createChannel/${state.userId}/${channelName}/${channelPrivacy}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.token}`,
          }
        });
        console.log(response);
        state.newChannelName = '';
      }
      // const responseBody = await response.json();
      // const images = ["https://i.imgur.com/z3HUWe3.jpg", "https://i.imgur.com/naivuJI.jpg", "https://i.imgur.com/bDfwYsn.jpg"];
      // const randomIndex = Math.floor(Math.random() * images.length);
      // const randomImage = images[randomIndex];
      // console.log(randomImage);
      // console.log(state.userId);
      // console.log(responseBody.id);
      // updateChannelImage(responseBody.id, randomImage);
    };

    ///////////////////////// Update functions ///////////////////////////// 
    const updateChannelName = async (channelId, newName) => {
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/channel/updateChannelName/${channelId}/${state.userId}/${newName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        }
      });
    };
    const updateChannelImage = async (channelId, newPathImage) => {
      const baseUrl = `http://${window.location.hostname}`;
      const encodedPathImage = encodeURIComponent(newPathImage);
      const response = await fetch(`${baseUrl}:2000/channel/updateChannelImage/${channelId}/${state.userId}/${encodedPathImage}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        }
      });
    };
    const updateChannelPrivacy = async (channelId, newPrivacy) => {
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/channel/updateChannelPrivacy/${channelId}/${state.userId}/${newPrivacy}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        }
      });
    };
    const updateChannelPassword = async (channelId, newPassword) => {
      const baseUrl = `http://${window.location.hostname}`;
      if (newPassword != null && newPassword != '' && newPassword.length < 100) {
        const response = await fetch(`${baseUrl}:2000/channel/updateChannelPassword/${channelId}/${state.userId}/${newPassword}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.token}`,
          }
        });
      }
      else {
        const response = await fetch(`${baseUrl}:2000/channel/updateChannelPassword/${channelId}/${state.userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.token}`,
          }
        });
      }
    };
    const joinChannelPassword = async (channel) => {
      state.selectedChannel = channel;
      state.showPasswordForm = true;
    };
    ///////////////////////// Join functions /////////////////////////////
    const joinChannel = async (channel) => {
      const baseUrl = `http://${window.location.hostname}`;
      const password = state.channelPassword;

      const response = await fetch(`${baseUrl}:2000/channel/joinChannel/${channel.id}/${state.userId}/${password}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
      });

      if (response.ok) {
        // Le canal a été rejoint avec succès, ou le canal n'avait pas besoin de mot de passe
        state.activeChannelId = channel.id;
        state.isChannelRoomVisible = true;
        closeChannelList();
        // Autres mises à jour d'état ou actions ici
      } else {
        // Gérer le cas où le serveur renvoie une erreur (par exemple, mot de passe incorrect)
        // alert("Impossible de rejoindre le canal. Vérifiez le mot de passe ou réessayez.");
      }
    };

    //////////////////////// Invite function /////////////////////////////
    const inviteUserToChannel = async (channelId, userIdInvited) => {
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/channel/inviteChannel/${channelId}/${state.userId}/${userIdInvited}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
      });
    };
    return { ...toRefs(state), uploadImage, newChannelImage, refreshChannels, closeChannelList, createChannel, updateChannelName, updateChannelImage, updateChannelPrivacy, updateChannelPassword, joinChannel, inviteUserToChannel, joinChannelPassword };
  },
};
</script>
  
<style>
@import '~/assets/css/channel.css';
</style>
  