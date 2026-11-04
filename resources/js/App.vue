<script setup>
import { ref, computed, onMounted } from 'vue';
import api from './api';
import AlertMessage from './components/AlertMessage.vue';
import LoginForm from './components/LoginForm.vue';
import StudentForm from './components/StudentForm.vue';
import StudentTable from './components/StudentTable.vue';

const token = ref(localStorage.getItem('token'));
const role = ref(localStorage.getItem('role'));
const students = ref([]);
const selectedStudent = ref(null);
const formErrors = ref({});
const formKey = ref(0);
const loading = ref(false);
const loginError = ref('');
const alert = ref({ message: '', type: 'success' });

const isLoggedIn = computed(() => !!token.value);
const isAdmin = computed(() => role.value === 'admin');

let alertTimer = null;

function showAlert(message, type = 'success') {
  alert.value = { message, type };
  clearTimeout(alertTimer);
  alertTimer = setTimeout(() => {
    alert.value.message = '';
  }, 4000);
}

function clearSession() {
  token.value = null;
  role.value = null;
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  students.value = [];
  selectedStudent.value = null;
  formErrors.value = {};
}

function handleError(error, fallback) {
  const status = error.response?.status;

  if (status === 401) {
    clearSession();
    showAlert('Session expired. Please log in again.', 'error');
  } else if (status === 403) {
    showAlert('You do not have permission to do that.', 'error');
  } else {
    showAlert(error.response?.data?.message || fallback, 'error');
  }
}

async function fetchStudents() {
  loading.value = true;
  try {
    const response = await api.get('/students');
    students.value = response.data;
  } catch (error) {
    handleError(error, 'Failed to load students.');
  } finally {
    loading.value = false;
  }
}

async function handleLogin(credentials) {
  loginError.value = '';
  try {
    const response = await api.post('/login', credentials);
    token.value = response.data.token;
    role.value = response.data.role;
    localStorage.setItem('token', token.value);
    localStorage.setItem('role', role.value);
    showAlert('Login successful.');
    await fetchStudents();
  } catch (error) {
    loginError.value = error.response?.data?.message || 'Login failed.';
  }
}

async function handleLogout() {
  try {
    await api.post('/logout');
  } catch (error) {
  }
  clearSession();
  showAlert('Logged out successfully.');
}

function startEdit(student) {
  selectedStudent.value = student;
  formErrors.value = {};
  formKey.value++;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelEdit() {
  selectedStudent.value = null;
  formErrors.value = {};
  formKey.value++;
}

async function saveStudent(data) {
  formErrors.value = {};
  try {
    if (selectedStudent.value) {
      await api.put(`/students/${selectedStudent.value.id}`, data);
      showAlert('Student updated successfully.');
    } else {
      await api.post('/students', data);
      showAlert('Student added successfully.');
    }
    selectedStudent.value = null;
    formKey.value++;
    await fetchStudents();
  } catch (error) {
    if (error.response?.status === 422) {
      formErrors.value = error.response.data.errors;
      showAlert('Please fix the validation errors below.', 'error');
    } else {
      handleError(error, 'Failed to save student.');
    }
  }
}

async function removeStudent(student) {
  if (!confirm(`Delete ${student.name}?`)) return;

  try {
    await api.delete(`/students/${student.id}`);
    showAlert('Student deleted successfully.');
    if (selectedStudent.value?.id === student.id) {
      cancelEdit();
    }
    await fetchStudents();
  } catch (error) {
    handleError(error, 'Failed to delete student.');
  }
}

onMounted(() => {
  if (isLoggedIn.value) {
    fetchStudents();
  }
});
</script>

<template>
  <div class="container">
    <header class="header">
      <h1>Student Management</h1>
      <div v-if="isLoggedIn" class="user-info">
        <span class="badge">{{ role }}</span>
        <button class="btn btn-secondary" @click="handleLogout">Logout</button>
      </div>
    </header>

    <AlertMessage :message="alert.message" :type="alert.type" />

    <LoginForm v-if="!isLoggedIn" :error="loginError" @login="handleLogin" />

    <template v-else>
      <StudentForm
        v-if="isAdmin"
        :key="formKey"
        :student="selectedStudent"
        :errors="formErrors"
        @submit="saveStudent"
        @cancel="cancelEdit"
      />
      <p v-else class="info">You are logged in as a regular user. You can view records only.</p>

      <StudentTable
        :students="students"
        :is-admin="isAdmin"
        :loading="loading"
        @edit="startEdit"
        @delete="removeStudent"
      />
    </template>
  </div>
</template>