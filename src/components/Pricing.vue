<script setup>
import { Check } from 'lucide-vue-next';

const plans = [
  {
    name: 'Starter',
    description: 'For small restaurants just starting out',
    price: 'Rp 500K',
    tableLimit: 'Up to 6 tables',
    features: [
      'Smart Reservation Engine',
      'Full Analytics Dashboard',
      'Customer Management (CRM)',
      'SMS & Email Notifications',
      'Real-time Availability',
      'Mobile Friendly',
      'Member Area (Video Tutorials & Announcements)',
      'API Integration'
    ],
    isPopular: false
  },
  {
    name: 'Standard',
    description: 'For growing mid-size restaurants',
    price: 'Rp 750K',
    tableLimit: 'Up to 20 tables',
    features: [
      'Smart Reservation Engine',
      'Full Analytics Dashboard',
      'Customer Management (CRM)',
      'SMS & Email Notifications',
      'Real-time Availability',
      'Mobile Friendly',
      'Member Area (Video Tutorials & Announcements)',
      'API Integration',
      'SLA 99.9% Uptime'
    ],
    isPopular: true
  },
  {
    name: 'Premium',
    description: 'For large & multi-branch restaurants',
    price: 'Rp 1 Juta',
    tableLimit: 'More than 20 tables',
    features: [
      'Smart Reservation Engine',
      'Full Analytics Dashboard',
      'Customer Management (CRM)',
      'SMS & Email Notifications',
      'Real-time Availability',
      'Mobile Friendly',
      'Member Area (Video Tutorials & Announcements)',
      'API Integration',
      'SLA 99.9% Uptime',
      'Priority Support 24/7'
    ],
    isPopular: false
  }
];
</script>

<template>
  <section class="py-24 bg-[#12100e] text-white">
    <div class="max-w-7xl mx-auto px-6 md:px-12">
      <!-- Header -->
      <div class="text-center mb-16">
        <div class="text-[#d4a373] text-sm tracking-[0.2em] uppercase font-medium mb-4">
          Pricing
        </div>
        <h2 class="text-4xl md:text-5xl font-serif font-bold mb-6">
          The <span class="text-[#d4a373]">Right Plan</span> for You
        </h2>
        <p class="text-gray-400 text-lg max-w-2xl mx-auto">
          Choose the plan that fits your restaurant. All plans include a 14-day free trial.
        </p>
      </div>

      <!-- Pricing Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div 
          v-for="(plan, index) in plans" 
          :key="index"
          class="relative p-8 rounded-2xl border transition-all duration-300 flex flex-col h-full"
          :class="[
            plan.isPopular 
              ? 'bg-[#1e1c1a] border-[#d4a373] shadow-lg shadow-[#d4a373]/10 transform md:-translate-y-4' 
              : 'bg-[#1a1816] border-white/10 hover:border-[#d4a373]/50'
          ]"
        >
          <!-- Most Popular Badge -->
          <div 
            v-if="plan.isPopular" 
            class="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#d4a373] text-[#12100e] text-sm font-bold px-4 py-1 rounded-full"
          >
            Most Popular
          </div>

          <!-- Plan Header -->
          <h3 class="text-2xl font-serif font-bold mb-2">{{ plan.name }}</h3>
          <p class="text-gray-400 text-sm mb-6 min-h-[40px]">{{ plan.description }}</p>

          <!-- Price -->
          <div class="flex items-baseline mb-2">
            <span class="text-4xl font-serif font-bold text-[#d4a373]">{{ plan.price }}</span>
            <span class="text-gray-400 ml-2">/month</span>
          </div>
          <div class="text-[#d4a373] text-sm font-medium mb-8">
            {{ plan.tableLimit }}
          </div>

          <!-- Features List -->
          <ul class="space-y-4 mb-8 flex-grow">
            <li v-for="(feature, fIndex) in plan.features" :key="fIndex" class="flex items-start">
              <Check class="w-5 h-5 text-[#d4a373] mr-3 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">{{ feature }}</span>
            </li>
          </ul>

          <!-- CTA Button -->
          <button 
            class="w-full py-3 rounded-lg font-medium transition-colors duration-300 mt-auto"
            :class="[
              plan.isPopular 
                ? 'bg-[#d4a373] text-[#12100e] hover:bg-[#c29262]' 
                : 'bg-white/10 text-white hover:bg-white/20'
            ]"
          >
            Start Free Trial
          </button>
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
