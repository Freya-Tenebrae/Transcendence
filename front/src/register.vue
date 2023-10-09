<script setup>
const email = ref("");
const password = ref(null);
const errMsg = ref(null);
const succMsg = ref(null);

async function signUp() {
    try {
        const { data, error } = await ({ //to complete with the authentification function
            email: email.value,
            password: password.value,
        });
        if (error) throw error;
    }  catch (error) {
        errMsg.value = error.message;
    }
}
</script>

<style>
.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color:#474444;
  height: 100vh;
  gap: 20px;
}
</style>

<template>
  <title>Cyberpong 2042 - Registration</title>
  <div class="app">
      <h2>Sign Up</h2>
      <div>
        E-mail
        <input
          v-model="email"
          type email
        />
        <div>
          Password
          <input
            v-model="password"
            type password
          />
        </div>
      </div>
      <button @click="register">
        Register
      </button>
  </div>
</template>