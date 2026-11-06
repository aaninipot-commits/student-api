<script setup>
import { watch } from 'vue';
import AlertMessage from './components/AlertMessage.vue';
import LoginForm from './components/LoginForm.vue';
import StudentForm from './components/StudentForm.vue';
import StudentTable from './components/StudentTable.vue';
import { useAlert } from './composables/useAlert';
import { useAuth } from './composables/useAuth';
import { useStudents } from './composables/useStudents';

const { alert } = useAlert();

const { email, role, isLoggedIn, isAdmin, loggingIn, loggingOut, loginError, login, logout } =
  useAuth();

const {
  students,
  form,
  formErrors,
  isEditing,
  loading,
  saving,
  deletingId,
  fetchStudents,
  clearStudents,
  startEdit,
  cancelEdit,
  saveStudent,
  removeStudent,
} = useStudents();

watch(
  isLoggedIn,
  (loggedIn) => {
    if (loggedIn) {
      fetchStudents();
    } else {
      clearStudents();
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="container">
    <header class="header">
      <h1>Student Management</h1>
      <div v-if="isLoggedIn" class="user-info">
        <span class="muted">{{ email }}</span>
        <span class="badge">{{ isAdmin ? 'Administrator' : 'Regular User' }}</span>
        <button class="btn btn-secondary" :disabled="loggingOut" @click="logout">
          {{ loggingOut ? 'Logging out...' : 'Logout' }}
        </button>
      </div>
    </header>

    <AlertMessage :message="alert.message" :type="alert.type" />

    <LoginForm v-if="!isLoggedIn" :error="loginError" :loading="loggingIn" @login="login" />

    <template v-else>
      <StudentForm
        v-if="isAdmin"
        :form="form"
        :errors="formErrors"
        :is-editing="isEditing"
        :saving="saving"
        @submit="saveStudent"
        @cancel="cancelEdit"
      />
      <p v-else class="info">
        You are logged in as a Regular User ({{ role }}). You can view records only.
      </p>

      <StudentTable
        :students="students"
        :is-admin="isAdmin"
        :loading="loading"
        :deleting-id="deletingId"
        @edit="startEdit"
        @delete="removeStudent"
      />
    </template>
  </div>
</template>