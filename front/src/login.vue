<script setup>
const email = ref("");
const password = ref(null);
const errMsg = ref(null);

async function signIn() {
    try {
        const { error } = await ({ //to complete with the login functions
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
* {
  margin: 0;
  padding: 0;
  border: 0;
}
#app {
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
    <div
      style="
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        gap: 20px;
      "
    >
      <h1>Login</h1>
      <button @click="signInWithOAuth">
        Sign In with OAuth (42 ID)
      </button>
      <button @click="signIn">
        Sign In with E-Mail
      </button>
      <input
        v-model="email"
        type="email"
      />
      <template v-if="user">
        <NuxtLink to="/">
          Go to home page
        </NuxtLink>
        <button
          @click="signOut"
        >
          Sign Out
        </button>
      </template>
    </div>
  </template>