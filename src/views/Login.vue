<script setup>
import { ref } from 'vue';
import { Mail, Lock, LogIn, ArrowLeft, Loader2 } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');
const isLoading = ref(false);

const goHome = () => {
  router.push('/');
};

const handleLogin = async (e) => {
  e.preventDefault();
  isLoading.value = true;
  
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const basicUser = import.meta.env.VITE_BASIC_USERNAME;
    const basicPass = import.meta.env.VITE_BASIC_PASSWORD;
    
    // Basic Auth header
    const authHeader = 'Basic ' + btoa(`${basicUser}:${basicPass}`);
    
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    });

    if (!response.ok) {
      throw new Error('Login failed. Please check your credentials.');
    }

    const data = await response.json();
    console.log(data);
    
    // Save token to localStorage
    if (data.data.access_token) {
      localStorage.setItem('access_token', data.data.access_token);
    }
    
    // Redirect based on role
    // role = 1 -> /admin, role = 2 -> /dashboard
    if (data.data && data.data.user && data.data.user.role === 1) {
      router.push('/admin');
    } else if (data.data && data.data.user && data.data.user.role === 2) {
      router.push('/dashboard');
    } else {
      // Default fallback if role is different
      router.push('/dashboard');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert(error.message || 'An error occurred during login');
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#121212] flex flex-col items-center justify-center px-6 py-12">
    <!-- Back to Home -->
    <button 
      @click="goHome" 
      class="absolute top-8 left-8 flex items-center text-gray-400 hover:text-white transition-colors group"
    >
      <ArrowLeft class="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
      <span>Back to Home</span>
    </button>

    <div class="w-full max-w-md">
      <!-- Logo/Brand -->
      <div class="text-center mb-10">
        <h1 class="text-4xl font-serif font-bold text-[#e0c097] tracking-wide mb-2">MillBook</h1>
        <p class="text-gray-400">Welcome back! Please login to your account.</p>
      </div>

      <!-- Login Card -->
      <div class="bg-[#1a1a1a] border border-white/5 p-8 rounded-xl shadow-2xl">
        <form @submit="handleLogin" class="space-y-6">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail class="h-5 w-5 text-gray-500" />
              </div>
              <input 
                v-model="username"
                id="username" 
                required
                class="block w-full pl-10 pr-3 py-3 bg-[#242424] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d4a373] focus:border-transparent transition-all"
                placeholder="Username"
              >
            </div>
          </div>

          <!-- Password Field -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label for="password" class="block text-sm font-medium text-gray-300">Password</label>
              <!-- <a href="#" class="text-xs text-[#d4a373] hover:underline">Forgot password?</a> -->
            </div>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock class="h-5 w-5 text-gray-500" />
              </div>
              <input 
                v-model="password"
                type="password" 
                id="password" 
                required
                class="block w-full pl-10 pr-3 py-3 bg-[#242424] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d4a373] focus:border-transparent transition-all"
                placeholder="••••••••"
              >
            </div>
          </div>

          <!-- Remember Me -->
          <!-- <div class="flex items-center">
            <input 
              id="remember-me" 
              name="remember-me" 
              type="checkbox" 
              class="h-4 w-4 rounded border-gray-700 bg-[#242424] text-[#d4a373] focus:ring-[#d4a373]"
            >
            <label for="remember-me" class="ml-2 block text-sm text-gray-400">
              Remember me
            </label>
          </div> -->

          <!-- Submit Button -->
          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-black bg-[#d4a373] hover:bg-[#c29262] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#121212] focus:ring-[#d4a373] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <template v-if="isLoading">
              <Loader2 class="w-5 h-5 mr-2 animate-spin" />
              Signing In...
            </template>
            <template v-else>
              <LogIn class="w-5 h-5 mr-2" />
              Sign In
            </template>
          </button>
        </form>

        <!-- Sign Up Link -->
        <!-- <div class="mt-8 text-center">
          <p class="text-sm text-gray-400">
            Don't have an account? 
            <a href="#" class="font-medium text-[#d4a373] hover:underline ml-1">Start free trial</a>
          </p>
        </div> -->

        <!-- Testing Info -->
        <!-- <div class="mt-6 p-4 bg-white/5 rounded-lg border border-white/5">
          <p class="text-xs text-gray-500 font-medium uppercase mb-2">Testing Credentials:</p>
          <div class="space-y-1">
            <p class="text-xs text-gray-400"><span class="text-[#d4a373]">Admin:</span> admin@example.com</p>
            <p class="text-xs text-gray-400"><span class="text-[#d4a373]">Member:</span> user@example.com</p>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>
