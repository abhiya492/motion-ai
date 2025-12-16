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

export async function resetDailyUsage() {
  const sql = await getDbConnection();
  await sql`UPDATE daily_usage SET usage_count = 0 WHERE usage_date < CURRENT_DATE`;
}

export async function incrementDailyUsage(userId: string) {
  const sql = await getDbConnection();
  await sql`
    INSERT INTO daily_usage (user_id, usage_date, usage_count)
    VALUES (${userId}, CURRENT_DATE, 1)
    ON CONFLICT (user_id, usage_date)
    DO UPDATE SET usage_count = daily_usage.usage_count + 1
  `;
}
