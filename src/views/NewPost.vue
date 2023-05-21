<script lang="ts" setup>
import { DateTime } from 'luxon'
import PostWriter from '../components/PostWriter.vue'
import { TimelinePost } from '../posts'
import { useUsers } from '../stores/users'
import { usePosts } from '../stores/posts'
import { Post } from '../posts'
import { useRouter } from 'vue-router'

const router = useRouter()

const postsStore = usePosts()
const usersStore = useUsers()
if (!usersStore.currentUserId) {
  throw Error('User was not found')
}
const post: TimelinePost = {
  id: '-1',
  authorId: usersStore.currentUserId,
  title: 'Title',
  created: DateTime.now(),
  markdown: '## Title',
  html: '<h2>Title</h2>',
}
const handleSubmit = async (post: Post) => {
  const res = await postsStore.createPost(post)
  console.log('🚀 ~ file: NewPost.vue:27 ~ handleSubmit ~ res:', res)
  router.push('/')
}
</script>

<template>
  New Post
  <PostWriter :post="post" @submit="handleSubmit" />
</template>
