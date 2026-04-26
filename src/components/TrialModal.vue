<script setup>
import { ref } from 'vue';
import { X, Loader2, CheckCircle2 } from 'lucide-vue-next';
import { isTrialModalOpen, closeTrialModal } from '../trialStore';

const form = ref({
  fullname: '',
  phone: '',
  email: '',
  companyName: '',
  jobRole: ''
});

const isSubmitting = ref(false);
const isSuccess = ref(false);

const roles = [
  'Owner',
  'Manager',
  'Director',
  'Marketing Manager',
  'Operational Manager',
  'Others'
];

const handleSubmit = () => {
  isSubmitting.value = true;
  // Simulate API call
  setTimeout(() => {
    isSubmitting.value = false;
    isSuccess.value = true;
    // Reset form after 2 seconds and close
    setTimeout(() => {
      isSuccess.value = false;
      form.value = {
        fullname: '',
        phone: '',
        email: '',
        companyName: '',
        jobRole: ''
      };
      closeTrialModal();
    }, 2000);
  }, 1500);
};
</script>

<template>
  <div 
    v-if="isTrialModalOpen" 
    class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300"
  >
    <div 
      class="relative w-full max-w-lg bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
      @click.stop
    >
      <!-- Close Button -->
      <button 
        @click="closeTrialModal"
        class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
      >
        <X class="w-6 h-6" />
      </button>

      <div class="p-8 md:p-10">
        <template v-if="!isSuccess">
          <div class="mb-8">
            <h3 class="text-3xl font-serif font-bold text-[#e0c097] mb-2">Start Your Free Trial</h3>
            <p class="text-gray-400">Experience the future of restaurant management.</p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-5">
            <!-- Fullname -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1.5">Full Name <span class="text-[#d4a373]">*</span></label>
              <input 
                v-model="form.fullname"
                type="text" 
                required
                placeholder="Enter your full name"
                class="w-full px-4 py-3 bg-[#242424] border border-white/5 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#d4a373] focus:border-transparent outline-none transition-all"
              >
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <!-- Phone -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1.5">Phone <span class="text-[#d4a373]">*</span></label>
                <input 
                  v-model="form.phone"
                  type="tel" 
                  required
                  placeholder="+62 ..."
                  class="w-full px-4 py-3 bg-[#242424] border border-white/5 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#d4a373] focus:border-transparent outline-none transition-all"
                >
              </div>
              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                <input 
                  v-model="form.email"
                  type="email" 
                  placeholder="name@company.com"
                  class="w-full px-4 py-3 bg-[#242424] border border-white/5 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#d4a373] focus:border-transparent outline-none transition-all"
                >
              </div>
            </div>

            <!-- Company Name -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1.5">Company Name <span class="text-[#d4a373]">*</span></label>
              <input 
                v-model="form.companyName"
                type="text" 
                required
                placeholder="Restaurant or Group Name"
                class="w-full px-4 py-3 bg-[#242424] border border-white/5 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#d4a373] focus:border-transparent outline-none transition-all"
              >
            </div>

            <!-- Job Role -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1.5">Job Role <span class="text-[#d4a373]">*</span></label>
              <select 
                v-model="form.jobRole"
                required
                class="w-full px-4 py-3 bg-[#242424] border border-white/5 rounded-lg text-white focus:ring-2 focus:ring-[#d4a373] outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>Select your role</option>
                <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
              </select>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="w-full py-4 bg-[#d4a373] hover:bg-[#c29262] text-black font-bold rounded-xl transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              <Loader2 v-if="isSubmitting" class="w-5 h-5 mr-2 animate-spin" />
              {{ isSubmitting ? 'Sending Request...' : 'Get My Free Trial' }}
            </button>

            <p class="text-center text-xs text-gray-500 mt-4">
              By clicking "Get My Free Trial", you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </template>

        <!-- Success View -->
        <div v-else class="text-center py-10 flex flex-col items-center justify-center space-y-4">
          <div class="w-20 h-20 bg-[#d4a373]/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 class="w-12 h-12 text-[#d4a373]" />
          </div>
          <h3 class="text-3xl font-serif font-bold text-white">Request Sent!</h3>
          <p class="text-gray-400 max-w-xs">
            Thank you for your interest. Our team will contact you within 24 hours to set up your account.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.5em;
}
</style>
