import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// Set default schema for all connections in the pool
pool.on('connect', (client) => {
  client.query("SET search_path TO marketplace")
})

export default pool