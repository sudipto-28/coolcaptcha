import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import pg from "pg";
import bcrypt from "bcrypt";
import * as schema from "./schema";

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn("DATABASE_URL not set. Database operations will fail.");
}

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle(pool, { schema });

export * from "./schema";

export async function seed() {
  const existingUser = await db
    .select()
    .from(schema.usersTable)
    .where(eq(schema.usersTable.email, "admin@coolcaptcha.com"))
    .limit(1);

  if (existingUser.length === 0) {
    const passwordHash = await bcrypt.hash("11111111", 10);

    const [user] = await db
      .insert(schema.usersTable)
      .values({
        name: "Admin",
        email: "admin@coolcaptcha.com",
        passwordHash,
        role: "ADMIN",
        isActive: true,
      })
      .returning();

    console.log(`Created user: ${user.name}`);
  } else {
    console.log("Admin user already exists");
  }
}

