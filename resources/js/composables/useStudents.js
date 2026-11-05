import { ref, reactive, computed } from 'vue';
import api from '../api';
import { useAuth } from './useAuth';
import { useAlert } from './useAlert';

const students = ref([]);
const loading = ref(false);
const saving = ref(false);
const deletingId = ref(null);
const formErrors = ref({});
const editingId = ref(null);

const form = reactive({
  name: '',
  email: '',
  course: '',
  year_level: '',
});

const isEditing = computed(() => editingId.value !== null);

function resetForm() {
  editingId.value = null;
  form.name = '';
  form.email = '';
  form.course = '';
  form.year_level = '';
  formErrors.value = {};
}

export function useStudents() {
  const { clearSession } = useAuth();
  const { showAlert } = useAlert();

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

  function clearStudents() {
    students.value = [];
    resetForm();
  }

  function startEdit(student) {
    editingId.value = student.id;
    form.name = student.name;
    form.email = student.email;
    form.course = student.course;
    form.year_level = student.year_level;
    formErrors.value = {};
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    resetForm();
  }

  async function saveStudent() {
    if (saving.value) return;

    formErrors.value = {};
    saving.value = true;

    try {
      if (isEditing.value) {
        await api.put(`/students/${editingId.value}`, { ...form });
        showAlert('Student updated successfully.');
      } else {
        await api.post('/students', { ...form });
        showAlert('Student added successfully.');
      }
      resetForm();
      await fetchStudents();
    } catch (error) {
      if (error.response?.status === 422) {
        formErrors.value = error.response.data.errors;
        showAlert('Please fix the validation errors below.', 'error');
      } else {
        handleError(error, 'Failed to save student.');
      }
    } finally {
      saving.value = false;
    }
  }

  async function removeStudent(student) {
    if (!confirm(`Delete ${student.name}?`)) return;

    deletingId.value = student.id;

    try {
      await api.delete(`/students/${student.id}`);
      showAlert('Student deleted successfully.');
      if (editingId.value === student.id) {
        resetForm();
      }
      await fetchStudents();
    } catch (error) {
      handleError(error, 'Failed to delete student.');
    } finally {
      deletingId.value = null;
    }
  }

  return {
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
  };
}