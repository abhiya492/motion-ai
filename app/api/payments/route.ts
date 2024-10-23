import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  // Webhook functionality
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = await stripe.checkout.sessions.retrieve(
          event.data.object.id,
          {
            expand: ["line_items"],
          }
        );
        console.log({ session });
        // Connect to the database to create or update user
        // (You may want to add your own logic here if needed)
        break;
      };
      case "customer.subscription.deleted": {
        const subscription = await stripe.subscriptions.retrieve(event.data.object.id);

        console.log({ subscription });
        // Connect to the database to delete user subscription
        // (You may want to add your own logic here if needed)
        break;
      };


      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    return NextResponse.json({
      status: "success",
    });
  } catch (err) {
    return NextResponse.json({ status: "Failed", err });
  }
  return NextResponse.json({ status: "success" });
}