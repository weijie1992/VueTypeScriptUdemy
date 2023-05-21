import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { router } from './router'
import { useUsers } from './stores/users'
import { usePosts } from './stores/posts'

const app = createApp(App)
app.use(createPinia())

const usersStore = useUsers()
const postsStore = usePosts()

console.log('in main ts')
Promise.all([usersStore.authenticate(), postsStore.fetchPost()]).then(() => {
  app.use(router)
  app.mount('#app')
})
