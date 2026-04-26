<script setup>
import { ref } from 'vue';
import { Play, ThumbsUp, ThumbsDown, Share2, MoreHorizontal, User } from 'lucide-vue-next';

const currentVideo = ref({
  id: 1,
  title: 'Mastering MillBook: Essential Workflows for Professionals',
  views: '1.2M views',
  date: '2 months ago',
  author: 'MillBook Academy',
  description: 'In this comprehensive tutorial, we dive deep into the core features of MillBook. Learn how to optimize your workflow, manage complex projects, and leverage the power of our latest tools.',
  subscribers: '450K subscribers'
});

const recommendedVideos = ref([
  {
    id: 2,
    title: 'Advanced Project Management Tips',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop',
    author: 'Expert Insights',
    views: '240K views',
    date: '1 week ago'
  },
  {
    id: 3,
    title: 'Designing for the Modern Web',
    thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=2426&auto=format&fit=crop',
    author: 'Design Weekly',
    views: '89K views',
    date: '3 days ago'
  },
  {
    id: 4,
    title: 'Future of Automation in Industry',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2426&auto=format&fit=crop',
    author: 'Tech Tomorrow',
    views: '560K views',
    date: '1 month ago'
  },
  {
    id: 5,
    title: 'Sustainable Business Practices',
    thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2426&auto=format&fit=crop',
    author: 'Eco Business',
    views: '12K views',
    date: '5 hours ago'
  },
  {
    id: 6,
    title: 'Scaling Your Startup Efficiently',
    thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2426&auto=format&fit=crop',
    author: 'Founder Series',
    views: '1.1M views',
    date: '1 year ago'
  }
]);
</script>

<template>
  <div class="pt-24 pb-12 px-6 md:px-12 bg-[#121212] min-h-screen text-white">
    <div class="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <!-- Main Content (Video Player & Info) -->
      <div class="lg:col-span-8">
        <!-- Video Player Placeholder -->
        <div class="aspect-video bg-[#1a1a1a] rounded-xl overflow-hidden relative group cursor-pointer border border-white/5">
          <img 
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2426&auto=format&fit=crop" 
            alt="Main Video" 
            class="w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-opacity"
          />
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-20 h-20 bg-[#d4a373] rounded-full flex items-center justify-center text-black transform group-hover:scale-110 transition-transform">
              <Play class="w-10 h-10 fill-current" />
            </div>
          </div>
          <!-- Video Progress Bar -->
          <div class="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div class="h-full bg-[#d4a373] w-[45%]"></div>
          </div>
        </div>

        <!-- Video Info -->
        <div class="mt-6">
          <h1 class="text-2xl font-bold text-white mb-2 leading-tight">
            {{ currentVideo.title }}
          </h1>
          
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-[#242424] rounded-full flex items-center justify-center mr-3 border border-white/5">
                <User class="w-6 h-6 text-[#d4a373]" />
              </div>
              <div>
                <p class="font-medium text-white">{{ currentVideo.author }}</p>
                <p class="text-xs text-gray-400">{{ currentVideo.subscribers }}</p>
              </div>
              <button class="ml-6 px-4 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-gray-200 transition-colors">
                Subscribe
              </button>
            </div>

            <div class="flex items-center space-x-2">
              <div class="flex items-center bg-[#242424] rounded-full overflow-hidden border border-white/5">
                <button class="flex items-center px-4 py-2 hover:bg-white/10 transition-colors border-r border-white/10">
                  <ThumbsUp class="w-5 h-5 mr-2" />
                  <span class="text-sm font-medium">45K</span>
                </button>
                <button class="flex items-center px-4 py-2 hover:bg-white/10 transition-colors">
                  <ThumbsDown class="w-5 h-5" />
                </button>
              </div>
              <button class="flex items-center px-4 py-2 bg-[#242424] rounded-full hover:bg-white/10 transition-colors border border-white/5">
                <Share2 class="w-5 h-5 mr-2" />
                <span class="text-sm font-medium">Share</span>
              </button>
              <button class="p-2 bg-[#242424] rounded-full hover:bg-white/10 transition-colors border border-white/5">
                <MoreHorizontal class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Description Box -->
          <div class="bg-[#1a1a1a] p-4 rounded-xl border border-white/5">
            <div class="flex space-x-3 mb-2">
              <span class="text-sm font-bold text-white">{{ currentVideo.views }}</span>
              <span class="text-sm font-bold text-white">{{ currentVideo.date }}</span>
            </div>
            <p class="text-sm text-gray-300 leading-relaxed">
              {{ currentVideo.description }}
            </p>
            <button class="mt-2 text-sm font-bold text-white hover:underline">Show more</button>
          </div>
        </div>
      </div>

      <!-- Sidebar (Recommended Videos) -->
      <div class="lg:col-span-4">
        <h2 class="text-lg font-bold mb-4 flex items-center">
          Recommended for you
        </h2>
        <div class="space-y-4">
          <div 
            v-for="video in recommendedVideos" 
            :key="video.id" 
            class="flex gap-3 group cursor-pointer"
          >
            <!-- Thumbnail -->
            <div class="flex-shrink-0 w-40 aspect-video bg-[#1a1a1a] rounded-lg overflow-hidden relative border border-white/5">
              <img 
                :src="video.thumbnail" 
                :alt="video.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute bottom-1 right-1 px-1 py-0.5 bg-black/80 rounded text-[10px] font-bold">
                12:45
              </div>
            </div>
            <!-- Metadata -->
            <div class="flex flex-col">
              <h3 class="text-sm font-bold text-white line-clamp-2 leading-tight group-hover:text-[#d4a373] transition-colors">
                {{ video.title }}
              </h3>
              <p class="text-xs text-gray-400 mt-1">{{ video.author }}</p>
              <div class="flex items-center text-xs text-gray-500 mt-0.5">
                <span>{{ video.views }}</span>
                <span class="mx-1">•</span>
                <span>{{ video.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
