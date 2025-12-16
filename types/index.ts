export interface Post {
  id: number;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
}

export interface User {
  id: number;
  email: string;
  full_name?: string;
  customer_id?: string;
  price_id?: string;
  status: string;
  user_id?: string;
  created_at: string;
}

export interface DailyUsage {
  user_id: string;
  usage_date: string;
  usage_count: number;
}

export interface PlanType {
  id: string;
  name: string;
  description?: string;
  price?: string;
  items?: string[];
  priceId?: string;
  paymentLink?: string;
}