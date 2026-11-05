<script setup>
defineProps({
  students: { type: Array, required: true },
  isAdmin: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  deletingId: { type: Number, default: null },
});

defineEmits(['edit', 'delete']);
</script>

<template>
  <div class="card">
    <h2>Student Records</h2>

    <p v-if="loading" class="muted">Loading students...</p>
    <p v-else-if="students.length === 0" class="muted">No students found.</p>

    <div v-else class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Course</th>
            <th>Year</th>
            <th v-if="isAdmin">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in students" :key="student.id">
            <td>{{ student.id }}</td>
            <td>{{ student.name }}</td>
            <td>{{ student.email }}</td>
            <td>{{ student.course }}</td>
            <td>{{ student.year_level }}</td>
            <td v-if="isAdmin">
              <div class="actions">
                <button
                  class="btn btn-small btn-primary"
                  :disabled="deletingId === student.id"
                  @click="$emit('edit', student)"
                >
                  Edit
                </button>
                <button
                  class="btn btn-small btn-danger"
                  :disabled="deletingId === student.id"
                  @click="$emit('delete', student)"
                >
                  {{ deletingId === student.id ? 'Deleting...' : 'Delete' }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>