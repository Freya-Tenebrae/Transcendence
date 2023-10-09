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
    <div style="app">
        <h1>Sign Up</h1>
        <input
            v-model="email"
            type email
        />
        <input
            v-model="password"
            type password
        />
        <button @click="register">
        </button>
    </div>
</template>