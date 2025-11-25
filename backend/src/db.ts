import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Needed for Supabase
  },
});

// Testa connection
pool.query("SELECT NOW()")
  .then((res) => {
    console.log("✅ Database connected:", res.rows[0]);
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
  });
