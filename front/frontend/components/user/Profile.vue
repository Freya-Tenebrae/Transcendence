<!-- Profile.vue -->
<template>
  <!--  Page de profil -->
  <div v-if="isProfileOpen" class="custom-modal-background">
    <div class="custom-modal">
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
              <p class="user-nickname-profile">{{ currentNickname }}</p>
              <img :src="currentUserAvatar" class="profile-img resized-image" />
              <button @click="closeProfilePage" class="profile-btn">Retour</button>
              <p></p>
              <!-- Temporaire : bouton de modification de profil -->
              <button v-if="currentUser == userId" @click="closeProfilePage, showProfileModal = true"
                class="profile-btn">Modifier le profil</button>
            </div>
          </div>
          <div class="tab-item">
            <div v-show="currentIndex === 1">
            <!-- Onglet des succès -->
            <div v-show="achievementIndex === 0">
              <div class="custom-modal-body">
                <div class="achievement-list">
                  <div class="uniqueAchievement" v-for="achievement in achievementList" :key="achievement.id">
                    <div class="achievement-img-div">
                      <img class="achievement-img resized-image" v-if="achievementIsDone(achievement.id) == false" :src="achievement.pathImage"/>
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
        </div>
          <div class="tab-item">
            <!-- Onglet des parties jouées -->
            <div v-show="currentIndex === 2">
              <div class="custom-modal-body">
                <div class="last10games-list">
                  <div v-for="game in last10Games" :key="game.id">
                    <div :class="{ 'gameWin': gameResult(game).scoreUser1 > gameResult(game).scoreUser2, 'gameLoose': gameResult(game).scoreUser1 < gameResult(game).scoreUser2, 'gameDraw': gameResult(game).scoreUser1 == gameResult(game).scoreUser2 }">
                      <div class="gameItem">
                        <div class="gameDate">
                          <p>{{ game.date }}</p> 
                        </div>
                        <div class="myInfo">
                            <img class="myImage" :src="currentUserAvatar"/>
                            <p class="myName">{{ currentNickname }}</p>
                        </div>
                        <div class="result">
                          <div class="result Status"></div>
                          <div class= "score">
                            <span class="myScore">{{ gameResult(game).scoreUser1 }}</span>
                            <span class="vs">-</span>
                            <span class="foeScore">{{ gameResult(game).scoreUser2 }}</span>
                          </div>
                        </div>
                        <div class="foeInfo">
                          <img class="foeImage" :src="gameResult(game).opponentImage"/>
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
            <input type="text" class="form-control" id="avatar" name="avatar"
              placeholder="Entrez l'URL de votre image de profil" v-model="currentUserAvatar">
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
      currentPassword: '',
      currentUser: null,
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
    });

    onMounted(async () => {
      if (props.otherUserId) {
        await getUserById(props.otherUserId);
      } else {
        await getUserById(state.userId);
      }
      state.show2FA = false;
      await status2FA(); // Ajoutez cette ligne
      state.last10Games = await getLast10Games();
      state.achievementList = await getAchievementList();
      state.currentAchievements = await getAchievementsDone();
    });

    const achievementIsDone = (id) => {
      for (let i = 0; i < state.currentAchievements.length; i++)
      {
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
      state.currentUserEmail = data.email;
      state.currentNickname = data.nickname;
      state.currentPassword = data.password;
      state.currentUserAvatar = data.pathAvatar;
      state.currentUser = data.id;
      // console.log(data);
      return data;
    };
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
      else if (state.showPasswordChange && password === state.currentPassword) {
        state.formErrors.push('Le mot de passe n\'a pas été modifié.');
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

          if (!emailUpdateResponse.ok) throw new Error('Erreur lors de la mise à jour de l’e-mail');
        }

        if (state.showPasswordChange) {
          const password = formData.get('password');
          const passwordObject = {
            salted_password: password,
          }
          const passwordUpdateResponse = await fetch(`${baseUrl}:2000/api/chpassword`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ id: userId, password: passwordObject })
          });

          if (!passwordUpdateResponse.ok) throw new Error('Erreur lors de la mise à jour du mot de passe');
        }

        if (state.showNicknameChange) {
          const nickname = formData.get('nickname');
          const nicknameUpdateResponse = await fetch(`${baseUrl}:2000/api/chuser`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ id: userId, nickname: nickname }) // Update the payload to match CreateUserDTO expected on the server
          });

          if (!nicknameUpdateResponse.ok) {
            const errorData = await nicknameUpdateResponse.json();
            throw new Error(errorData.message || 'Erreur lors de la mise à jour du nom d’utilisateur');
          }
        }
        if (state.showAvatarChange) {
          const avatar = formData.get('avatar');

          const avatarUpdateResponse = await fetch('http://localhost:2000/api/chuser', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ id: userId, pathAvatar: avatar })
          });

          if (!avatarUpdateResponse.ok) throw new Error('Erreur lors de la mise à jour de la photo d\'avatar');
        }

        alert('Profil mis à jour avec succès');
      } catch (error) {
        console.error(error);
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
    const getUserNick = async (id) => {
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/api/user/id/${id}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${state.token}`,
          },
      });
      const data = await response.json();
      return data.nickname;
    };
    const fetchUser = async (id) => {
      if (!state.users[id]) {
        const user = await getUserNick(id);
        state.users[id] = user;
      }
    };
    const gameResult = (game) => {
      const data = {
        opponentNickname: '',
        opponentImage: '',
        result: '',
        scoreUser1: 0,
        scoreUser2: 0,
      };
      if (game.userId1 == state.userId) {
        data.scoreUser1 = game.scoreUser1;
        data.scoreUser2 = game.scoreUser2;
        fetchUser(game.userId2);
        data.opponentNickname = state.users[game.userId2];
        data.opponentImage = state.users[game.userId2];
        if (game.scoreUser1 > game.scoreUser2)
          data.result = 'Victoire';
        else if (game.scoreUser1 < game.scoreUser2)
          data.result = 'Défaite';
        else
          data.result = 'Egalité';
      }
      else {
        data.scoreUser1 = game.scoreUser2;
        data.scoreUser2 = game.scoreUser1;
        fetchUser(game.userId1);
        data.opponentNickname = state.users[game.userId1];
        if (game.scoreUser1 > game.scoreUser2)
          data.result = 'Défaite';
        else if (game.scoreUser1 < game.scoreUser2)
          data.result = 'Victoire';
        else
          data.result = 'Egalité';
      }
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
      state.formErrors = [];
    };
    const closeProfilePage = () => {
      context.emit('closeProfile');
      if (state.otherUserId)
        context.emit('clearOtherUserId');
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
      fetchUser,
      gameResult,
    };
  },
};
</script>
<style> @import '~/assets/css/profile.css';
</style>