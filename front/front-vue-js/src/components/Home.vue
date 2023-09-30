<template>
  <div>
    <img src="../assets/icons/home.svg" alt="Home-Icon" class="icon-home" @click="redirectToHome" />
  </div>
</template>

<script>
export default {
	name : 'HomePage',
	methods: {
    redirectToHome() {
		window.location.reload();
    },
  },
};
</script>
<style>
.icon-home {
	width:32px;
	height:32px;
}

</style>