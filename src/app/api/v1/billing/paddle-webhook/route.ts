import { anonymous } from "@/server/api";
import { handlePaddleWebhook } from "@/server/services/billing";

// Paddle calls this. The signature covers the raw body, so read it as text.
export const POST = anonymous(async (request) => handlePaddleWebhook(await request.text(), request.headers.get("paddle-signature")));
