<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './components/Navbar.vue';
import TrialModal from './components/TrialModal.vue';

const route = useRoute();
const showNavbar = computed(() => {
  return route.name !== 'Login' && route.name !== 'Admin';
});
</script>

<template>
  <div class="bg-[#121212] min-h-screen text-white font-sans overflow-x-hidden">
    <Navbar v-if="showNavbar" />
    <router-view />
    <TrialModal />
  </div>
</template>

<style>
/* Global resets if needed */
body {
  margin: 0;
  background-color: #121212;
}
</style>
