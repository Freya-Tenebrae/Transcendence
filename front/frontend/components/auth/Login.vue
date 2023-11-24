<!-- Login.vue -->
<template>
  <!-- Formulaire de connexion -->
  <div v-if="isLoginOpen" class="custom-modal-background">
    <div class="custom-modal">
      <div class="custom-modal-header">
        <h5>Connexion</h5>
        <span @click="closeLogin" class="custom-modal-close">&times;</span>
      </div>
      <div class="custom-modal-body">
        <!-- Contenu du formulaire connexion -->
        <form @submit.prevent="login" id="login">
          <div class="form-group">
            <label for="email">Adresse e-mail </label>
            <input type="email" class="form-control" id="email" name="email" required
              placeholder="Entrez votre adresse e-mail" autocomplete="username">
          </div>
          <div class="form-group">
            <label for="password">Mot de passe </label>
            <input type="password" class="form-control" id="password" name="password" required
              placeholder="Entrez votre mot de passe" autocomplete="current-password">
          </div>
          <div v-if="otpError || show2FA">
            <label for="2fa-code">Code 2FA</label>
            <input id="2fa-code" v-model="code2FA" type="text">
          </div>
          <div class="custom-modal-footer">
            <button type="submit" class="btn btn-primary">Se connecter</button>
            <img src="~/assets/icons/42.svg" alt="Register-Icon" class="icon-register" @click="connectWith42" />
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- Fin du formulaire de connexion -->
  <div v-if="isLoginOpen && isLoggedSuccessfully" class="custom-modal-background">
    <div class="custom-modal">
      <div class="custom-modal-body">
        <p>Connexion réussie !</p>
        <button @click="refresh_page" class="btn-confirm">OK</button>
      </div>
    </div>
  </div>
  <!-- Modal pour l'échec de la connexion -->
  <div v-if="isLoginOpen && isLoggedFailed" class="custom-modal-background">
    <div class="custom-modal">
      <div class="custom-modal-body">
        <p>Échec de la connexion. Veuillez réessayer.</p>
        <button @click="isLoggedFailed = false" class="btn-confirm">Fermer</button>
      </div>
    </div>
  </div>
  <div v-if="is2FARequired && isLoginOpen" class="custom-modal-background">
    <div class="custom-modal">
      <div class="custom-modal-body">
        <p v-if="!isBad2FA">Mettez votre code 2FA</p>
        <p v-if="isBad2FA">Code 2FA incorrect</p>
        <button @click="is2FARequired = false" class="btn-confirm">Fermer</button>
      </div>
    </div>
  </div>
</template>
<script>
import { useCookies } from "vue3-cookies";
import { ref, reactive, onMounted } from 'vue';
export default {
  name: "Login",
  emits: ['close'],
  props: ['otpError', 'authorizationCode', 'idAuth', 'authError'],
  setup(props, context) {
    const { cookies } = useCookies();
    const state = reactive({
      isLoggedSuccessfully: false,
      isLoggedFailed: false,
      isLoginOpen: true,
      error: null,
      show2FA: false,
      code2FA: null,
      is2FARequired: false,
      isBad2FA: false,
      cookies,
    });
    onMounted(() => {
      // console.log(state.code2FA);
      if (props.authError == 'no2fa') {
        state.is2FARequired = true;
      }
      if (props.authError == 'bad2fa') {
        state.is2FARequired = true;
        state.isBad2FA = true;
      }
    });
    const refresh_page = () => {
      window.location.reload();
    };
    const login = async () => { //Fonction pour se connecter 
      const formData = new FormData(document.querySelector('#login'));
      const OTP = state.code2FA;
      const email = formData.get('email');
      const password = formData.get('password');
      const baseUrl = `http://${window.location.hostname}`;
      const response = await fetch(`${baseUrl}:2000/auth/login`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,// Envoyez le mot de passe
          OTP: OTP,
        })
      });
      const data = await response.json();
      if (data.error == '2FA Necessary' || data.error == '2FA Wrong') {
        if (data.error == '2FA Wrong')
          state.isBad2FA = true;
        state.show2FA = true;
        state.isLoggedSuccessfully = false;
        state.isLoginOpen = true;
        state.is2FARequired = true;
      }
      // Traiter la réponse de l'API
      if (response.ok && data.error !== '2FA Necessary' && data.error !== '2FA Wrong') {
        state.isLoggedSuccessfully = true;
        state.isLoggedFailed = false;
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 1); // Creation d'une date d'expiration pour le cookie

        // token
        const authToken = data.access_token;
        state.cookies.set("authToken", authToken, { expires: expirationDate }); // Stocker le token dans un cookie + ajout d'une date d'expiration
        //id
        if (!state.cookies.get("userId")) {
          const userId = data.id;
          state.cookies.set("userId", userId, { expires: expirationDate });
        }
        // console.log(authToken);
        // console.log(userId);
      }
      else if (data.error !== '2FA Necessary' && data.error !== '2FA Wrong') {
        state.isUserLoggedIn = false;
        state.isLoggedSuccessfully = false;
        state.isLoggedFailed = true;
        state.isLoginOpen = true;
        // const data = await response.json();
        // console.log(data);
        // state.error = data.message;
        // alert('Error: can\'t find the associated account');
        // console.error('Error: can\'t find the associated account');
      }
      console.log(data);
      // console.log(state.code2FA);
    };
    const connectWith42 = async () => {
      // Les informations pour l'authentification
      const redirectURI = encodeURIComponent(`http://localhost:2000/auth/callback`);
      const OTP = state.code2FA; // Utilisez la valeur de code2FA
      const clientID = `${import.meta.env.VITE_CLIENT_ID}`;
      const baseUrl = `http://${window.location.hostname}`;
      const responseType = 'code';
      const codeAuth = props.authorizationCode;
      const authID = props.idAuth;
      if (!props.otpError) {
        const authURL = `https://api.intra.42.fr/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=${responseType}&scope=public`;
        window.location.href = authURL;
      }
      // Construire l'URL d'authentification
      if (props.otpError) {
        const CB = await fetch(`http://localhost:2000/auth/callback-otp/?code=${codeAuth}&OTP=${OTP}&id=${authID}`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          },
        });

        window.location.href = CB.url;
      }
      // Redirection de l'utilisateur vers l'URL d'authentification
      // console.log(codeAuth);
      // console.log(authURL);

    };
    const closeLogin = () => {
      state.isLoginOpen = false;
      context.emit('close');
    };
    return { ...toRefs(state), login, refresh_page, connectWith42, closeLogin };
  },
}
</script>