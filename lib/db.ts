import { neon } from "@neondatabase/serverless";

// Connection pool
let cachedConnection: any = null;

export default async function getDbConnection() {
  if (!process.env.DATABASE_URL) {
    throw new Error("Neon Database URL is not defined");
  }
  
  // Reuse connection if available
  if (cachedConnection) {
    return cachedConnection;
  }
  
  cachedConnection = neon(process.env.DATABASE_URL);
  return cachedConnection;
}

export const query = getDbConnection;


