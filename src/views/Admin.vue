<script setup>
import { ref, computed } from 'vue';
import { Users, Video, Plus, Search, ChevronLeft, ChevronRight, LogOut, LayoutDashboard, Trash2, Edit, Upload, X, Loader2 } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import logo from '../assets/logo-millbook.png';

const router = useRouter();
const activeMenu = ref('members'); // 'members' or 'videos'
const showAddModal = ref(false);
const isSubmitting = ref(false);

// --- Member Data & CRUD ---
const members = ref([
  { id: 1, fullname: 'John Doe', email: 'john@example.com', joinDate: '2024-01-15' },
  { id: 2, fullname: 'Jane Smith', email: 'jane@example.com', joinDate: '2024-02-10' },
  { id: 3, fullname: 'Alice Johnson', email: 'alice@example.com', joinDate: '2024-03-05' },
]);

const newMember = ref({ fullname: '', email: '', password: '' });

const addMember = () => {
  isSubmitting.value = true;
  // Simulate API Call
  setTimeout(() => {
    members.value.unshift({
      id: Date.now(),
      fullname: newMember.value.fullname,
      email: newMember.value.email,
      joinDate: new Date().toISOString().split('T')[0]
    });
    newMember.value = { fullname: '', email: '', password: '' };
    showAddModal.value = false;
    isSubmitting.value = false;
  }, 800);
};

const deleteMember = (id) => {
  if (confirm('Are you sure you want to delete this member?')) {
    members.value = members.value.filter(m => m.id !== id);
  }
};

// --- Video Data & CRUD with Pagination ---
const videos = ref(Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  title: `Tutorial MillBook Part ${i + 1}`,
  uploadDate: '2024-04-01',
  duration: '12:45',
  fileName: `video_part_${i+1}.mp4`
})));

const newVideo = ref({ title: '', file: null });
const videoPage = ref(1);
const itemsPerPage = 8;

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    newVideo.value.file = file;
  }
};

const paginatedVideos = computed(() => {
  const start = (videoPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return videos.value.slice(start, end);
});

const totalVideoPages = computed(() => Math.ceil(videos.value.length / itemsPerPage));

const addVideo = () => {
  isSubmitting.value = true;
  // Simulate API Call
  setTimeout(() => {
    videos.value.unshift({
      id: Date.now(),
      title: newVideo.value.title,
      uploadDate: new Date().toISOString().split('T')[0],
      duration: '00:00',
      fileName: newVideo.value.file ? newVideo.value.file.name : 'no-file.mp4'
    });
    newVideo.value = { title: '', file: null };
    showAddModal.value = false;
    isSubmitting.value = false;
  }, 1200);
};

const deleteVideo = (id) => {
  if (confirm('Are you sure you want to delete this video?')) {
    videos.value = videos.value.filter(v => v.id !== id);
    // Adjust page if current page becomes empty
    if (paginatedVideos.value.length === 0 && videoPage.value > 1) {
      videoPage.value--;
    }
  }
};

const logout = () => {
  router.push('/');
};
</script>

<template>
  <div class="flex min-h-screen bg-[#121212] text-white">
    <!-- Sidebar -->
    <aside class="w-64 bg-[#1a1a1a] border-r border-white/5 flex flex-col">
      <div class="p-6">
        <img :src="logo" alt="MillBook Logo" class="h-14 w-auto object-contain cursor-pointer rounded-lg" @click="router.push('/')" />
      </div>
      
      <nav class="flex-1 px-4 space-y-2">
        <button 
          @click="activeMenu = 'members'"
          :class="['w-full flex items-center px-4 py-3 rounded-lg transition-colors', activeMenu === 'members' ? 'bg-[#d4a373] text-black' : 'text-gray-400 hover:bg-white/5']"
        >
          <Users class="w-5 h-5 mr-3" />
          <span class="font-medium">Members</span>
        </button>
        
        <button 
          @click="activeMenu = 'videos'"
          :class="['w-full flex items-center px-4 py-3 rounded-lg transition-colors', activeMenu === 'videos' ? 'bg-[#d4a373] text-black' : 'text-gray-400 hover:bg-white/5']"
        >
          <Video class="w-5 h-5 mr-3" />
          <span class="font-medium">Videos</span>
        </button>
      </nav>

      <div class="p-4 border-t border-white/5">
        <button @click="logout" class="w-full flex items-center px-4 py-3 text-gray-400 hover:text-white transition-colors">
          <LogOut class="w-5 h-5 mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-8">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-bold text-white capitalize">{{ activeMenu }}</h2>
          <button 
            @click="showAddModal = true"
            class="flex items-center px-5 py-2.5 bg-[#d4a373] text-black font-semibold rounded-lg hover:bg-[#c29262] transition-colors"
          >
            <Plus class="w-5 h-5 mr-2" />
            Add {{ activeMenu === 'members' ? 'Member' : 'Video' }}
          </button>
        </div>

        <!-- Members Table -->
        <div v-if="activeMenu === 'members'" class="bg-[#1a1a1a] rounded-xl border border-white/5 overflow-hidden">
          <table class="w-full text-left">
            <thead class="bg-white/5 border-b border-white/5 text-gray-400 text-sm uppercase">
              <tr>
                <th class="px-6 py-4 font-semibold">Full Name</th>
                <th class="px-6 py-4 font-semibold">Email</th>
                <th class="px-6 py-4 font-semibold">Join Date</th>
                <th class="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr v-for="member in members" :key="member.id" class="hover:bg-white/[0.02] transition-colors">
                <td class="px-6 py-4 font-medium text-white">{{ member.fullname }}</td>
                <td class="px-6 py-4 text-gray-400">{{ member.email }}</td>
                <td class="px-6 py-4 text-gray-400">{{ member.joinDate }}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-3">
                    <button class="text-gray-400 hover:text-[#d4a373] transition-colors">
                      <Edit class="w-4 h-4" />
                    </button>
                    <button @click="deleteMember(member.id)" class="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Videos Table -->
        <div v-if="activeMenu === 'videos'">
          <div class="bg-[#1a1a1a] rounded-xl border border-white/5 overflow-hidden">
            <table class="w-full text-left">
              <thead class="bg-white/5 border-b border-white/5 text-gray-400 text-sm uppercase">
                <tr>
                  <th class="px-6 py-4 font-semibold">Title</th>
                  <th class="px-6 py-4 font-semibold">File Name</th>
                  <th class="px-6 py-4 font-semibold">Upload Date</th>
                  <th class="px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                <tr v-for="vid in paginatedVideos" :key="vid.id" class="hover:bg-white/[0.02] transition-colors">
                  <td class="px-6 py-4 font-medium text-white">{{ vid.title }}</td>
                  <td class="px-6 py-4 text-gray-400 font-mono text-xs">{{ vid.fileName }}</td>
                  <td class="px-6 py-4 text-gray-400">{{ vid.uploadDate }}</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center space-x-3">
                      <button class="text-gray-400 hover:text-[#d4a373] transition-colors">
                        <Edit class="w-4 h-4" />
                      </button>
                      <button @click="deleteVideo(vid.id)" class="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Pagination -->
          <div class="mt-6 flex items-center justify-between">
            <p class="text-sm text-gray-400">
              Showing <span class="text-white">{{ (videoPage - 1) * itemsPerPage + 1 }}</span> to 
              <span class="text-white">{{ Math.min(videoPage * itemsPerPage, videos.length) }}</span> of 
              <span class="text-white">{{ videos.length }}</span> results
            </p>
            <div class="flex space-x-2">
              <button 
                @click="videoPage--" 
                :disabled="videoPage === 1"
                class="p-2 bg-[#242424] border border-white/5 rounded-lg disabled:opacity-30 hover:bg-white/5 transition-colors"
              >
                <ChevronLeft class="w-5 h-5" />
              </button>
              <button 
                @click="videoPage++" 
                :disabled="videoPage === totalVideoPages"
                class="p-2 bg-[#242424] border border-white/5 rounded-lg disabled:opacity-30 hover:bg-white/5 transition-colors"
              >
                <ChevronRight class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Form (Member) -->
    <div v-if="showAddModal && activeMenu === 'members'" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div class="w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl p-8">
        <h3 class="text-2xl font-bold mb-6">Add New Member</h3>
        <form @submit.prevent="addMember" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
            <input v-model="newMember.fullname" required type="text" class="w-full px-4 py-2 bg-[#242424] border border-white/5 rounded-lg focus:ring-2 focus:ring-[#d4a373] outline-none">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input v-model="newMember.email" required type="email" class="w-full px-4 py-2 bg-[#242424] border border-white/5 rounded-lg focus:ring-2 focus:ring-[#d4a373] outline-none">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input v-model="newMember.password" required type="password" class="w-full px-4 py-2 bg-[#242424] border border-white/5 rounded-lg focus:ring-2 focus:ring-[#d4a373] outline-none">
          </div>
          <div class="flex space-x-3 pt-4">
            <button type="button" @click="showAddModal = false" class="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors font-medium">Cancel</button>
            <button type="submit" :disabled="isSubmitting" class="flex-1 px-4 py-2 bg-[#d4a373] text-black font-bold rounded-lg hover:bg-[#c29262] transition-colors disabled:opacity-50 flex items-center justify-center">
              <Loader2 v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
              {{ isSubmitting ? 'Adding...' : 'Add Member' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Form (Video) -->
    <div v-if="showAddModal && activeMenu === 'videos'" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div class="w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl p-8">
        <h3 class="text-2xl font-bold mb-6">Upload New Video</h3>
        <form @submit.prevent="addVideo" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Video Title</label>
            <input v-model="newVideo.title" required type="text" class="w-full px-4 py-2 bg-[#242424] border border-white/5 rounded-lg focus:ring-2 focus:ring-[#d4a373] outline-none">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Video File</label>
            <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-white/5 border-dashed rounded-lg hover:border-[#d4a373]/50 transition-colors group">
              <div class="space-y-1 text-center">
                <Upload v-if="!newVideo.file" class="mx-auto h-12 w-12 text-gray-500 group-hover:text-[#d4a373] transition-colors" />
                <div v-else class="mx-auto h-12 w-12 flex items-center justify-center bg-[#d4a373]/10 rounded-full">
                  <Video class="h-6 w-6 text-[#d4a373]" />
                </div>
                
                <div class="flex text-sm text-gray-400">
                  <label for="file-upload" class="relative cursor-pointer rounded-md font-medium text-[#d4a373] hover:text-[#c29262] focus-within:outline-none">
                    <span>{{ newVideo.file ? 'Change file' : 'Upload a file' }}</span>
                    <input id="file-upload" name="file-upload" type="file" class="sr-only" @change="handleFileChange" accept="video/*">
                  </label>
                  <p v-if="!newVideo.file" class="pl-1">or drag and drop</p>
                </div>
                <p class="text-xs text-gray-500">
                  {{ newVideo.file ? newVideo.file.name : 'MP4, WebM up to 500MB' }}
                </p>
              </div>
            </div>
          </div>

          <div class="flex space-x-3 pt-4">
            <button type="button" @click="showAddModal = false" class="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors font-medium">Cancel</button>
            <button type="submit" :disabled="isSubmitting || !newVideo.file" class="flex-1 px-4 py-2 bg-[#d4a373] text-black font-bold rounded-lg hover:bg-[#c29262] transition-colors disabled:opacity-50 flex items-center justify-center">
              <Loader2 v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
              {{ isSubmitting ? 'Uploading...' : 'Upload Video' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
