<script setup>
import { 
  CalendarCheck, 
  BarChart3, 
  Users, 
  Clock, 
  Smartphone, 
  ShieldCheck 
} from 'lucide-vue-next';

const features = [
  {
    title: 'Smart Reservation',
    description: 'An intelligent reservation system that automatically manages tables based on capacity and customer preferences.',
    icon: CalendarCheck
  },
  {
    title: 'Analytics Dashboard',
    description: 'Monitor your restaurant\'s performance in real-time with easy-to-understand reports.',
    icon: BarChart3
  },
  {
    title: 'Customer Management',
    description: 'Complete customer database with visit history and preferences for personalized service.',
    icon: Users
  },
  {
    title: 'Real-time Availability',
    description: 'Real-time table availability updates to prevent double bookings.',
    icon: Clock
  },
  {
    title: 'Mobile Friendly',
    description: 'Customers can make reservations anytime from their smartphones.',
    icon: Smartphone
  },
  {
    title: 'Data Security',
    description: 'Your restaurant and customer data is protected with enterprise-grade encryption.',
    icon: ShieldCheck
  }
];
</script>

<template>
  <section class="py-24 bg-[#161412] text-white">
    <div class="max-w-7xl mx-auto px-6 md:px-12">
      <!-- Header -->
      <div class="text-center mb-16">
        <div class="text-[#d4a373] text-sm tracking-[0.2em] uppercase font-medium mb-4">
          Key Features
        </div>
        <h2 class="text-4xl md:text-5xl font-serif font-bold mb-6">
          Everything Your Restaurant <span class="text-[#d4a373]">Needs</span>
        </h2>
        <p class="text-gray-400 text-lg max-w-2xl mx-auto">
          MillBook comes with comprehensive features to optimize your restaurant's reservation operations.
        </p>
      </div>

      <!-- Features Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="(feature, index) in features" 
          :key="index"
          class="bg-[#2a2624] p-8 rounded-xl border border-white/5 hover:border-[#d4a373]/30 transition-colors duration-300 group"
        >
          <!-- Icon -->
          <div class="w-12 h-12 mb-6 text-[#d4a373] group-hover:scale-110 transition-transform duration-300">
            <component :is="feature.icon" stroke-width="1.5" class="w-full h-full" />
          </div>

          <!-- Content -->
          <h3 class="text-xl font-serif font-bold text-white mb-3">
            {{ feature.title }}
          </h3>
          <p class="text-gray-400 leading-relaxed">
            {{ feature.description }}
          </p>
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
