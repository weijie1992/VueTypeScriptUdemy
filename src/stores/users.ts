import { defineStore } from 'pinia'
import { NewUser } from '../users'

// interface UsersState {
//   currentUserId?: string
// }
type UsersState = {
  currentUserId?: string
}
export const useUsers = defineStore('user', {
  state: (): UsersState => ({
    currentUserId: undefined,
  }),
  actions: {
    async createUser(user: NewUser) {
      const body = JSON.stringify(user)
      await window.fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      })
      return await this.authenticate()
    },

    async signIn(user: NewUser) {
      const body = JSON.stringify(user)
      const res = await window.fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      })
      if ([401, 404].includes(res.status)) {
        console.log(
          '🚀 ~ file: users.ts:34 ~ signIn ~ [401,404].includes(res.status):',
          [401, 404].includes(res.status)
        )
        throw Error('Username / Password incorrect')
      }
      return await this.authenticate()
    },

    async authenticate() {
      setTimeout(async () => {
        try {
          const res = await window.fetch('/api/current-user', {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          console.log('🚀 ~ file: users.ts:29 ~ authenticate: ~ res:', res)
          const result = await res.json()
          console.log(
            '🚀 ~ file: users.ts:30 ~ authenticate: ~ result:',
            result
          )
          console.log(
            '🚀 ~ file: users.ts:30 ~ authenticate: ~ resultid2:',
            result.id
          )
          this.currentUserId = result.id
        } catch (err) {
          console.log('🚀 ~ file: users.ts:66 ~ setTimeout ~ err:', err)
          this.currentUserId = undefined
        }
      }, 1000)
    },

    async logout() {
      await window.fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      return await this.authenticate()
    },
  },
})
