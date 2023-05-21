<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Post } from '../posts'
import { usePosts } from '../stores/posts'
import { useUsers } from '../stores/users'
import { computed } from 'vue'

const route = useRoute()
const postsStore = usePosts()
const usersStore = useUsers()

const id = route.params.id as string

const post: Post = postsStore.all.get(id)
console.log('🚀 ~ file: ShowPost.vue:11 ~ postsStore.all.:', postsStore.all)
console.log('🚀 ~ file: ShowPost.vue:11 ~ post:', post)
if (!post) {
  throw Error(`Post with id ${id} was not found`)
}

const canEdit = computed(() => {
  return usersStore.currentUserId && post.authorId === usersStore.currentUserId
})
</script>

<template>
  <div class="columns">
    <div class="column"></div>
    <div class="column is-two-thirds">
      <RouterLink
        v-if="canEdit"
        class="is-link button is-rounded"
        :to="`/posts/${post.id}/edit`"
      >
        Edit Post
      </RouterLink>
      <h1>{{ post.title }}</h1>
      <div v-html="post.html" />
    </div>
    <div class="column"></div>
  </div>
</template>
