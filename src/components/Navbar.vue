<script setup>
import { Globe, LogIn, User, LogOut } from 'lucide-vue-next';
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';
import { openTrialModal } from '../trialStore';
import logo from '../assets/logo-millbook.png';

const router = useRouter();
const route = useRoute();

const isDashboard = computed(() => route.name === 'Dashboard');

const goToAdmin = () => {
  router.push('/admin');
};

const goToLogin = () => {
  router.push('/login');
};

const goToHome = () => {
  router.push('/');
};

const handleLogout = () => {
  router.push('/');
};
</script>

<template>
  <nav class="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 bg-transparent">
    <!-- Logo -->
    <div class="flex items-center">
      <button @click="goToHome" class="cursor-pointer">
        <img :src="logo" alt="MillBook Logo" class="h-17 w-17 object-cover rounded-full" />
      </button>
    </div>

    <!-- Desktop Menu -->
    <div class="hidden md:flex items-center space-x-8">
      <!-- <a href="#" class="text-gray-300 hover:text-white text-sm font-medium transition-colors">Features</a> -->
      <!-- <a href="#" class="text-gray-300 hover:text-white text-sm font-medium transition-colors">Pricing</a> -->
      
      <!-- Language Selector -->
      <!-- <button class="flex items-center text-gray-300 hover:text-white transition-colors">
        <Globe class="w-4 h-4 mr-1" />
        <span class="text-sm font-medium">ID</span>
      </button> -->

      <template v-if="!isDashboard">
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
        <!-- Profile / Logout for Dashboard -->
        <div class="flex items-center space-x-6">
          <button 
            @click="goToAdmin"
            class="text-gray-400 hover:text-[#d4a373] text-sm font-medium transition-colors"
          >
            Admin Panel
          </button>
          <div class="flex items-center space-x-4 border-l border-white/10 pl-6">
            <button class="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
            <div class="w-8 h-8 bg-[#242424] rounded-full flex items-center justify-center border border-white/10">
              <User class="w-4 h-4 text-[#d4a373]" />
            </div>
            <span class="text-sm font-medium">John Doe</span>
          </button>
          <button 
            @click="handleLogout"
            class="p-2 text-gray-400 hover:text-white transition-colors"
            title="Logout"
          >
            <LogOut class="w-5 h-5" />
          </button>
        </div>
      </div>
    </template>
  </div>

    <!-- Mobile Menu Button (Hamburger) -->
    <div class="md:hidden">
      <button class="text-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  </nav>
</template>

