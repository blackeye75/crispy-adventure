import { open } from "@/server/api";
import { getAllPlans } from "@/server/services/billing";

export const GET = open(() => getAllPlans());
