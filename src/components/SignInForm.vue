<script lang="ts" setup>
import { useModal } from '../composables/modal'
import { useUsers } from '../stores/users'
import { NewUser } from '../users'
import UserForm from './UserForm.vue'
import { ref } from 'vue'
const usersStore = useUsers()
const modal = useModal()

const error = ref('')
const handleSignIn = async (newUser: NewUser) => {
  try {
    await usersStore.signIn(newUser)
    modal.hideModal()
  } catch (err) {
    console.log('🚀 ~ file: SignInForm.vue:16 ~ handleSignIn ~ err:', err)
    error.value = 'Username or Password was incorrect'
  } finally {
  }
}
</script>

<template>
  <UserForm @submit="handleSignIn" :error="error" />
</template>
