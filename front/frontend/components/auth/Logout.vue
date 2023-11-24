<!-- Logout.vue -->
<template>
    <!-- Confirmation Modal for Logout -->
    <div v-if="showconfirmation" class="custom-modal-background">
        <div class="custom-modal">
            <div class="custom-modal-header">
                <h5>Confirmation</h5>
                <span @click="showconfirmation = false" class="custom-modal-close">&times;</span>
            </div>
            <div class="custom-modal-body">
                <p>Voulez-vous vraiment vous déconnecter?</p>
                <button @click="logout" class="btn-confirm">Oui</button>
                <button @click="showconfirmation = false" class="btn-confirm">Non</button>
            </div>
        </div>
    </div>
    <!-- Vous etes deconnectes -->
    <div v-if="showLoggedOutModal" class="custom-modal-background">
        <div class="custom-modal">
            <div class="custom-modal-header">
                <h5>Information</h5>
                <span @click="showLoggedOutModal = false" class="custom-modal-close">&times;</span>
            </div>
            <div class="custom-modal-body">
                <p>Vous êtes déconnecté</p>
                <button @click="refresh_page" class="btn-confirm">OK</button>
            </div>
        </div>
    </div>
</template>
<script>
import { useCookies } from "vue3-cookies";
import { ref, reactive, onMounted } from 'vue';
export default {
    name: "Logout",
    emits: ['closeLogout'],
    props: ['showlogout', 'showconfirmation'],
    setup(props, context) {
        const { cookies } = useCookies();
        const state = reactive({
            isUserLoggedIn: false,
            showLoggedOutModal: false,
            showLogoutConfirmationModal: false,
            cookies,
        });
        const refresh_page = () => {
            window.location.reload();
        };
        const logout = () => {
            state.cookies.keys().forEach(cookie => state.cookies.remove(cookie));
            state.isUserLoggedIn = false;
            state.showLogoutConfirmationModal = false;
            state.showLoggedOutModal = true;
        };
        return { ...toRefs(state), refresh_page, logout };
    },
}
</script>