<script setup>
import { reactive } from 'vue';

defineProps({
  error: { type: String, default: '' },
});

const emit = defineEmits(['login']);

const form = reactive({
  email: '',
  password: '',
});

function onSubmit() {
  emit('login', { ...form });
}
</script>

<template>
  <form class="card login-card" @submit.prevent="onSubmit">
    <h2>Login</h2>

    <div class="field">
      <label for="email">Email</label>
      <input id="email" v-model="form.email" type="email" placeholder="admin@email.com" autocomplete="off" />
    </div>

    <div class="field">
      <label for="password">Password</label>
      <input id="password" v-model="form.password" type="password" autocomplete="new-password" />
    </div>

    <p v-if="error" class="error-text">{{ error }}</p>

    <button type="submit" class="btn btn-primary">Log in</button>
  </form>
</template>