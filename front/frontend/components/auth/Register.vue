<!-- Register.vue -->
<template>
  <!-- Afficher le formulaire d'inscription -->
  <div v-if="isRegisterOpen" class="custom-modal-background">
    <div class="custom-modal">
      <div class="custom-modal-header">
        <h5>Inscription</h5>
        <span @click="closeRegister" class="custom-modal-close">&times;</span>
      </div>
      <div class="custom-modal-body">
        <form @submit.prevent="submitForm" id="register">
          <div class="form-group">
            <label for="nickname">Pseudo :</label>
            <input type="nickname" class="form-control" id="nickname" name="nickname" required
              placeholder="Entrez votre pseudo">
          </div>

          <div class="form-group">
            <label for="email">Adresse e-mail :</label>
            <input type="email" class="form-control" id="email" name="email" required
              placeholder="Entrez votre adresse e-mail">
          </div>

          <div class="form-group">
            <label for="confirm-register-email">Confirmer l'adresse e-mail :</label>
            <input type="email" class="form-control" id="confirm-register-email" name="confirm-email" required
              placeholder="Entrez à nouveau votre adresse e-mail" autocomplete="username">
          </div>


          <div class="form-group">
            <label for="password">Mot de passe :</label>
            <input type="password" class="form-control" id="password" name="password" required
              placeholder="Entrez votre mot de passe" autocomplete="new-password">
          </div>

          <div class="form-group">
            <label for="confirm-password">Confirmez le mot de passe :</label>
            <input type="password" class="form-control" id="confirm-register-password" name="confirm-password" required
              placeholder="Entrez à nouveau votre mot de passe" autocomplete="new-password">
          </div>
          <!-- Contenu du formulaire d'inscription -->
          <div v-if="formErrors.length > 0">
            <ul>
              <li class="errors" v-for="error in formErrors" :key="error">{{ error }}</li>
            </ul>
          </div>
          <div class="custom-modal-footer">
            <button type="submit" class="btn btn-primary">S'inscrire</button>
          </div>
        </form>
        <!-- Fin du formulaire d'inscription -->

      </div>
    </div>

  </div>
  <div v-if="isRegisterOpen && isRegisteredSuccessfully" class="custom-modal-background">
    <div class="custom-modal">
      <div class="custom-modal-body">
        <p>Inscription réussie !</p>
        <button @click="isRegisterOpen = false" class="btn-confirm">OK</button>
      </div>
    </div>
  </div>
  <!-- Modal pour l'échec de l'inscription -->
  <div v-if="isRegisterOpen && isRegistrationFailed" class="custom-modal-background">
    <div class="custom-modal">
      <div class="custom-modal-body">
        <p>Échec de l'inscription. Veuillez réessayer.</p>
        <button @click="isRegisterOpen = false" class="btn-confirm">Fermer</button>
      </div>
    </div>
  </div>
</template>
<script>
import { validateEmail, validatePassword, validateNickname } from '../../script/validator';

export default {
  name: 'Register',
  emits: ['close'],
  setup() {
    const state = reactive({
      isRegisteredSuccessfully: false,
      isRegistrationFailed: false,
      isRegisterOpen: true,
      formErrors: [],
    });
    const validateForm = () => {
      state.formErrors = []; // réinitialiser les erreurs

      const formData = new FormData(document.querySelector('#register'));
      const email = formData.get('email');
      const password = formData.get('password');
      const nickname = formData.get('nickname');
      const confirmEmail = formData.get('confirm-email');
      const confirmPassword = formData.get('confirm-password');

      if (!validateEmail(email)) {
        state.formErrors.push('L\'adresse e-mail n\'est pas valide.');
      } else if (email !== confirmEmail) {
        state.formErrors.push('Les adresses e-mail ne correspondent pas.');
      }

      if (!validatePassword(password)) {
        state.formErrors.push('Le mot de passe ne respecte pas les critères de sécurité requis.');
      } else if (password !== confirmPassword) {
        state.formErrors.push('Les mots de passe ne correspondent pas.');
      }

      if (!validateNickname(nickname)) {
        state.formErrors.push('Le pseudo n\'est pas valide ou est déjà pris.');
      }
      return state.formErrors.length === 0; // retourne vrai si aucune erreur
    };
    const submitForm = async () => {                 // Fonction pour envoyer le formulaire d'inscription
      // Récupérer les données du formulaire
      const formData = new FormData(document.querySelector('#register'));
      const email = formData.get('email');
      const password = formData.get('password');
      const nickname = formData.get('nickname');
      const confirmEmail = formData.get('confirm-email');
      const confirmPassword = formData.get('confirm-password');
      const baseUrl = `http://${window.location.hostname}`;
      if (!validateForm()) {
        // Si le formulaire n'est pas valide, on ne procède pas à l'envoi
        return;
      }
      const passwordObject = {
        salted_password: password,
      }
      //Envoyer la requête POST à l'API
      const response = await fetch(`${baseUrl}:2000/api/user`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password: passwordObject, nickname })
      });

      // Traiter la réponse de l'API
      if (response.ok) {
        state.isRegisteredSuccessfully = true;
        state.isRegistrationFailed = false;
        const data = await response.json();
        const authToken = data.access_token;
        // alert('Account created');
      }
      else {
        state.isRegisteredSuccessfully = false;
        state.isRegistrationFailed = true;
        const data = await response.json();
        //alert('Error: can\'t create the account');
        // console.error(state.error);
      }
    };
    const closeRegister = () => {
      state.isRegisterOpen = false;
    };
    return { ...toRefs(state), submitForm, closeRegister, validateForm };
  },
};
</script>