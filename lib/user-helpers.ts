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

export function getPlanType(priceId: string) {
  if (priceId === null) return { id: "starter", name: "Starter" };

  const checkPlanType = plansMap.filter((plan) => plan.priceId === priceId);
  return checkPlanType?.[0];
}

export async function getUserDailyCredits(
  sql: NeonQueryFunction<false, false>,
  userId: string
) {
  const query = await sql`SELECT daily_credits FROM users WHERE id = ${userId}`;
  const dailyCredits = query[0]?.daily_credits ?? 10;
  return dailyCredits;
}

export async function resetDailyCreditsAtMidnight(
  sql: NeonQueryFunction<false, false>
) {
  const now = new Date();
  const nextMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0
  );
  const timeUntilMidnight = nextMidnight.getTime() - now.getTime();

  setTimeout(async () => {
    await sql`UPDATE users SET daily_credits = 10`;
    resetDailyCreditsAtMidnight(sql);
  }, timeUntilMidnight);
}
