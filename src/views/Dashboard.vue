<script setup>
import { ref, onMounted } from 'vue';
import { Play, ThumbsUp, ThumbsDown, Share2, MoreHorizontal, User, Loader2 } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoading = ref(true);
const currentVideo = ref(null);
const recommendedVideos = ref([]);

const fetchInitialData = async () => {
  isLoading.value = true;
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      router.push('/login');
      return;
    }

    // Step 1: Get first video ID
    const initResponse = await fetch(`${baseUrl}/videos?page=1&limit=1`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!initResponse.ok) throw new Error('Failed to fetch initial video list');
    const initData = await initResponse.json();
    
    const firstVideoId = initData.data?.items?.[0]?.id;
    if (!firstVideoId) {
      isLoading.value = false;
      return;
    }

    // Step 2: Get video details and recommendations
    const watchResponse = await fetch(`${baseUrl}/videos/${firstVideoId}/watch`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!watchResponse.ok) throw new Error('Failed to fetch video details');
    const watchData = await watchResponse.json();

    if (watchData.status === 'success' && watchData.data) {
      currentVideo.value = watchData.data.currentVideo;
      recommendedVideos.value = watchData.data.recommendations || [];
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  } finally {
    isLoading.value = false;
  }
};

const fetchVideoDetails = async (id) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('access_token');
    
    if (!token) return;

    const watchResponse = await fetch(`${baseUrl}/videos/${id}/watch`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!watchResponse.ok) throw new Error('Failed to fetch video details');
    const watchData = await watchResponse.json();

    if (watchData.status === 'success' && watchData.data) {
      currentVideo.value = watchData.data.currentVideo;
      recommendedVideos.value = watchData.data.recommendations || [];
      // Scroll to top when video changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } catch (error) {
    console.error('Error fetching video details:', error);
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

onMounted(() => {
  fetchInitialData();
});
</script>

<template>
  <div class="pt-24 pb-12 px-6 md:px-12 bg-[#121212] min-h-screen text-white">
    <div v-if="isLoading" class="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 class="w-12 h-12 text-[#d4a373] animate-spin mb-4" />
      <p class="text-gray-400 animate-pulse">Loading your dashboard...</p>
    </div>

    <div v-else-if="!currentVideo" class="text-center py-20">
      <h2 class="text-2xl font-bold text-gray-500">No videos available yet.</h2>
    </div>

    <div v-else class="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <!-- Main Content (Video Player & Info) -->
      <div class="lg:col-span-8">
        <!-- Video Player -->
        <div class="aspect-video bg-black rounded-xl overflow-hidden relative group border border-white/5 shadow-2xl">
          <video 
            v-if="currentVideo.url"
            :src="currentVideo.url" 
            controls
            class="w-full h-full object-contain"
            :poster="currentVideo.thumbnail"
          ></video>
          <div v-else class="w-full h-full flex items-center justify-center bg-[#1a1a1a]">
            <Play class="w-20 h-20 text-gray-700" />
          </div>
        </div>

        <!-- Video Info -->
        <div class="mt-6">
          <h1 class="text-2xl font-bold text-white mb-2 leading-tight">
            {{ currentVideo.title }}
          </h1>
          
          <!-- <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-[#242424] rounded-full flex items-center justify-center mr-3 border border-white/5">
                <User class="w-6 h-6 text-[#d4a373]" />
              </div>
              <div>
                <p class="font-medium text-white">Admin</p>
                <p class="text-xs text-gray-400">1.2M subscribers</p>
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
          </div> -->

          <!-- Description Box -->
          <!-- <div class="bg-[#1a1a1a] p-4 rounded-xl border border-white/5">
            <div class="flex space-x-3 mb-2">
              <span class="text-sm font-bold text-white">124K views</span>
              <span class="text-sm font-bold text-white">{{ formatDate(currentVideo.created_at) }}</span>
            </div>
            <p class="text-sm text-gray-300 leading-relaxed">
              Experience the latest content from MillBook. This video was uploaded on {{ formatDate(currentVideo.created_at) }}.
            </p>
            <button class="mt-2 text-sm font-bold text-white hover:underline">Show more</button>
          </div> -->
        </div>
      </div>

      <!-- Sidebar (Recommended Videos) -->
      <div class="lg:col-span-4">
        <h2 class="text-lg font-bold mb-4 flex items-center">
          Others Video
        </h2>
        <div class="space-y-4">
          <div 
            v-for="video in recommendedVideos" 
            :key="video.id" 
            class="flex gap-3 group cursor-pointer"
            @click="fetchVideoDetails(video.id)"
          >
            <!-- Thumbnail -->
            <div class="flex-shrink-0 w-40 aspect-video bg-[#1a1a1a] rounded-lg overflow-hidden relative border border-white/5">
              <img 
                v-if="video.thumbnail"
                :src="video.thumbnail" 
                :alt="video.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <Play class="w-8 h-8 text-gray-700" />
              </div>
              <!-- <div class="absolute bottom-1 right-1 px-1 py-0.5 bg-black/80 rounded text-[10px] font-bold">
                12:45
              </div> -->
            </div>
            <!-- Metadata -->
            <div class="flex flex-col">
              <h3 class="text-sm font-bold text-white line-clamp-2 leading-tight group-hover:text-[#d4a373] transition-colors">
                {{ video.title }}
              </h3>
              <p class="text-xs text-gray-400 mt-1">Admin</p>
              <div class="flex items-center text-xs text-gray-500 mt-0.5">
                <!-- <span>45K views</span>
                <span class="mx-1">•</span> -->
                <span>{{ formatDate(video.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

