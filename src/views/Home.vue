<script setup lang="ts">
import Timeline from '../components/Timeline.vue'
</script>

<template>
  <!-- <Timeline /> -->
  <Suspense>
    <template #default>
      <Timeline />
    </template>
    <template #fallback
      ><progress class="progress is-primary is-small"
    /></template>
  </Suspense>
</template>

<style>
@import 'https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css';
</style>
