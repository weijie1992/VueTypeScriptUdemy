import express, { Request, Response } from 'express'
import cors from 'cors'
import { Post, thisMonth, thisWeek, today } from '../posts.ts'
import bodyParser from 'body-parser'
import { NewUser, User } from '../users.ts'
import cookieParser from 'cookie-parser'
import jsonwebtoken from 'jsonwebtoken'

const app = express()
app.use(cors())
app.use(cookieParser())
app.use(bodyParser.json())

const allPosts = [today, thisWeek, thisMonth]

const allUsers: User[] = []

app.get('/posts', (_, res) => {
  console.log('🚀 ~ file: index.ts:20 ~ app.get ~ allPosts:', allPosts)
  res.json(allPosts)
})

//note that the 3rd arguement Post is the req.body
app.post<{}, {}, Post>('/posts', (req, res) => {
  console.log(req.body)
  const post = { ...req.body, id: (Math.random() * 100000).toFixed() }
  allPosts.push(post)
  console.log('🚀 ~ file: index.ts:19 ~ post:', post)
  res.json(post)
})

//note that the 3rd arguement Post is the req.body
app.post<{}, {}, NewUser>('/users', (req, res) => {
  console.log(req.body)
  const user = { ...req.body, id: (Math.random() * 100000).toFixed() }
  allUsers.push(user)
  authenticate(user.id, req, res)
  const { password, ...rest } = user
  res.json(rest)
})

app.put<{}, {}, Post>('/posts', (req, res) => {
  const index = allPosts.findIndex((x) => x.id === req.body.id)
  if (index === -1) {
    throw Error(`Post with id ${req.body.id} was not found`)
  }
  const existingPost = allPosts[index]
  allPosts[index] = { ...existingPost, ...req.body }
  res.json(allPosts[index])
})

const SECRET = 'my-secret'
const COOKIE = 'vuejs-jwt'

const authenticate = (id: string, _: Request, res: Response) => {
  //Token (sign)
  const token = jsonwebtoken.sign({ id }, SECRET, {
    issuer: 'vuejs-course',
    expiresIn: '30 days',
  })
  res.cookie(COOKIE, token, { httpOnly: true })
}

app.get('/current-user', (req, res) => {
  try {
    const token = req.cookies[COOKIE]
    const result = jsonwebtoken.verify(token, SECRET) as { id: number }
    console.log('🚀 ~ file: index.ts:57 ~ app.get ~ result:', result)
    res.json({ id: result.id })
  } catch (err) {
    console.log('🚀 ~ file: index.ts:71 ~ app.get ~ err:', err)
    res.status(404).end()
  }
})

app.post('/logout', (_, res) => {
  res.cookie(COOKIE, '', { httpOnly: true })
  res.status(200).end()
})

//note that the 3rd arguement Post is the req.body
app.post<{}, {}, NewUser>('/login', (req, res) => {
  console.log(req.body)
  const targetUser = allUsers.find((x) => x.username === req.body.username)
  if (!targetUser || targetUser.password !== req.body.password) {
    res.status(401).end()
  } else {
    authenticate(targetUser.id, req, res)
    res.status(200).end()
  }
})

app.listen(8001, () => {
  console.log('Server started on port 8001 (http://localhost:8001/posts')
})
