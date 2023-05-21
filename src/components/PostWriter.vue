<script lang="ts" setup>
import { Post, TimelinePost } from '../posts'
import { ref, onMounted, watch } from 'vue'
import { marked } from 'marked'
import highlightjs from 'highlight.js'
import debounce from 'lodash/debounce'
import { useUsers } from '../stores/users'
import { defineEmits } from 'vue'

const props = defineProps<{ post: TimelinePost | Post }>()
const emit = defineEmits<{
  (event: 'submit', post: Post): void
}>()

const usersStore = useUsers()

const title = ref(props.post.title)
const content = ref(props.post.markdown)
const html = ref('')
const contentEditable = ref<HTMLDivElement>()

const parseHtml = (markdown: string) => {
  marked.parse(
    markdown,
    {
      gfm: true,
      breaks: true,
      highlight: (code) => {
        return highlightjs.highlightAuto(code).value
      },
    },
    (_, parseResult) => {
      html.value = parseResult
    }
  )
}

watch(
  content,
  debounce((newContent, ) => {
    parseHtml(newContent)
  }, 250),
  {
    immediate: true,
  }
)

onMounted(() => {
  if (!contentEditable.value) {
    throw Error('Content value not defined')
  }
  contentEditable.value.innerText = content.value
})

const handleInput = () => {
  if (!contentEditable.value) {
    throw Error('ContentEditable value is undefined')
  }
  content.value = contentEditable.value?.innerText
}

const handleClick = async () => {
  if (!usersStore.currentUserId) {
    throw Error('User not logged in')
  }
  const newPost: Post = {
    ...props.post,
    created:
      typeof props.post.created === 'string'
        ? props.post.created
        : props.post.created.toISO(),
    authorId: usersStore.currentUserId,
    title: title.value,
    markdown: content.value,
    html: html.value,
  }
  emit('submit', newPost)
}
</script>

<template>
  <div class="columns">
    <div class="column">
      <div class="field">
        <div class="label">Post title</div>
        <input type="text" class="input" v-model="title" />
      </div>
    </div>
  </div>

  <div class="columns">
    <div class="column">
      <div contenteditable ref="contentEditable" @input="handleInput" />
    </div>
    <div class="column" v-html="html"></div>
  </div>

  <div class="columns">
    <div class="column">
      <button class="button is-primary is-pulled-right" @click="handleClick">
        Save Post
      </button>
    </div>
  </div>
</template>
