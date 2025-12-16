"use client";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface UsageMeterProps {
  currentUsage: number;
  maxUsage: number;
  planType: string;
  isProPlan: boolean;
}

export default function UsageMeter({ currentUsage, maxUsage, planType, isProPlan }: UsageMeterProps) {
  const usagePercentage = isProPlan ? 0 : Math.min((currentUsage / maxUsage) * 100, 100);
  const remaining = isProPlan ? "Unlimited" : Math.max(maxUsage - currentUsage, 0);

  return (
    <div className="bg-white/80 dark:bg-card/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 dark:border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-foreground">Daily Usage</h3>
        <Badge variant={isProPlan ? "default" : usagePercentage > 80 ? "destructive" : "secondary"}>
          {planType}
        </Badge>
      </div>
      
      {!isProPlan && (
        <div className="space-y-3">
          <Progress value={usagePercentage} className="h-3" />
          <div className="flex justify-between text-sm text-gray-600 dark:text-muted-foreground">
            <span>{currentUsage} used</span>
            <span>{remaining} remaining</span>
          </div>
        </div>
      )}
      
      {isProPlan && (
        <div className="text-center py-4">
          <div className="text-2xl font-bold text-green-600">∞</div>
          <p className="text-sm text-gray-600 dark:text-muted-foreground">Unlimited uploads</p>
        </div>
      )}
    </div>
  );
}