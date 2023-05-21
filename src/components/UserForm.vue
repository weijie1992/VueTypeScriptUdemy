<script setup lang="ts">
import { computed, ref, defineEmits, defineProps } from 'vue'
import FormInput from './FormInput.vue'
import { validate, checkLength, required } from '../validation.ts'
import { NewUser } from '../users.ts'

const props = defineProps<{
  error?: string
}>()
console.log('🚀 ~ file: UserForm.vue:8 ~ props:', props)

const emit = defineEmits<{
  (event: 'submit', payload: NewUser): void
}>()

const username = ref('')
const password = ref('')
const usernameStatus = computed(() => {
  return validate(username.value, [required, checkLength({ min: 5, max: 10 })])
})
const passwordStatus = computed(() => {
  return validate(password.value, [required, checkLength({ min: 10, max: 40 })])
})

const isInvalid = computed(() => {
  return !usernameStatus.value.valid || !passwordStatus.value.valid
})

const handleSubmit = async () => {
  if (!isInvalid) {
    return
  }
  const newUser: NewUser = {
    username: username.value,
    password: password.value,
  }
  try {
    emit('submit', newUser)
  } catch (err) {
  } finally {
  }
}
</script>

<template>
  <form class="form" @submit.prevent="handleSubmit">
    <FormInput
      name="Username"
      v-model="username"
      :status="usernameStatus"
      type="text"
    />
    <FormInput
      name="Password"
      v-model="password"
      :status="passwordStatus"
      type="password"
    />
    <div class="is-danger help" v-if="error">{{ error }}</div>
    <button class="button" :disabled="isInvalid">Submit</button>
  </form>
</template>

<style scoped>
.form {
  background: white;
  padding: 30px;
  margin-top: 50px;
}
</style>
