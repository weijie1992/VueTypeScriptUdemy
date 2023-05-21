<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useModal } from '../composables/modal'
import { useUsers } from '../stores/users'
const modal = useModal()
const usersStore = useUsers()
const router = useRouter()
const logout = async () => {
  await usersStore.logout()
  router.push({ path: '/' })
}
</script>

<template>
  <div class="navbar">
    <div class="navbar-end">
      <div v-if="usersStore.currentUserId" class="buttons">
        <RouterLink to="/posts/new" class="button">New Post</RouterLink>
        <button class="button" @click="logout()">Log Out</button>
      </div>

      <div v-else class="buttons">
        <button class="button" @click="modal.showModal('signUp')">
          Sign Up
        </button>
        <button @click="modal.showModal('signIn')" class="button">
          Sign In
        </button>
      </div>
    </div>
  </div>

  <Teleport to="#modal">
    <!-- <SignupForm /> -->
    <component :is="modal.component.value"></component>
  </Teleport>
</template>
