<script setup>
import { Globe, LogIn } from 'lucide-vue-next';
</script>

<template>
  <nav class="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 bg-transparent">
    <!-- Logo -->
    <div class="flex items-center">
      <a href="#" class="text-2xl font-serif font-bold text-[#e0c097] tracking-wide">
        MillBook
      </a>
    </div>

    <!-- Desktop Menu -->
    <div class="hidden md:flex items-center space-x-8">
      <a href="#" class="text-gray-300 hover:text-white text-sm font-medium transition-colors">Features</a>
      <a href="#" class="text-gray-300 hover:text-white text-sm font-medium transition-colors">Pricing</a>
      
      <!-- Language Selector -->
      <button class="flex items-center text-gray-300 hover:text-white transition-colors">
        <Globe class="w-4 h-4 mr-1" />
        <span class="text-sm font-medium">ID</span>
      </button>

      <!-- Member Login Button -->
      <button class="flex items-center px-4 py-2 text-sm font-medium text-white border border-gray-600 rounded hover:bg-white/10 transition-colors">
        <LogIn class="w-4 h-4 mr-2" />
        Member Login
      </button>

      <!-- Start Free Trial Button -->
      <button class="px-5 py-2 text-sm font-medium text-black bg-[#d4a373] rounded hover:bg-[#c29262] transition-colors">
        Start Free Trial
      </button>
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

