const { Pool } = require("pg")

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "postgres",
  database: "likeme",
  allowExitOnIdle: true
})

async function getPosts() {
  const { rows } = await pool.query("SELECT * FROM posts ORDER BY id")
  return rows
}

async function createPost(body) {
  const titulo = body.titulo ?? body.title ?? body.name ?? ""
  const descripcion = body.descripcion ?? body.description ?? ""
  const img = `https://picsum.photos/seed/${Date.now()}/400`

  const q = `
    INSERT INTO posts (titulo, img, descripcion, likes)
    VALUES ($1, $2, $3, 0)
    RETURNING *
  `
  const { rows } = await pool.query(q, [titulo, img, descripcion])
  return rows[0]
}

async function likePost(id) {
  const r = await pool.query("UPDATE posts SET likes = likes + 1 WHERE id = $1", [id])
  return r.rowCount
}

async function deletePost(id) {
  const r = await pool.query("DELETE FROM posts WHERE id = $1", [id])
  return r.rowCount
}

async function updatePost(id, { titulo, descripcion, img }) {
  const fields = []
  const values = []
  let i = 1
  if (titulo !== undefined) { fields.push(`titulo = $${i++}`); values.push(titulo) }
  if (descripcion !== undefined) { fields.push(`descripcion = $${i++}`); values.push(descripcion) }
  if (img !== undefined) { fields.push(`img = $${i++}`); values.push(img) }
  if (!fields.length) return 0
  values.push(id)
  const r = await pool.query(`UPDATE posts SET ${fields.join(", ")} WHERE id = $${i}`, values)
  return r.rowCount
}

module.exports = { getPosts, createPost, likePost, deletePost, updatePost }