"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ElevenLabsPricing() {
  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "/month",
      credits: "10k characters",
      features: ["Basic voices", "No commercial use", "No voice cloning"],
      popular: false
    },
    {
      name: "Starter", 
      price: "₹440",
      period: "/month",
      credits: "30k credits",
      features: ["Commercial license", "Instant Voice Cloning", "All voices"],
      popular: false
    },
    {
      name: "Creator",
      price: "₹968",
      period: "/month", 
      credits: "100k credits",
      features: ["Professional Voice Cloning", "Priority support", "Commercial license"],
      popular: true
    }
  ];

  return (
    <div className="space-y-6 p-6 border rounded-lg bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="text-center">
        <h3 className="text-xl font-bold">🎭 ElevenLabs Voice Cloning</h3>
        <p className="text-muted-foreground mt-2">
          Professional voice cloning requires an ElevenLabs subscription
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div key={plan.name} className={`relative p-4 border rounded-lg bg-white ${plan.popular ? 'ring-2 ring-purple-500' : ''}`}>
            {plan.popular && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-purple-600">
                Most Popular
              </Badge>
            )}
            
            <div className="text-center space-y-3">
              <h4 className="font-semibold">{plan.name}</h4>
              <div>
                <span className="text-2xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <p className="text-sm font-medium text-purple-600">{plan.credits}</p>
              
              <ul className="space-y-1 text-sm">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full" 
                variant={plan.popular ? "default" : "outline"}
                onClick={() => window.open('https://elevenlabs.io/pricing', '_blank')}
              >
                {plan.name === "Free" ? "Current Plan" : "Upgrade"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>Voice cloning features work in demo mode without API key</p>
        <p>Get your API key at <a href="https://elevenlabs.io" className="text-purple-600 hover:underline">elevenlabs.io</a></p>
      </div>
    </div>
  );
}