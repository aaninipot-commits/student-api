<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import api from '../api';
import { useAuth } from '../composables/useAuth';

const { token, role } = useAuth();

const result = ref(null);
const testing = ref(false);

const maskedToken = computed(() => (token.value ? token.value.slice(0, 8) + '...' : ''));

function describe(status) {
  if (status === 200) return 'Allowed. Laravel accepted the token and returned the data.';
  if (status === 422) return 'Passed the admin check. Laravel then stopped it at validation, so nothing was saved.';
  if (status === 401) return 'Blocked. Laravel did not receive a valid token.';
  if (status === 403) return 'Blocked. The token is valid, but your role is not allowed to do this.';
  return 'Unexpected result.';
}

async function run(label, request) {
  testing.value = true;
  result.value = null;

  try {
    const response = await request();
    result.value = {
      label,
      status: response.status,
      allowed: true,
      note: describe(response.status),
      message: 'OK',
    };
  } catch (error) {
    const status = error.response?.status ?? 'No response';
    result.value = {
      label,
      status,
      allowed: status === 422,
      note: describe(status),
      message: error.response?.data?.message || 'Request failed.',
    };
  } finally {
    testing.value = false;
  }
}

function testWithToken() {
  return run('GET /api/students (with Bearer token)', () => api.get('/students'));
}

function testWithoutToken() {
  return run('GET /api/students (no token)', () =>
    axios.get('/api/students', { headers: { Accept: 'application/json' } })
  );
}

function testAdminOnly() {
  return run('POST /api/students (admin only)', () => api.post('/students', {}));
}
</script>

<template>
  <div class="card">
    <h2>Protected API Test</h2>
    <p class="muted">
      Each button sends a real request to Laravel. Laravel decides what is allowed, not Vue.
    </p>

    <div class="token-box">
      Authorization: Bearer {{ maskedToken }}<br />
      Role: {{ role }}
    </div>

    <div class="actions actions-wrap">
      <button class="btn btn-primary btn-small" :disabled="testing" @click="testWithToken">
        GET students (with token)
      </button>
      <button class="btn btn-outline btn-small" :disabled="testing" @click="testWithoutToken">
        GET students (no token)
      </button>
      <button class="btn btn-outline btn-small" :disabled="testing" @click="testAdminOnly">
        POST students (admin only)
      </button>
    </div>

    <p v-if="testing" class="muted test-result">Sending request...</p>

    <div
      v-else-if="result"
      :class="['alert', 'test-result', result.allowed ? 'alert-success' : 'alert-error']"
    >
      <strong>{{ result.label }}</strong><br />
      Status: {{ result.status }}<br />
      {{ result.note }}<br />
      Laravel says: {{ result.message }}
    </div>
  </div>
</template>