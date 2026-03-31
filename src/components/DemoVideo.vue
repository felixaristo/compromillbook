<script setup>
// No props needed for now
</script>

<template>
  <section class="py-20 bg-[#1a1a1a]">
    <div class="max-w-7xl mx-auto px-6 md:px-12 text-center">
      <!-- Subtitle -->
      <div class="text-[#d4a373] text-sm tracking-[0.2em] uppercase font-medium mb-4">
        Demo Video
      </div>

      <!-- Title -->
      <h2 class="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
        See How MillBook <span class="text-[#d4a373]">Works</span>
      </h2>

      <!-- Description -->
      <p class="text-gray-400 text-lg max-w-2xl mx-auto mb-12">
        Watch a quick demo of how MillBook helps your restaurant manage reservations more efficiently.
      </p>

      <!-- Video Container -->
      <div class="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-white/10 aspect-video group">
        <!-- Using YouTube Embed with the classic Rick Roll ID as per screenshot -->
        <iframe 
          class="absolute top-0 left-0 w-full h-full"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=Ad-gJq-yX4-hW-6-" 
          title="MillBook Demo Video" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </section>
</template>

<style scoped>
.font-serif {
  font-family: 'Playfair Display', serif;
}
</style>
