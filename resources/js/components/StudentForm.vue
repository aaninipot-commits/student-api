<script setup>
defineProps({
  form: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) },
  isEditing: { type: Boolean, default: false },
  saving: { type: Boolean, default: false },
});

defineEmits(['submit', 'cancel']);
</script>

<template>
  <form class="card" @submit.prevent="$emit('submit')">
    <h2>{{ isEditing ? 'Edit Student' : 'Add Student' }}</h2>

    <div class="field">
      <label for="name">Name</label>
      <input id="name" v-model="form.name" type="text" />
      <p v-if="errors.name" class="error-text">{{ errors.name[0] }}</p>
    </div>

    <div class="field">
      <label for="student-email">Email</label>
      <input id="student-email" v-model="form.email" type="text" />
      <p v-if="errors.email" class="error-text">{{ errors.email[0] }}</p>
    </div>

    <div class="field">
      <label for="course">Course</label>
      <input id="course" v-model="form.course" type="text" />
      <p v-if="errors.course" class="error-text">{{ errors.course[0] }}</p>
    </div>

    <div class="field">
      <label for="year_level">Year Level (1-5)</label>
      <input id="year_level" v-model.number="form.year_level" type="number" />
      <p v-if="errors.year_level" class="error-text">{{ errors.year_level[0] }}</p>
    </div>

    <div class="actions">
      <button type="submit" class="btn btn-primary" :disabled="saving">
        {{ saving ? 'Saving...' : isEditing ? 'Update' : 'Save' }}
      </button>
      <button
        v-if="isEditing"
        type="button"
        class="btn btn-secondary"
        :disabled="saving"
        @click="$emit('cancel')"
      >
        Cancel
      </button>
    </div>
  </form>
</template>