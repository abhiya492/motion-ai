import { NeonQueryFunction } from "@neondatabase/serverless";
import { plansMap } from "./constants";

export async function hasCancelledSubscription(
  sql: NeonQueryFunction<false, false>,
  email: string
) {
  const query =
    await sql`SELECT * FROM users where email = ${email} AND status = 'cancelled'`;

  return query && query.length > 0;
}

export async function doesUserExist(
  sql: NeonQueryFunction<false, false>,
  email: string
) {
  const query = await sql`SELECT * FROM users where email = ${email}`;
  if (query && query.length > 0) {
    return query;
  }
  return null;
}

export async function updateUser(
  sql: NeonQueryFunction<false, false>,
  userId: string,
  email: string
) {
  return sql`UPDATE users SET user_id = ${userId} WHERE email = ${email}`;
}

export function getPlanType(priceId: string | null) {
  if (!priceId) return { id: "starter", name: "Starter" };

  const checkPlanType = plansMap.find((plan) => plan.priceId === priceId);
  return checkPlanType || { id: "starter", name: "Starter" };
}

export async function getDailyUsage(
  sql: NeonQueryFunction<false, false>,
  userId: string
) {
  const query = await sql`
    SELECT usage_count FROM daily_usage 
    WHERE user_id = ${userId} AND usage_date = CURRENT_DATE
  `;
  return query.length > 0 ? query[0].usage_count : 0;
}

export async function resetDailyUsage(sql: NeonQueryFunction<false, false>) {
  await sql`UPDATE daily_usage SET usage_count = 0 WHERE usage_date < CURRENT_DATE`;
}
