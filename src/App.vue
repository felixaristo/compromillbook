<script setup>
import Navbar from './components/Navbar.vue';
import Hero from './components/Hero.vue';
import DemoVideo from './components/DemoVideo.vue';
import KeyFeatures from './components/KeyFeatures.vue';
import Pricing from './components/Pricing.vue';
import CTA from './components/CTA.vue';
</script>

<template>
  <div class="bg-[#121212] min-h-screen text-white font-sans overflow-x-hidden">
    <Navbar />
    <Hero />
    <DemoVideo />
    <KeyFeatures />
    <Pricing />
    <CTA />
  </div>
</template>

<style>
/* Global resets if needed */
body {
  margin: 0;
  background-color: #121212;
}
</style>
