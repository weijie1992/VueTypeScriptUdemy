<script lang="ts" setup>
import { TimelinePost } from '../posts'
import { ref, onMounted, watch, watchEffect } from 'vue'
import { marked } from 'marked'
import highlightjs from 'highlight.js'
import debounce from 'lodash/debounce'
import { usePosts } from '../stores/posts'
import { useRouter } from 'vue-router'

const props = defineProps<{ post: TimelinePost }>()
const router = useRouter()

const posts = usePosts()

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
    (err, parseResult) => {
      html.value = parseResult
    }
  )
}

watch(
  content,
  debounce((newContent, oldContent) => {
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
  const newPost: TimelinePost = {
    ...props.post,
    title: title.value,
    markdown: content.value,
    html: html.value,
  }
  const res = await posts.createPost(newPost)
  console.log('🚀 ~ file: PostWriter.vue:68 ~ handleClick ~ res:', res)
  router.push('/')
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
