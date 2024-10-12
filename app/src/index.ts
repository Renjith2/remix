

// src/index.ts or wherever your createUser function is defined
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import { usersTable } from './db/schema'; // Ensure this path is correct
import { User } from '../model/user' // Ensure this path is correct


const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:forcabarca@localhost:5432/remixnew'
});

const db = drizzle(pool);
console.log("HI")



export async function createUser(name: string, email: string, password: string): Promise<User> {
  console.log("HI");

  try {
    // Check if the email already exists using raw SQL
    const existingUserResult = await pool.query('SELECT * FROM userdetails WHERE email = $1', [email]);
    
    // Check if any user was returned
    if (existingUserResult.rows.length > 0) {
      throw new Error("Email is already in use.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("HI");

    const result = await db.insert(usersTable).values({
      name,
      email,
      password: hashedPassword,
    }).returning();

    console.log('Database insertion result:', result); // Log the result for debugging

    const newUser: User = {
      email: result[0].email,
      name: result[0].name,
      password: hashedPassword,
    };

    console.log('New user created!', newUser);
    return newUser;
  } catch (error) {
    console.error('Error inserting user into the database:', error);
    throw new Error("User registration failed.");
  }
}



