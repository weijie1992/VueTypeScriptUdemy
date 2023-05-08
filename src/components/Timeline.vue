<script setup lang="ts">
import TimelineItem from './TimelineItem.vue'
import { periods } from '../constants'
import { usePosts } from '../stores/posts'

const postStore = usePosts()
await postStore.fetchPost()
</script>

<template>
  <nav class="is-primary panel">
    <span class="panel-tabs">
      <a
        v-for="period of periods"
        :class="{ 'is-active': period === postStore.selectedPeriod }"
        :key="period"
        @click="postStore.setSelectedPeriod(period)"
        >{{ period }}
      </a>
    </span>

    <TimelineItem
      v-for="post of postStore.filteredPosts"
      :key="post.id"
      :post="post"
    />
  </nav>
</template>
