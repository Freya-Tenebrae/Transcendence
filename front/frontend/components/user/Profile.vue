<!-- Profile.vue -->
<template>
  <!--  Page de profil -->
  <div v-if="isProfileOpen" class="custom-modal-background">
    <div class="profile-modal">
      <div class="custom-modal-header">
        <h5>Profil</h5>
        <span @click="closeProfilePage" class="custom-modal-close">&times;</span>
      </div>
      <div class="tab">
        <div class="profile-header">
          <div class="tab-profile" v-for="(tabItem, index) in tabs" :key="index" @click="changeIndex(index)"
            :class="{ 'active-tab': tab === index }">{{ tabItem.name }}
          </div>
        </div>
        <div class="tab-item">
          <div v-show="currentIndex === 0">
            <div class="custom-modal-body">
              <p class="status-indicator-profile" :style="{ color: userStatusColor }">{{ userStatusText }}</p>
              <p class="user-nickname-profile">{{ currentNickname }}</p>
              <img :src="currentUserAvatar" class="profile-img resized-image" />
              <div class="bottomButton">
                <button @click="closeProfilePage" class="profile-btn">Retour</button>
                <button v-if="currentUser == userId" @click="closeProfilePage, showProfileModal = true"
                  class="profile-btn">Modifier le profil</button>
              </div>
            </div>
          </div>
          <div class="tab-item">
            <div v-show="currentIndex === 1">
              <!-- Onglet des succès -->
              <div class="custom-modal-body">
                <div class="achievement-list">
                  <div class="uniqueAchievement" v-for="achievement in achievementList" :key="achievement.id">
                    <div class="achievement-img-div">
                      <img class="achievement-img resized-image" v-if="achievementIsDone(achievement.id) == true"
                        :src="achievement.pathImage" />
                    </div>
                    <div class="achievement-item">
                      <p>{{ achievement.name }} :</p>
                      <p>{{ achievement.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="tab-item">
            <!-- Onglet des parties jouées -->
            <div v-show="currentIndex === 2">
              <div class="custom-modal-body">
                <div class="last10games-list">
                  <div v-for="game in last10Games" :key="game.id">
                    <div
                      :class="{ 'gameWin': gameResult(game).scoreUser1 > gameResult(game).scoreUser2, 'gameLoose': gameResult(game).scoreUser1 < gameResult(game).scoreUser2, 'gameDraw': gameResult(game).scoreUser1 == gameResult(game).scoreUser2 }">
                      <div class="gameItem">
                        <div class="gameInfo">
                          <p>{{ game.isRanked ? "Cyber" : "Casual" }}</p>
                          <p>{{ gameResult(game).date }}</p>
                        </div>
                        <div class="myInfo">
                          <img class="myImage" :src="currentUserAvatar" />
                        </div>
                        <div class="score">
                          <span class="myScore">{{ gameResult(game).scoreUser1 }}</span>
                          <span class="vs">-</span>
                          <span class="foeScore">{{ gameResult(game).scoreUser2 }}</span>
                        </div>
                        <div>
                          <img class="foeImage" :src="gameResult(game).opponentImage" />
                        </div>
                        <div class="foeInfo">
                          <p class="foeName">{{ gameResult(game).opponentNickname }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Afficher le formulaire de modification de compte -->
  <div v-if="showProfileModal" class="custom-modal-background">
    <div class="custom-modal">
      <div class="custom-modal-header">
        <h5>Modifier les informations du profil</h5>
        <span @click="closeProfile" class="custom-modal-close">&times;</span>
      </div>
      <div class="custom-modal-body">
        <!-- Contenu des formulaires de modification -->
        <form @submit.prevent="submitProfile" id="profile">
          <div v-if="showEmailChange" class="form-group">
            <label for="email">Nouvel adresse e-mail :</label>
            <input type="email" class="form-control" id="email" name="email"
              placeholder="Entrez votre nouvel adresse e-mail">
          </div>
          <div v-if="showEmailChange" class="form-group">
            <label for="confirm-email">Confirmer adresse e-mail :</label>
            <input type="email" class="form-control" id="confirm-email" name="confirm-email"
              placeholder="Entrez à nouveau votre nouvelle adresse e-mail">
          </div>

          <!-- Formulaire de changement de pseudo -->
          <div v-if="showNicknameChange" class="form-group">
            <label for="nickname">Pseudo :</label>
            <input type="nickname" class="form-control" id="nickname" name="nickname" placeholder="Entrez votre pseudo"
              v-model="currentNickname">
          </div>

          <!-- Formulaire de changement de mdp -->
          <div v-if="showPasswordChange" class="form-group">
            <label for="password">Mot de passe :</label>
            <input type="password" class="form-control" id="password" name="password"
              placeholder="Entrez votre mot de passe">
          </div>

          <div v-if="showPasswordChange" class="form-group">
            <label for="confirm-password">Confirmez le mot de passe :</label>
            <input type="password" class="form-control" id="confirm-password" name="confirm-password"
              placeholder="Entrez à nouveau votre mot de passe">
          </div>

          <!-- Formulaire de changement d'avatar -->
          <div v-if="showAvatarChange" class="form-group">
            <label for="avatar">Entrez l'URL de votre image de profil :</label>
            <!-- <input type="text" class="form-control" id="avatar" name="avatar"
              placeholder="Entrez l'URL de votre image de profil" v-model="currentUserAvatar"> -->
            <input type="file" @change="uploadImage" accept="image/*" />
          </div>
          <!-- Formulaire de changement d'avatar -->
          <div v-if="show2FA" class="form-group">
            <label for="2FA"> {{ secret2FA }}</label>
            <img :src="img2FA" alt="">
          </div>
          <div v-if="showEditButtons" class="edit-buttons">
            <button @click="setActiveChange('email')" class="edit-btn">Modifier Email</button>
            <button @click="setActiveChange('password')" class="edit-btn">Modifier Mot de passe</button>
            <button @click="setActiveChange('nickname')" class="edit-btn">Modifier Pseudo</button>
            <button @click="setActiveChange('avatar')" class="edit-btn">Modifier Avatar</button>
            <button v-if="!FActive" @click="setActiveChange('2FA')" class="edit-btn">Activer le 2FA</button>
            <button v-if="FActive" @click="deactivate2FA" class="edit-btn">Desactiver le 2FA</button>
          </div>
          <div v-if="formErrors.length > 0">
            <ul>
              <li class="errors" v-for="error in formErrors" :key="error">{{ error }}</li>
            </ul>
          </div>
          <div v-if="showSubmit && !show2FA" class="custom-modal-footer">
            <button type="submit" class="btn btn-primary">Soumettre les modifications</button>
          </div>
        </form>
        <!-- Fin des formulaires de modif -->
      </div>
    </div>
  </div>
</template>
<script>
import { useCookies } from "vue3-cookies";
import { ref, reactive, onMounted } from 'vue';
import { validateEmail, validatePassword, validateNickname } from '../../script/validator';

export default {
  name: "Profile",
  props: ['otherUserId'],
  emits: ['closeProfile', 'clearOtherUserId'],
  data() {
    return {
      tab: null,
      tabs: [
        { name: 'Profil de joueur' },
        { name: 'Succès' },
        { name: 'Historique des parties' },
      ],
      achievementTabs: [
        { name: 'Liste des succès' },
        { name: 'Liste des succès débloqués' },
      ],
    };
  },
  setup(props, context) {
    const { cookies } = useCookies();
    const state = reactive({
      userId: cookies.get("userId"),
      token: cookies.get("authToken"),
      cookies,
      currentUserEmail: '',
      currentNickname: '',
      currentUser: null,
      currentUserId: 0,
      currentUserAvatar: '',
      showEmailChange: false,
      showPasswordChange: false,
      showNicknameChange: false,
      showProfilePage: false,
      showProfileModal: false,
      showAvatarChange: false,
      show2FA: false,
      showSubmit: false,
      showEditButtons: true,
      isProfileOpen: true,
      img2FA: '',
      secret2FA: '',
      FActive: false,
      formErrors: [],
      currentIndex: 0,
      achievementIndex: 0,
      users: [],
      last10Games: [],
      achievementList: [],
      currentAchievements: [],
      avatarLink: '',
      status: '',
    });

    onMounted(async () => {
      if (props.otherUserId) {
        await getUserById(props.otherUserId);
        await heartCheck(props.otherUserId);
      } else {
        await getUserById(state.userId);
        await heartCheck(state.userId);
      }
      state.show2FA = false;
      await status2FA(); // Ajoutez cette ligne
      state.last10Games = await getLast10Games();
      state.achievementList = await getAchievementList();
      state.currentAchievements = await getAchievementsDone();

    });

    const achievementIsDone = (id) => {
      for (let i = 0; i < state.currentAchievements.length; i++) {
        if (id == state.currentAchievements[i].archivementId)
          return true;
      }
      return false;
    };

    const active2FA = async () => {
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/auth/activate-otp`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
      });
      const data = await response.json();
      state.secret2FA = data.secret;
      state.img2FA = data.img;
      state.FActive = true;
    };
    const status2FA = async () => {
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/auth/status-otp`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
      });
      const data = await response.json();
      state.FActive = data;
    }
    const deactivate2FA = async () => {
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/auth/deactivate-otp`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
      });
      const data = await response.json();
      state.FActive = false;
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
      //  console.log(`User for ID ${id}:`, data);
      state.currentUserId = id;
      if (data) {
        state.currentUserEmail = data.email;
        state.currentNickname = data.nickname;
        state.currentUserAvatar = data.pathAvatar;
        state.currentUser = data.id;
        // console.log(data);
        return data;
      }
      //else console.log("User not found");
    };
    const heartCheck = async (id) => {
      const token = state.cookies.get('authToken');
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/auth/heartcheck?id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json();
      state.status = result.state;
    };
    const userStatusColor = computed(() => {
      if (state.status === 'online') {
        return 'green';
      } else {
        return 'red';
      }
    });

    const userStatusText = computed(() => {
      if (state.status === 'online') {
        return 'En ligne';
      } else {
        return 'Hors ligne';
      }
    });
    const validateForm = () => {
      state.formErrors = []; // réinitialiser les erreurs

      const formData = new FormData(document.querySelector('#profile'));
      const email = formData.get('email');
      const password = formData.get('password');
      const nickname = formData.get('nickname');
      const confirmEmail = formData.get('confirm-email');
      const confirmPassword = formData.get('confirm-password');

      if (!validateEmail(email) && state.showEmailChange) {
        state.formErrors.push('L\'adresse e-mail n\'est pas valide.');
      } else if (email !== confirmEmail) {
        state.formErrors.push('Les adresses e-mail ne correspondent pas.');
      }
      else if (state.showEmailChange && email === state.currentUserEmail) {
        state.formErrors.push('L\'adresse e-mail n\'a pas été modifiée.');
      }

      if (!validatePassword(password) && state.showPasswordChange) {
        state.formErrors.push('Le mot de passe ne respecte pas les critères de sécurité requis.');
      } else if (password !== confirmPassword) {
        state.formErrors.push('Les mots de passe ne correspondent pas.');
      }

      if (!validateNickname(nickname) && state.showNicknameChange) {
        state.formErrors.push('Le pseudo n\'est pas valide ou est déjà pris.');
      }
      else if (state.showNicknameChange && nickname.length > 12) {
        state.formErrors.push('Le pseudo ne doit pas dépasser 12 caractères.');
      }
      return state.formErrors.length === 0; // retourne vrai si aucune erreur
    };

    const submitProfile = async () => {
      const token = state.cookies.get('authToken');
      const userId = +state.cookies.get('userId');
      const baseUrl = `http://${window.location.hostname}`;

      const formData = new FormData(document.querySelector('#profile'));
      if (!validateForm()) {
        // Si le formulaire n'est pas valide, on ne procède pas à l'envoi
        return;
      }

      try {
        if (state.showEmailChange) {
          const email = formData.get('email');
          const emailUpdateResponse = await fetch(`${baseUrl}:2000/api/chuser`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ id: userId, email: email })
          });

          const responseBody = await emailUpdateResponse.json();
          if (responseBody.error === 'already exists') {
            state.formErrors.push('L\'adresse e-mail est déjà prise.');
            return;
          }
          else if (responseBody.error === 'invalid email') {
            state.formErrors.push('L\'adresse e-mail n\'est pas valide.');
            return;
          }
          else if (responseBody.error === 'email not changed') {
            state.formErrors.push('L\'adresse e-mail n\'a pas été modifiée.');
          }
        }

        if (state.showPasswordChange) {
          const password = formData.get('password');
          // const passwordObject = {
          //   salted_password: password,
          // }
          const passwordUpdateResponse = await fetch(`${baseUrl}:2000/api/chpassword`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ id: userId, password: password })
          });

          if (!passwordUpdateResponse.ok) throw new Error('Erreur lors de la mise à jour du mot de passe');
        }

        if (state.showNicknameChange) {
          const nickname = formData.get('nickname');
          const nicknameUpdateResponse = await fetch(`${baseUrl}:2000/api/chuser`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ id: userId, nickname: nickname }) // Update the payload to match CreateUserDTO expected on the server
          });
          // console.log(nicknameUpdateResponse);
          const responseBody = await nicknameUpdateResponse.json();
          // console.log(responseBody);
          if (responseBody.error === 'already exists') {
            state.formErrors.push('Le pseudo est deja pris.');
            return;
          }
        }

        if (state.showAvatarChange) {
          // const avatar = formData.get('avatar');
          const baseUrl = `http://${window.location.hostname}`;
          const avatarUpdateResponse = await fetch(`${baseUrl}:2000/api/chuser`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ pathAvatar: state.avatarLink })
          });
          // console.log(avatar);
          if (!avatarUpdateResponse.ok) throw new Error('Erreur lors de la mise à jour de la photo d\'avatar');
        }
        // console.log("avatar : " + formData.get('avatar'), "nickname : " + formData.get('nickname'), "password : " + formData.get('password'), "email : " + formData.get('email'));
        // console.log("avatar : " + state.currentUserAvatar, "nickname : " + state.currentNickname, "password : " + state.currentPassword, "email : " + state.currentUserEmail);
      } catch (error) {
        // console.error(error);
      }
    };
    const uploadImage = async (event) => {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch('https://api.imgur.com/3/image', {
          method: 'POST',
          headers: {
            Authorization: 'Client-ID 44bbc99956db00b',
            Accept: "application/json",
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        state.avatarLink = data.data.link;
        // console.log(`File uploaded successfully at ${data.data.link}`);
      } catch (error) {
        return;
      }
    };
    const setActiveChange = (changeType) => {
      // Réinitialiser tous les affichages
      state.showEmailChange = false;
      state.showPasswordChange = false;
      state.showNicknameChange = false;
      state.showAvatarChange = false;
      state.show2FA = false;
      state.FActive = false;
      state.showSubmit = true;
      state.showEditButtons = false;
      state.formErrors = [];
      // Activer l'affichage approprié
      if (changeType === 'email') {
        state.showEmailChange = true;
      } else if (changeType === 'password') {
        state.showPasswordChange = true;
      } else if (changeType === 'nickname') {
        state.showNicknameChange = true;
      } else if (changeType === 'avatar') {
        state.showAvatarChange = true;
      }
      else if (changeType === '2FA') {
        active2FA();
        state.show2FA = true;
      }
    };
    const changeIndex = (index) => {
      state.tab = index;
      state.currentIndex = index;
    };
    const changeAchievementIndex = (index) => {
      state.tab = index;
      state.achievementIndex = index;
    };
    const getLast10Games = async () => {
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/game/lastTenGameOf/${state.currentUser}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
      });
      const data = await response.json();
      return data;
    };
    const getUserData = async (id) => {
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/api/user/id/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
      });
      const data = await response.json();
      return data;
    };
    const fetchUser = async (id) => {
      if (!state.users[id]) {
        const user = await getUserData(id);
        state.users[id] = { nickname: user.nickname, pathAvatar: user.pathAvatar };
      }
    };
    const gameResult = (game) => {
      const data = {
        date: '',
        opponentNickname: '',
        opponentImage: '',
        result: '',
        scoreUser1: 0,
        scoreUser2: 0,
      };
      if (game.userId1 == state.currentUserId) {
        data.scoreUser1 = game.scoreUser1;
        data.scoreUser2 = game.scoreUser2;
        fetchUser(game.userId2);
        if (state.users[game.userId2] && state.users[game.userId2].nickname && state.users[game.userId2].pathAvatar) {
          data.opponentNickname = state.users[game.userId2].nickname;
          data.opponentImage = state.users[game.userId2].pathAvatar;
        }
        if (game.scoreUser1 > game.scoreUser2)
          data.result = 'Victoire';
        else if (game.scoreUser1 < game.scoreUser2)
          data.result = 'Défaite';
        else
          data.result = 'Egalité';
      }
      if (game.userId2 == state.currentUserId) {
        data.scoreUser1 = game.scoreUser2;
        data.scoreUser2 = game.scoreUser1;
        fetchUser(game.userId1);

        if (state.users[game.userId1] && state.users[game.userId1].nickname && state.users[game.userId1].pathAvatar) {
          data.opponentNickname = state.users[game.userId1].nickname;
          data.opponentImage = state.users[game.userId1].pathAvatar;
        }
        if (game.scoreUser1 > game.scoreUser2)
          data.result = 'Défaite';
        else if (game.scoreUser1 < game.scoreUser2)
          data.result = 'Victoire';
        else
          data.result = 'Egalité';
      }
      const old_date = new Date(game.date);
      data.date = (old_date.getDate() + '/' + (old_date.getMonth() + 1) + '/' + old_date.getFullYear() + ' : ' + old_date.getHours() + ':' + old_date.getMinutes());
      return data;
    };
    const getAchievementList = async () => {
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/archivement/findAllArchivements`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
      });
      const data = await response.json();
      return data;
    };
    const getAchievementsDone = async () => {
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/archivement/findArchivementsDone/${state.currentUser}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
      });
      const data = await response.json();
      return data;
    };
    const closeProfile = () => {
      state.showProfileModal = false;
      state.showEmailChange = false;
      state.showPasswordChange = false;
      state.showNicknameChange = false;
      state.showAvatarChange = false;
      state.showSubmit = false;
      state.show2FA = false;
      state.showEditButtons = true;
      // props.otherUserId = null;
      state.formErrors = [];
    };
    const closeProfilePage = () => {
      if (props.otherUserId) {
        context.emit('clearOtherUserId');
      }
      context.emit('closeProfile');
    };
    return {
      ...toRefs(state),
      getUserById,
      validateForm,
      submitProfile,
      achievementIsDone,
      setActiveChange,
      changeIndex,
      changeAchievementIndex,
      closeProfile,
      closeProfilePage,
      active2FA,
      deactivate2FA,
      status2FA,
      getLast10Games,
      getAchievementList,
      getAchievementsDone,
      getUserData,
      fetchUser,
      gameResult,
      uploadImage,
      heartCheck,
      userStatusText,
      userStatusColor,
    };
  },
};
</script>
<style> @import '~/assets/css/profile.css';
</style>