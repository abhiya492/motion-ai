export const plansMap = [
    {
      id: "basic",
      name: "Basic",
      description: "Get started with MotionAI!",
      price: "1",
      items: ["3 Blog Posts", "3 Transcription"],
      priceId:
        process.env.NODE_ENV === "development"
          ? "price_1PtLVqBPnsISnc82CW4au1uq"
          : "",
    },
    {
      id: "pro",
      name: "Pro",
      description: "All Blog Posts, let’s go!",
      price: "1.99",
      items: ["Unlimited Blog Posts", "Unlimited Transcriptions"],
      paymentLink: "https://buy.stripe.com/test_7sIcOkgE0cuFbAs001",
      priceId:
        process.env.NODE_ENV === "development"
          ? "price_1PtLVqBPnsISnc82bspCVu5e"
          : "",
    },
  ];
  
  export const ORIGIN_URL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://motion-ai-demo.vercel.app";
