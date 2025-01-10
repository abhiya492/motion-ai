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
    
    return sql;
  } catch (error) {
    if (error instanceof DatabaseConnectionError) {
      console.error(error.message);
      throw error;
    }
    
    console.error(`Failed to connect to database: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw new DatabaseConnectionError(
      `Failed to connect to database: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
