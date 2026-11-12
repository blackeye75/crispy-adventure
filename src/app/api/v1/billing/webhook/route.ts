import { anonymous } from "@/server/api";
import { handleWebhook } from "@/server/services/billing";

// Razorpay calls this. The signature is checked against the raw body, so read it as text.
export const POST = anonymous(async (request) =>
  handleWebhook(await request.text(), request.headers.get("x-razorpay-signature"), request.headers.get("x-razorpay-event-id")));
