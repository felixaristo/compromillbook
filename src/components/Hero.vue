<script setup>
import { Play } from 'lucide-vue-next';
</script>

<template>
  <div class="relative w-full h-screen min-h-[600px] flex items-center justify-center bg-black overflow-hidden">
    <!-- Background Image -->
    <div 
      class="absolute inset-0 bg-cover bg-center z-0"
      style="background-image: url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop');"
    ></div>

    <!-- Gradient Overlay -->
    <div class="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10"></div>
    <div class="absolute inset-0 bg-black/40 z-10"></div> <!-- Additional darken -->

    <!-- Content -->
    <div class="relative z-20 w-full max-w-7xl px-6 md:px-12 flex flex-col justify-center h-full pt-20">
      <div class="max-w-3xl space-y-6">
        
        <!-- Subtitle -->
        <div class="text-[#d4a373] font-medium tracking-widest text-xs uppercase flex items-center space-x-2 mb-2">
          <span>Smart Reservation Engine</span>
          <span class="w-1 h-1 bg-[#d4a373] rounded-full"></span>
          <span>By MillBook</span>
        </div>

        <!-- Title -->
        <h1 class="text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-tight">
          Streamline your <br class="hidden md:block" />
          operations from the <br class="hidden md:block" />
          <span class="text-[#e0c097]">very first booking</span>
        </h1>

        <!-- Description -->
        <p class="text-gray-300 text-lg md:text-xl max-w-2xl leading-relaxed">
          Our platform intelligently manages reservations, optimizes table allocation in real time, and transforms every visit into meaningful customer relationships. Reduce no-shows, maximize seating efficiency, and deliver personalized experiences — all within one seamless, data-driven system built for modern hospitality businesses.
        </p>

        <!-- Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 pt-6">
          <button class="px-8 py-3 bg-[#d4a373] hover:bg-[#c29262] text-black font-semibold rounded text-lg transition-colors duration-300">
            Book a Demo
          </button>
          
          <button class="px-8 py-3 border border-white/30 hover:border-white hover:bg-white/10 text-white font-medium rounded text-lg flex items-center justify-center transition-all duration-300 group">
            <Play class="w-5 h-5 mr-2 fill-current group-hover:scale-110 transition-transform" />
            Watch Demo On-Demand
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

