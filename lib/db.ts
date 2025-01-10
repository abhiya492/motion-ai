import { neon, neonConfig } from "@neondatabase/serverless";

export class DatabaseConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseConnectionError';
  }
}

export default async function getDbConnection() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new DatabaseConnectionError(
        "Database URL is not defined in environment variables. " +
        "Please check your .env file and ensure DATABASE_URL is properly set."
      );
    }

    // Optional: Configure connection timeouts
    neonConfig.fetchConnectionCache = true;
    // neonConfig.connectionTimeoutMillis is not a valid property, so it has been removed

    const sql = neon(process.env.DATABASE_URL);
    
    // Test the connection
    await sql`SELECT 1`;
    
    // Add the daily_credits column to the users table if it doesn't exist
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='daily_credits') THEN
          ALTER TABLE users ADD COLUMN daily_credits INTEGER DEFAULT 10;
        END IF;
      END
      $$;
    `;
    
    return sql;
  } catch (error) {
    if (error instanceof DatabaseConnectionError) {
      throw error;
    }
    
    throw new DatabaseConnectionError(
      `Failed to connect to database: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function resetDailyCredits(sql) {
  try {
    await sql`UPDATE users SET daily_credits = 10`;
  } catch (error) {
    console.error("Error resetting daily credits", error);
    throw error;
  }
}
