import { ref } from 'vue';

const alert = ref({ message: '', type: 'success' });
let timer = null;

export function useAlert() {
  function showAlert(message, type = 'success') {
    alert.value = { message, type };
    clearTimeout(timer);
    timer = setTimeout(() => {
      alert.value.message = '';
    }, 4000);
  }

  return { alert, showAlert };
}