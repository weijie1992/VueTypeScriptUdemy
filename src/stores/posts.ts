import { defineStore } from 'pinia'
import { Post, today, thisWeek, thisMonth, TimelinePost } from '../posts'
import { Period } from '../constants'
import { DateTime } from 'luxon'

interface PostsState {
  ids: string[] //["1",:"2"]
  all: Map<string, Post>
  selectedPeriod: Period
}

const delay = () => {
  return new Promise((resolve) => setTimeout(resolve, 1000))
}

export const usePosts = defineStore('post', {
  state: (): PostsState => ({
    ids: [today.id, thisWeek.id, thisMonth.id],
    all: new Map([
      [today.id, today],
      [thisWeek.id, thisWeek],
      [thisMonth.id, thisMonth],
    ]),
    selectedPeriod: 'Today',
  }),
  actions: {
    setSelectedPeriod(period: Period) {
      this.selectedPeriod = period
    },
    async fetchPost() {
      const res = await window.fetch('/api/posts')
      const data = (await res.json()) as Post[]
      await delay()
      let ids: string[] = []
      let all = new Map<string, Post>()
      for (const post of data) {
        ids.push(post.id)
        all.set(post.id, post)
      }
      this.ids = ids
      this.all = all
    },

    async createPost(post: Post) {
      const body = JSON.stringify({ ...post })
      await window.fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      })
      return this.fetchPost()
    },

    async updatePost(post: Post) {
      const body = JSON.stringify({ ...post })
      await window.fetch('/api/posts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      })
      return this.fetchPost()
    },
  },

  getters: {
    filteredPosts: (state: PostsState): TimelinePost[] => {
      const mappedToTimelinePost = state.ids.map((id) => {
        const post: Post | undefined = state.all.get(id)
        if (post === undefined) {
          throw Error('Post with id ' + id + 'not found')
        }
        return {
          ...post,
          created: DateTime.fromISO(post.created),
        }
      })
      const filtered: TimelinePost[] = mappedToTimelinePost.filter((post) => {
        if (state.selectedPeriod === 'Today') {
          return post.created >= DateTime.now().minus({ day: 1 })
        } else if (state.selectedPeriod === 'This Week') {
          return post.created >= DateTime.now().minus({ week: 1 })
        }
        return post
      })
      return filtered
    },
  },
})
