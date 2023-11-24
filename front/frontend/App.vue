<template>
	<div id="app">
		<HomePage />
	</div>
  </template>
  
<script>
import HomePage from './components/Home.vue'

export default {
  name: 'App',
  components: {
    HomePage,
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  border: 0;
}
#app {

    font-family: 'Orbitron', sans-serif; /* Orbitron is a futuristic font */
    background-color: #0d0d14;
    color: #a8a8b3;
    height:100vh;
}
</style>
