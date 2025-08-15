const express = require("express")
const cors = require("cors")
const { getPosts, createPost, likePost, deletePost, updatePost } = require("./queries")

const app = express()
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => res.send("ok"))

app.get("/posts", async (req, res) => {
  try {
    const rows = await getPosts()
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: "error" })
  }
})

app.post("/posts", async (req, res) => {
  try {
    const nuevo = await createPost(req.body)
    res.status(201).json(nuevo)
  } catch (e) {
    res.status(500).json({ error: "error" })
  }
})

app.put("/posts/like/:id", async (req, res) => {
  try {
    const n = await likePost(req.params.id)
    if (!n) return res.status(404).json({ error: "no existe" })
    res.send("ok")
  } catch (e) {
    res.status(500).json({ error: "error" })
  }
})

app.delete("/posts/:id", async (req, res) => {
  try {
    const n = await deletePost(req.params.id)
    if (!n) return res.status(404).json({ error: "no existe" })
    res.send("ok")
  } catch (e) {
    res.status(500).json({ error: "error" })
  }
})

app.put("/posts/:id", async (req, res) => {
  try {
    const n = await updatePost(req.params.id, req.body)
    if (!n) return res.status(404).json({ error: "no existe" })
    res.send("ok")
  } catch (e) {
    res.status(500).json({ error: "error" })
  }
})

app.listen(3000, () => console.log("server http://localhost:3000"))