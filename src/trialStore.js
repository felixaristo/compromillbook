import { ref } from 'vue';

export const isTrialModalOpen = ref(false);

export const openTrialModal = () => {
  isTrialModalOpen.value = true;
};

export const closeTrialModal = () => {
  isTrialModalOpen.value = false;
};
