<script setup>
import { Globe, LogIn, User, LogOut, Menu, X } from 'lucide-vue-next';
import { useRouter, useRoute } from 'vue-router';
import { computed, ref, onMounted, watch } from 'vue';
import { openTrialModal } from '../trialStore';
import logo from '../assets/logo-millbook.png';

const router = useRouter();
const route = useRoute();

const isMenuOpen = ref(false);
const isLoggedIn = ref(!!localStorage.getItem('access_token'));
const userName = ref(localStorage.getItem('user') || 'User');

// Update login state when route changes
watch(() => route.path, () => {
  isLoggedIn.value = !!localStorage.getItem('access_token');
  userName.value = localStorage.getItem('user') || 'User';
  isMenuOpen.value = false; // Close menu on route change
});

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const goToLogin = () => {
  isMenuOpen.value = false;
  router.push('/login');
};

const goToHome = () => {
  isMenuOpen.value = false;
  router.push('/');
};

const handleLogout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
  isLoggedIn.value = false;
  isMenuOpen.value = false;
  router.push('/');
};

const handleTrial = () => {
  isMenuOpen.value = false;
  openTrialModal();
};
</script>

<template>
  <nav class="absolute top-0 left-0 right-0 z-50 px-6 py-4 md:px-12 bg-transparent">
    <div class="flex items-center justify-between">
      <!-- Logo -->
      <div class="flex items-center">
        <button @click="goToHome" class="cursor-pointer">
          <img :src="logo" alt="MillBook Logo" class="h-17 w-17 object-cover rounded-full" />
        </button>
      </div>

      <!-- Desktop Menu -->
      <div class="hidden md:flex items-center space-x-8">
        <template v-if="!isLoggedIn">
          <!-- Member Login Button -->
          <button 
            @click="goToLogin"
            class="flex items-center px-4 py-2 text-sm font-medium text-white border border-gray-600 rounded hover:bg-white/10 transition-colors cursor-pointer"
          >
            <LogIn class="w-4 h-4 mr-2" />
            Member Login
          </button>

          <!-- Start Free Trial Button -->
          <button 
            @click="openTrialModal"
            class="px-5 py-2 text-sm font-medium text-black bg-[#d4a373] rounded hover:bg-[#c29262] transition-colors cursor-pointer"
          >
            Start Free Trial
          </button>
        </template>

        <template v-else>
          <!-- Profile / Logout for Logged In User -->
          <div class="flex items-center space-x-6">
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-2 text-gray-300">
                <div class="w-8 h-8 bg-[#242424] rounded-full flex items-center justify-center border border-white/10">
                  <User class="w-4 h-4 text-[#d4a373]" />
                </div>
                <span class="text-sm font-medium">{{ userName }}</span>
              </div>
              <button 
                @click="handleLogout"
                class="flex items-center px-4 py-2 text-sm font-medium text-gray-300 border border-gray-600 rounded hover:bg-white/10 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut class="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </template>
      </div>

      <!-- Mobile Menu Button (Hamburger) -->
      <div class="md:hidden">
        <button @click="toggleMenu" class="text-white p-2 focus:outline-none">
          <Menu v-if="!isMenuOpen" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div v-if="isMenuOpen" class="absolute top-full left-0 right-0 mt-2 mx-4 p-6 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl md:hidden z-50">
        <div class="flex flex-col space-y-4">
          <template v-if="!isLoggedIn">
            <button 
              @click="goToLogin"
              class="flex items-center justify-center px-4 py-3 text-sm font-medium text-white border border-gray-700 rounded-lg hover:bg-white/5 transition-colors"
            >
              <LogIn class="w-4 h-4 mr-2" />
              Member Login
            </button>
            <button 
              @click="handleTrial"
              class="flex items-center justify-center px-4 py-3 text-sm font-medium text-black bg-[#d4a373] rounded-lg hover:bg-[#c29262] transition-colors"
            >
              Start Free Trial
            </button>
          </template>
          <template v-else>
            <div class="flex items-center space-x-3 px-2 py-3 border-b border-white/5 mb-2">
              <div class="w-10 h-10 bg-[#242424] rounded-full flex items-center justify-center border border-white/10">
                <User class="w-5 h-5 text-[#d4a373]" />
              </div>
              <span class="text-white font-medium">{{ userName }}</span>
            </div>
            <button 
              @click="handleLogout"
              class="flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-300 border border-gray-700 rounded-lg hover:bg-white/5 transition-colors"
            >
              <LogOut class="w-4 h-4 mr-2" />
              Logout
            </button>
          </template>
        </div>
      </div>
    </transition>
  </nav>
</template>


