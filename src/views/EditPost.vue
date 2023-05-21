<script lang="ts" setup>
import PostWriter from '../components/PostWriter.vue'
import { usePosts } from '../stores/posts'
import { Post } from '../posts'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
const postsStore = usePosts()
const id = route.params.id as string

const post: Post = postsStore.all.get(id)
console.log('🚀 ~ file: ShowPost.vue:11 ~ postsStore.all.:', postsStore.all)
console.log('🚀 ~ file: ShowPost.vue:11 ~ post:', post)
if (!post) {
  throw Error(`Post with id ${id} was not found`)
}

const handleSubmit = async (post: Post) => {
  const res = await postsStore.updatePost(post)
  console.log('🚀 ~ file: EditPost.vue:20 ~ handleSubmit ~ res:', res)
  router.push('/')
}
</script>

<template>
  New Post
  <PostWriter :post="post" @submit="handleSubmit" />
</template>
