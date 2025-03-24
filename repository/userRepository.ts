import { db } from "@/lib/db";

export const findUserByEmail = async (email: string) => {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
};

export const findUserById = async (id: string) => {
  const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export const createUser = async (id: string, hashedPassword: string, role: string) => {
  await db.query(
    'INSERT INTO users (id, password, role) VALUES ($1, $2, $3)',
    [id, hashedPassword, role]
  );
};

export const updatePassword = async (id: string, hashedPassword: string) => {
  await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, id]);
};
