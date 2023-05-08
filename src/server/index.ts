import express from 'express'
import cors from 'cors'
import { Post, thisMonth, thisWeek, today } from '../posts.ts'
import bodyParser from 'body-parser'
const app = express()
app.use(cors())
app.use(bodyParser.json())

const allPosts = [today, thisWeek, thisMonth]

app.get('/posts', (_, res) => {
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

app.listen(8001, () => {
  console.log('Server started on port 8001 (http://localhost:8001/posts')
})
