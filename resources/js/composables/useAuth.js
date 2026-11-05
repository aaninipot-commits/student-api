import { ref, computed } from 'vue';
import api from '../api';
import { useAlert } from './useAlert';

const token = ref(localStorage.getItem('token'));
const role = ref(localStorage.getItem('role'));
const email = ref(localStorage.getItem('email'));
const loggingIn = ref(false);
const loggingOut = ref(false);
const loginError = ref('');

const isLoggedIn = computed(() => !!token.value);
const isAdmin = computed(() => role.value === 'admin');

export function useAuth() {
  const { showAlert } = useAlert();

  function clearSession() {
    token.value = null;
    role.value = null;
    email.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
  }

  async function login(credentials) {
    if (loggingIn.value) return;

    loginError.value = '';
    loggingIn.value = true;

    try {
      const response = await api.post('/login', credentials);

      token.value = response.data.token;
      role.value = response.data.role;
      email.value = credentials.email;

      localStorage.setItem('token', token.value);
      localStorage.setItem('role', role.value);
      localStorage.setItem('email', email.value);

      showAlert('Login successful.');
    } catch (error) {
      if (error.response?.status === 422) {
        const firstError = Object.values(error.response.data.errors)[0];
        loginError.value = firstError[0];
      } else {
        loginError.value = error.response?.data?.message || 'Login failed. Please try again.';
      }
    } finally {
      loggingIn.value = false;
    }
  }

  async function logout() {
    loggingOut.value = true;

    try {
      await api.post('/logout');
    } catch (error) {
      // the token may already be invalid; we still log out locally
    } finally {
      clearSession();
      loggingOut.value = false;
      showAlert('Logged out successfully.');
    }
  }

  return {
    token,
    role,
    email,
    isLoggedIn,
    isAdmin,
    loggingIn,
    loggingOut,
    loginError,
    login,
    logout,
    clearSession,
  };
}