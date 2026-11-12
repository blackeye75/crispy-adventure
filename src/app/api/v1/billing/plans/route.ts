import { open } from "@/server/api";
import { getPlans } from "@/server/services/razorpay";

export const GET = open(() => getPlans());
