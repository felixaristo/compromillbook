<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { Users, Video, Plus, Search, ChevronLeft, ChevronRight, LogOut, LayoutDashboard, Trash2, Edit, Upload, X, Loader2, ClipboardList, FileDown } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import * as XLSX from 'xlsx';
import logo from '../assets/logo-millbook.png';

const router = useRouter();
const activeMenu = ref('members'); // 'members' or 'videos'
const showAddModal = ref(false);
const showEditModal = ref(false);
const showEditVideoModal = ref(false);
const isSubmitting = ref(false);
const isLoading = ref(false);

// --- Member Data & CRUD ---
const members = ref([]);
const memberPage = ref(1);
const memberLimit = ref(10);
const totalMembers = ref(0);
const totalMemberPages = computed(() => Math.ceil(totalMembers.value / memberLimit.value));

const fetchMembers = async () => {
  isLoading.value = true;
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      router.push('/login');
      return;
    }

    const response = await fetch(`${baseUrl}/members?page=${memberPage.value}&limit=${memberLimit.value}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to fetch members');

    const result = await response.json();
    
    if (result.status === 'success' && result.data) {
      members.value = result.data.items || [];
      totalMembers.value = result.data.total || 0;
    }
  } catch (error) {
    console.error('Error fetching members:', error);
  } finally {
    isLoading.value = false;
  }
};

const newMember = ref({ fullname: '', username: '', password: '' });
const editingMember = ref({ id: null, fullname: '', username: '', password: '' });

const openEditModal = (member) => {
  editingMember.value = {
    id: member.id,
    fullname: member.fullname,
    username: member.username,
    password: '' // Kosongkan password saat edit kecuali ingin diganti
  };
  showEditModal.value = true;
};

const addMember = async () => {
  isSubmitting.value = true;
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      throw new Error('No authentication token found. Please login again.');
    }

    const response = await fetch(`${baseUrl}/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newMember.value)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add member');
    }

    // Reset form and close modal
    newMember.value = { fullname: '', username: '', password: '' };
    showAddModal.value = false;
    alert('Member added successfully!');
    
    // Refresh current page
    fetchMembers();
  } catch (error) {
    console.error('Error adding member:', error);
    alert(error.message || 'An error occurred while adding member');
    
    if (error.message.includes('token') || error.message.includes('authentication')) {
      router.push('/login');
    }
  } finally {
    isSubmitting.value = false;
  }
};

const updateMember = async () => {
  isSubmitting.value = true;
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      throw new Error('No authentication token found. Please login again.');
    }

    // Hanya kirim field yang diperlukan. Jika password kosong, jangan kirim.
    const payload = {
      fullname: editingMember.value.fullname,
      username: editingMember.value.username
    };
    if (editingMember.value.password) {
      payload.password = editingMember.value.password;
    }

    const response = await fetch(`${baseUrl}/members/${editingMember.value.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update member');
    }

    alert('Member updated successfully!');
    showEditModal.value = false;
    fetchMembers();
  } catch (error) {
    console.error('Error updating member:', error);
    alert(error.message || 'An error occurred while updating member');
  } finally {
    isSubmitting.value = false;
  }
};

const deleteMember = async (id) => {
  if (confirm('Are you sure you want to delete this member?')) {
    isLoading.value = true;
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await fetch(`${baseUrl}/members/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete member');
      }

      alert('Member deleted successfully!');
      
      // Refresh list
      fetchMembers();
    } catch (error) {
      console.error('Error deleting member:', error);
      alert(error.message || 'An error occurred while deleting member');
      
      if (error.message.includes('token') || error.message.includes('authentication')) {
        router.push('/login');
      }
    } finally {
      isLoading.value = false;
    }
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// --- Video Data & CRUD with Pagination ---
const videos = ref([]);
const videoPage = ref(1);
const itemsPerPage = ref(10);
const totalVideos = ref(0);
const totalVideoPages = computed(() => Math.ceil(totalVideos.value / itemsPerPage.value));

const fetchVideos = async () => {
  isLoading.value = true;
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      router.push('/login');
      return;
    }

    const response = await fetch(`${baseUrl}/videos?page=${videoPage.value}&limit=${itemsPerPage.value}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to fetch videos');

    const result = await response.json();
    
    if (result.status === 'success' && result.data) {
      videos.value = result.data.items || [];
      totalVideos.value = result.data.total || 0;
    }
  } catch (error) {
    console.error('Error fetching videos:', error);
  } finally {
    isLoading.value = false;
  }
};

const paginatedVideos = computed(() => videos.value);
const newVideo = ref({ title: '', file: null, thumbnail: null });
const editingVideo = ref({ id: null, title: '', file: null, thumbnail: null });

const openEditVideoModal = (video) => {
  editingVideo.value = {
    id: video.id,
    title: video.title,
    file: null, // File baru bersifat opsional saat edit
    thumbnail: null // Thumbnail baru bersifat opsional saat edit
  };
  showEditVideoModal.value = true;
};

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    newVideo.value.file = file;
  }
};

const handleThumbnailChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    newVideo.value.thumbnail = file;
  }
};

const handleEditVideoFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    editingVideo.value.file = file;
  }
};

const handleEditThumbnailChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    editingVideo.value.thumbnail = file;
  }
};

const addVideo = async () => {
  if (!newVideo.value.file || !newVideo.value.thumbnail) {
    alert('Please select both video and thumbnail files');
    return;
  }
  
  isSubmitting.value = true;
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      throw new Error('No authentication token found. Please login again.');
    }

    const formData = new FormData();
    formData.append('title', newVideo.value.title);
    formData.append('video', newVideo.value.file);
    formData.append('thumbnail', newVideo.value.thumbnail);

    const response = await fetch(`${baseUrl}/videos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload video');
    }

    alert('Video and thumbnail uploaded successfully!');
    newVideo.value = { title: '', file: null, thumbnail: null };
    showAddModal.value = false;
    
    // Refresh list
    fetchVideos();
  } catch (error) {
    console.error('Error uploading video:', error);
    alert(error.message || 'An error occurred while uploading video');
  } finally {
    isSubmitting.value = false;
  }
};

const updateVideo = async () => {
  isSubmitting.value = true;
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      throw new Error('No authentication token found. Please login again.');
    }

    const formData = new FormData();
    formData.append('title', editingVideo.value.title);
    if (editingVideo.value.file) {
      formData.append('video', editingVideo.value.file);
    }
    if (editingVideo.value.thumbnail) {
      formData.append('thumbnail', editingVideo.value.thumbnail);
    }

    const response = await fetch(`${baseUrl}/videos/${editingVideo.value.id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update video');
    }

    alert('Video updated successfully!');
    showEditVideoModal.value = false;
    fetchVideos();
  } catch (error) {
    console.error('Error updating video:', error);
    alert(error.message || 'An error occurred while updating video');
  } finally {
    isSubmitting.value = false;
  }
};

const deleteVideo = async (id) => {
  if (confirm('Are you sure you want to delete this video?')) {
    isLoading.value = true;
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await fetch(`${baseUrl}/videos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete video');
      }

      alert('Video deleted successfully!');
      
      // Refresh list
      fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
      alert(error.message || 'An error occurred while deleting video');
      
      if (error.message.includes('token') || error.message.includes('authentication')) {
        router.push('/login');
      }
    } finally {
      isLoading.value = false;
    }
  }
};

// --- User Trial Data ---
const trials = ref([]);
const trialPage = ref(1);
const trialLimit = ref(10);
const totalTrials = ref(0);
const totalTrialPages = computed(() => Math.ceil(totalTrials.value / trialLimit.value));

const fetchTrials = async () => {
  isLoading.value = true;
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      router.push('/login');
      return;
    }

    const response = await fetch(`${baseUrl}/user-trial?page=${trialPage.value}&limit=${trialLimit.value}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to fetch user trials');

    const result = await response.json();
    
    if (result.status === 'success' && result.data) {
      trials.value = result.data.items || [];
      totalTrials.value = result.data.total || 0;
    }
  } catch (error) {
    console.error('Error fetching trials:', error);
  } finally {
    isLoading.value = false;
  }
};

const isDownloading = ref(false);

const downloadExcel = async () => {
  if (totalTrials.value === 0) return;
  
  isDownloading.value = true;
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('access_token');
    const allData = [];
    const limit = 50; // Fetch more items per page for faster download
    const totalPages = Math.ceil(totalTrials.value / limit);

    for (let i = 1; i <= totalPages; i++) {
      const response = await fetch(`${baseUrl}/user-trial?page=${i}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.status === 'success' && result.data && result.data.items) {
          allData.push(...result.data.items);
        }
      }
    }

    // Format data for Excel
    const excelData = allData.map(item => ({
      'Full Name': item.fullname,
      'Phone': item.phone,
      'Email': item.email,
      'Company Name': item.companyName,
      'Job Role': item.jobRole,
      'Request Date': new Date(item.createdAt).toLocaleString()
    }));

    // Create Worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'User Trials');

    // Download File
    XLSX.writeFile(workbook, `User_Trials_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    alert('Excel file downloaded successfully!');
  } catch (error) {
    console.error('Error downloading Excel:', error);
    alert('Failed to download Excel file');
  } finally {
    isDownloading.value = false;
  }
};

// --- Lifecycle & Watchers ---
onMounted(() => {
  fetchMembers();
  fetchVideos();
  fetchTrials();
});

watch(memberPage, () => {
  fetchMembers();
});

watch(videoPage, () => {
  fetchVideos();
});

watch(trialPage, () => {
  fetchTrials();
});

watch(activeMenu, (newMenu) => {
  if (newMenu === 'members' && members.value.length === 0) {
    fetchMembers();
  } else if (newMenu === 'videos' && videos.value.length === 0) {
    fetchVideos();
  } else if (newMenu === 'trials' && trials.value.length === 0) {
    fetchTrials();
  }
});

const logout = () => {
  router.push('/');
};
</script>

<template>
  <div class="flex min-h-screen bg-[#121212] text-white">
    <!-- Sidebar -->
    <aside class="w-64 bg-[#1a1a1a] border-r border-white/5 flex flex-col">
      <div class="p-6">
        <img :src="logo" alt="MillBook Logo" class="h-14 w-14 object-cover cursor-pointer rounded-full" @click="router.push('/')" />
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

        <button 
          @click="activeMenu = 'trials'"
          :class="['w-full flex items-center px-4 py-3 rounded-lg transition-colors', activeMenu === 'trials' ? 'bg-[#d4a373] text-black' : 'text-gray-400 hover:bg-white/5']"
        >
          <ClipboardList class="w-5 h-5 mr-3" />
          <span class="font-medium">User Trial</span>
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
          <h2 class="text-3xl font-bold text-white capitalize">
            {{ activeMenu === 'trials' ? 'User Trial' : activeMenu }}
          </h2>
          <div class="flex items-center space-x-4">
            <!-- Download Excel Button (Only for User Trial) -->
            <button 
              v-if="activeMenu === 'trials'"
              @click="downloadExcel"
              :disabled="isDownloading || totalTrials === 0"
              class="flex items-center px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Loader2 v-if="isDownloading" class="w-5 h-5 mr-2 animate-spin" />
              <FileDown v-else class="w-5 h-5 mr-2" />
              {{ isDownloading ? 'Downloading...' : 'Download Excel' }}
            </button>

            <!-- Add Button (Members & Videos) -->
            <button 
              v-if="activeMenu !== 'trials'"
              @click="showAddModal = true"
              class="flex items-center px-5 py-2.5 bg-[#d4a373] text-black font-semibold rounded-lg hover:bg-[#c29262] transition-colors"
            >
              <Plus class="w-5 h-5 mr-2" />
              Add {{ activeMenu === 'members' ? 'Member' : 'Video' }}
            </button>
          </div>
        </div>

        <!-- Members Table -->
        <div v-if="activeMenu === 'members'">
          <div class="bg-[#1a1a1a] rounded-xl border border-white/5 overflow-hidden">
            <table class="w-full text-left">
              <thead class="bg-white/5 border-b border-white/5 text-gray-400 text-sm uppercase">
                <tr>
                  <th class="px-6 py-4 font-semibold">Full Name</th>
                  <th class="px-6 py-4 font-semibold">Username</th>
                  <th class="px-6 py-4 font-semibold">Join Date</th>
                  <th class="px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5 relative">
                <!-- Loading State -->
                <tr v-if="isLoading" class="bg-black/20">
                  <td colspan="4" class="px-6 py-20 text-center">
                    <Loader2 class="w-8 h-8 animate-spin mx-auto text-[#d4a373] mb-2" />
                    <span class="text-gray-400">Loading members...</span>
                  </td>
                </tr>
                
                <!-- Empty State -->
                <tr v-else-if="members.length === 0">
                  <td colspan="4" class="px-6 py-12 text-center text-gray-500 italic">
                    No members found.
                  </td>
                </tr>

                <!-- Data Rows -->
                <template v-else>
                  <tr v-for="member in members" :key="member.id" class="hover:bg-white/[0.02] transition-colors">
                    <td class="px-6 py-4 font-medium text-white">{{ member.fullname }}</td>
                    <td class="px-6 py-4 text-gray-400">{{ member.username }}</td>
                    <td class="px-6 py-4 text-gray-400">{{ formatDate(member.created_at) }}</td>
                    <td class="px-6 py-4">
                      <div class="flex items-center space-x-3">
                        <button @click="openEditModal(member)" class="text-gray-400 hover:text-[#d4a373] transition-colors">
                          <Edit class="w-4 h-4" />
                        </button>
                        <button @click="deleteMember(member.id)" class="text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 class="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="totalMembers > 0" class="mt-6 flex items-center justify-between">
            <p class="text-sm text-gray-400">
              Showing <span class="text-white">{{ (memberPage - 1) * memberLimit + 1 }}</span> to 
              <span class="text-white">{{ Math.min(memberPage * memberLimit, totalMembers) }}</span> of 
              <span class="text-white">{{ totalMembers }}</span> members
            </p>
            <div class="flex space-x-2">
              <button 
                @click="memberPage--" 
                :disabled="memberPage === 1 || isLoading"
                class="p-2 bg-[#242424] border border-white/5 rounded-lg disabled:opacity-30 hover:bg-white/5 transition-colors"
              >
                <ChevronLeft class="w-5 h-5" />
              </button>
              <div class="flex items-center px-4 bg-[#242424] border border-white/5 rounded-lg text-sm font-medium">
                Page {{ memberPage }} of {{ totalMemberPages }}
              </div>
              <button 
                @click="memberPage++" 
                :disabled="memberPage === totalMemberPages || isLoading"
                class="p-2 bg-[#242424] border border-white/5 rounded-lg disabled:opacity-30 hover:bg-white/5 transition-colors"
              >
                <ChevronRight class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Videos Table -->
        <div v-if="activeMenu === 'videos'">
          <div class="bg-[#1a1a1a] rounded-xl border border-white/5 overflow-hidden">
            <table class="w-full text-left">
              <thead class="bg-white/5 border-b border-white/5 text-gray-400 text-sm uppercase">
                <tr>
                  <th class="px-6 py-4 font-semibold">Title</th>
                  <th class="px-6 py-4 font-semibold">Thumbnail</th>
                  <th class="px-6 py-4 font-semibold">Upload Date</th>
                  <th class="px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                <tr v-for="vid in paginatedVideos" :key="vid.id" class="hover:bg-white/[0.02] transition-colors">
                  <td class="px-6 py-4 font-medium text-white">{{ vid.title }}</td>
                  <td class="px-6 py-4 text-gray-400 font-mono text-xs">
                    <img :src="vid.thumbnail" alt="Thumbnail" class="w-35 h-25 rounded-md">
                  </td>
                  <td class="px-6 py-4 text-gray-400">{{ formatDate(vid.created_at) }}</td>
                  <td class="px-6 py-4">
                      <div class="flex items-center space-x-3">
                        <button @click="openEditVideoModal(vid)" class="text-gray-400 hover:text-[#d4a373] transition-colors">
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
          <div v-if="totalVideos > 0" class="mt-6 flex items-center justify-between">
            <p class="text-sm text-gray-400">
              Showing <span class="text-white">{{ (videoPage - 1) * itemsPerPage + 1 }}</span> to 
              <span class="text-white">{{ Math.min(videoPage * itemsPerPage, totalVideos) }}</span> of 
              <span class="text-white">{{ totalVideos }}</span> results
            </p>
            <div class="flex space-x-2">
              <button 
                @click="videoPage--" 
                :disabled="videoPage === 1 || isLoading"
                class="p-2 bg-[#242424] border border-white/5 rounded-lg disabled:opacity-30 hover:bg-white/5 transition-colors"
              >
                <ChevronLeft class="w-5 h-5" />
              </button>
              <div class="flex items-center px-4 bg-[#242424] border border-white/5 rounded-lg text-sm font-medium">
                Page {{ videoPage }} of {{ totalVideoPages }}
              </div>
              <button 
                @click="videoPage++" 
                :disabled="videoPage === totalVideoPages || isLoading"
                class="p-2 bg-[#242424] border border-white/5 rounded-lg disabled:opacity-30 hover:bg-white/5 transition-colors"
              >
                <ChevronRight class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <!-- User Trial Table -->
        <div v-if="activeMenu === 'trials'">
          <div class="bg-[#1a1a1a] rounded-xl border border-white/5 overflow-hidden">
            <table class="w-full text-left">
              <thead class="bg-white/5 border-b border-white/5 text-gray-400 text-sm uppercase">
                <tr>
                  <th class="px-6 py-4 font-semibold">Full Name</th>
                  <th class="px-6 py-4 font-semibold">Phone</th>
                  <th class="px-6 py-4 font-semibold">Email</th>
                  <th class="px-6 py-4 font-semibold">Company</th>
                  <th class="px-6 py-4 font-semibold">Role</th>
                  <!-- <th class="px-6 py-4 font-semibold">Date</th> -->
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5 relative">
                <!-- Loading State -->
                <tr v-if="isLoading" class="bg-black/20">
                  <td colspan="6" class="px-6 py-20 text-center">
                    <Loader2 class="w-8 h-8 animate-spin mx-auto text-[#d4a373] mb-2" />
                    <span class="text-gray-400">Loading trials...</span>
                  </td>
                </tr>
                
                <!-- Empty State -->
                <tr v-else-if="trials.length === 0">
                  <td colspan="6" class="px-6 py-12 text-center text-gray-500 italic">
                    No trial requests found.
                  </td>
                </tr>

                <!-- Data Rows -->
                <template v-else>
                  <tr v-for="trial in trials" :key="trial.id" class="hover:bg-white/[0.02] transition-colors">
                    <td class="px-6 py-4 font-medium text-white">{{ trial.fullname }}</td>
                    <td class="px-6 py-4 text-gray-400">{{ trial.phone }}</td>
                    <td class="px-6 py-4 text-gray-400">{{ trial.email }}</td>
                    <td class="px-6 py-4 text-gray-400">{{ trial.companyName }}</td>
                    <td class="px-6 py-4 text-gray-400">{{ trial.jobRole }}</td>
                    <!-- <td class="px-6 py-4 text-gray-400">{{ formatDate(trial.created_at) }}</td> -->
                  </tr>
                </template>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="totalTrials > 0" class="mt-6 flex items-center justify-between">
            <p class="text-sm text-gray-400">
              Showing <span class="text-white">{{ (trialPage - 1) * trialLimit + 1 }}</span> to 
              <span class="text-white">{{ Math.min(trialPage * trialLimit, totalTrials) }}</span> of 
              <span class="text-white">{{ totalTrials }}</span> requests
            </p>
            <div class="flex space-x-2">
              <button 
                @click="trialPage--" 
                :disabled="trialPage === 1 || isLoading"
                class="p-2 bg-[#242424] border border-white/5 rounded-lg disabled:opacity-30 hover:bg-white/5 transition-colors"
              >
                <ChevronLeft class="w-5 h-5" />
              </button>
              <div class="flex items-center px-4 bg-[#242424] border border-white/5 rounded-lg text-sm font-medium">
                Page {{ trialPage }} of {{ totalTrialPages }}
              </div>
              <button 
                @click="trialPage++" 
                :disabled="trialPage === totalTrialPages || isLoading"
                class="p-2 bg-[#242424] border border-white/5 rounded-lg disabled:opacity-30 hover:bg-white/5 transition-colors"
              >
                <ChevronRight class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Form (Member - Add) -->
    <div v-if="showAddModal && activeMenu === 'members'" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div class="w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl p-8">
        <h3 class="text-2xl font-bold mb-6">Add New Member</h3>
        <form @submit.prevent="addMember" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
            <input v-model="newMember.fullname" required type="text" class="w-full px-4 py-2 bg-[#242424] border border-white/5 rounded-lg focus:ring-2 focus:ring-[#d4a373] outline-none">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Username</label>
            <input v-model="newMember.username" required type="text" class="w-full px-4 py-2 bg-[#242424] border border-white/5 rounded-lg focus:ring-2 focus:ring-[#d4a373] outline-none">
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

    <!-- Modal Form (Member - Edit) -->
    <div v-if="showEditModal && activeMenu === 'members'" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div class="w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl p-8">
        <h3 class="text-2xl font-bold mb-6">Edit Member</h3>
        <form @submit.prevent="updateMember" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
            <input v-model="editingMember.fullname" required type="text" class="w-full px-4 py-2 bg-[#242424] border border-white/5 rounded-lg focus:ring-2 focus:ring-[#d4a373] outline-none">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Username</label>
            <input v-model="editingMember.username" required type="text" class="w-full px-4 py-2 bg-[#242424] border border-white/5 rounded-lg focus:ring-2 focus:ring-[#d4a373] outline-none">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">New Password (leave empty to keep current)</label>
            <input v-model="editingMember.password" type="password" placeholder="••••••••" class="w-full px-4 py-2 bg-[#242424] border border-white/5 rounded-lg focus:ring-2 focus:ring-[#d4a373] outline-none">
          </div>
          <div class="flex space-x-3 pt-4">
            <button type="button" @click="showEditModal = false" class="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors font-medium">Cancel</button>
            <button type="submit" :disabled="isSubmitting" class="flex-1 px-4 py-2 bg-[#d4a373] text-black font-bold rounded-lg hover:bg-[#c29262] transition-colors disabled:opacity-50 flex items-center justify-center">
              <Loader2 v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
              {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
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
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Thumbnail (Image)</label>
              <div class="mt-1 flex justify-center px-4 pt-4 pb-4 border-2 border-white/5 border-dashed rounded-lg hover:border-[#d4a373]/50 transition-colors group">
                <div class="space-y-1 text-center">
                  <div class="flex text-sm text-gray-400">
                    <label for="thumbnail-upload" class="relative cursor-pointer rounded-md font-medium text-[#d4a373] hover:text-[#c29262] focus-within:outline-none">
                      <span>{{ newVideo.thumbnail ? 'Change' : 'Upload Thumbnail' }}</span>
                      <input id="thumbnail-upload" name="thumbnail-upload" type="file" class="sr-only" @change="handleThumbnailChange" accept="image/*">
                    </label>
                  </div>
                  <p class="text-xs text-gray-500 truncate max-w-[120px]">
                    {{ newVideo.thumbnail ? newVideo.thumbnail.name : 'PNG, JPG up to 2MB' }}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Video File</label>
              <div class="mt-1 flex justify-center px-4 pt-4 pb-4 border-2 border-white/5 border-dashed rounded-lg hover:border-[#d4a373]/50 transition-colors group">
                <div class="space-y-1 text-center">
                  <div class="flex text-sm text-gray-400">
                    <label for="file-upload" class="relative cursor-pointer rounded-md font-medium text-[#d4a373] hover:text-[#c29262] focus-within:outline-none">
                      <span>{{ newVideo.file ? 'Change' : 'Upload Video' }}</span>
                      <input id="file-upload" name="file-upload" type="file" class="sr-only" @change="handleFileChange" accept="video/*">
                    </label>
                  </div>
                  <p class="text-xs text-gray-500 truncate max-w-[120px]">
                    {{ newVideo.file ? newVideo.file.name : 'MP4, WebM up to 500MB' }}
                  </p>
                </div>
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

    <!-- Modal Form (Video - Edit) -->
    <div v-if="showEditVideoModal && activeMenu === 'videos'" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div class="w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl p-8">
        <h3 class="text-2xl font-bold mb-6">Edit Video</h3>
        <form @submit.prevent="updateVideo" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Video Title</label>
            <input v-model="editingVideo.title" required type="text" class="w-full px-4 py-2 bg-[#242424] border border-white/5 rounded-lg focus:ring-2 focus:ring-[#d4a373] outline-none">
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Thumbnail (leave empty to keep)</label>
              <div class="mt-1 flex justify-center px-4 pt-4 pb-4 border-2 border-white/5 border-dashed rounded-lg hover:border-[#d4a373]/50 transition-colors group">
                <div class="space-y-1 text-center">
                  <div class="flex text-sm text-gray-400">
                    <label for="edit-thumbnail-upload" class="relative cursor-pointer rounded-md font-medium text-[#d4a373] hover:text-[#c29262] focus-within:outline-none">
                      <span>{{ editingVideo.thumbnail ? 'Change' : 'New Thumbnail' }}</span>
                      <input id="edit-thumbnail-upload" name="edit-thumbnail-upload" type="file" class="sr-only" @change="handleEditThumbnailChange" accept="image/*">
                    </label>
                  </div>
                  <p class="text-xs text-gray-500 truncate max-w-[120px]">
                    {{ editingVideo.thumbnail ? editingVideo.thumbnail.name : 'PNG, JPG up to 2MB' }}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Video (leave empty to keep)</label>
              <div class="mt-1 flex justify-center px-4 pt-4 pb-4 border-2 border-white/5 border-dashed rounded-lg hover:border-[#d4a373]/50 transition-colors group">
                <div class="space-y-1 text-center">
                  <div class="flex text-sm text-gray-400">
                    <label for="edit-file-upload" class="relative cursor-pointer rounded-md font-medium text-[#d4a373] hover:text-[#c29262] focus-within:outline-none">
                      <span>{{ editingVideo.file ? 'Change' : 'New Video' }}</span>
                      <input id="edit-file-upload" name="edit-file-upload" type="file" class="sr-only" @change="handleEditVideoFileChange" accept="video/*">
                    </label>
                  </div>
                  <p class="text-xs text-gray-500 truncate max-w-[120px]">
                    {{ editingVideo.file ? editingVideo.file.name : 'MP4, WebM up to 500MB' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="flex space-x-3 pt-4">
            <button type="button" @click="showEditVideoModal = false" class="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors font-medium">Cancel</button>
            <button type="submit" :disabled="isSubmitting" class="flex-1 px-4 py-2 bg-[#d4a373] text-black font-bold rounded-lg hover:bg-[#c29262] transition-colors disabled:opacity-50 flex items-center justify-center">
              <Loader2 v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
              {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
