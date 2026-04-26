<script setup>
import { openTrialModal } from '../trialStore';
</script>

<template>
  <section class="py-24 bg-[#12100e] text-white">
    <div class="max-w-5xl mx-auto px-6 md:px-12">
      <!-- CTA Card -->
      <div class="relative bg-[#1e1c1a] border border-[#d4a373]/20 rounded-3xl p-12 md:p-16 text-center overflow-hidden shadow-2xl">
        <!-- Glow Effect -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-32 bg-[#d4a373]/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div class="relative z-10">
          <!-- Title -->
          <h2 class="text-3xl md:text-5xl font-serif font-bold mb-6 leading-tight">
            Ready to Elevate <span class="text-[#d4a373]">Your Restaurant?</span>
          </h2>

          <!-- Description -->
          <p class="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Join hundreds of restaurants already using MillBook to manage reservations more efficiently.
          </p>

          <!-- Button -->
          <button 
            @click="openTrialModal"
            class="bg-[#d4a373] hover:bg-[#c29262] text-[#12100e] font-semibold text-lg px-8 py-4 rounded-lg transition-all duration-300 shadow-[0_4px_14px_0_rgba(212,163,115,0.39)] hover:shadow-[0_6px_20px_rgba(212,163,115,0.23)] hover:-translate-y-1 mb-6 cursor-pointer"
          >
            Try Free for 14 Days
          </button>

          <!-- Footer Text -->
          <!-- <p class="text-sm text-gray-500 font-medium">
            No credit card required • Setup in 5 minutes
          </p> -->
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.font-serif {
  font-family: 'Playfair Display', serif;
}
</style>
