"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/segmented";
import { track } from "@/lib/analytics";
import { api, hardNavigate } from "@/lib/api";
import { formatPrice } from "@/lib/site";
import type { Me } from "@/server/services/profile";
import type { PlanPrice, Provider } from "@/server/services/razorpay";

type Subscription = Me["subscription"];
type Checkout =
  | { provider: "razorpay"; keyId: string; subscriptionId: string; prefill: { name: string; email: string } }
  | { provider: "paddle"; clientToken: string; environment: "sandbox" | "production"; priceId: string; customer: { email: string }; customData: Record<string, string> };
type PaddleEvent = { name?: string };
type PaddleJs = {
  Environment: { set: (environment: "sandbox" | "production") => void };
  Initialize: (options: { token: string; eventCallback: (event: PaddleEvent) => void }) => void;
  Update: (options: { eventCallback: (event: PaddleEvent) => void }) => void;
  Initialized: boolean;
  Checkout: { open: (options: { items: { priceId: string; quantity: number }[]; customer: { email: string }; customData: Record<string, string> }) => void };
};
type RazorpayOptions = {
  key: string;
  subscription_id: string;
  name: string;
  description: string;
  prefill: { name: string; email: string };
  handler: () => void;
  modal: { ondismiss: () => void };
};
declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
    Paddle?: PaddleJs;
  }
}

const PLAN_NAMES = { monthly: "Monthly", yearly: "Yearly" };
const price = (p: PlanPrice) => formatPrice(p.amount, p.currency);
const date = (value: Date | string | null) => (value ? new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(new Date(value)) : "");

const SCRIPTS: Record<Provider, string> = { razorpay: "https://checkout.razorpay.com/v1/checkout.js", paddle: "https://cdn.paddle.com/paddle/v2/paddle.js" };
const REGIONS = [["paddle", "Outside India · $"], ["razorpay", "India · ₹"]] as const;

/** The provider's checkout script, loaded only when someone actually pays. */
function loadCheckout(provider: Provider): Promise<void> {
  if (provider === "razorpay" ? window.Razorpay : window.Paddle) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPTS[provider];
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load the payment window. Check your connection and try again."));
    document.head.append(script);
  });
}

/** The paywall: plans with live prices for the learner's region, checkout, then wait for the provider to confirm. */
export function Paywall({ plans, next, region }: { plans: PlanPrice[]; next: string; region: Provider }) {
  const [state, setState] = useState<"idle" | "starting" | "confirming" | "slow">("idle");
  const [error, setError] = useState<string>();
  const offered = REGIONS.filter(([provider]) => plans.some((p) => p.provider === provider));
  const [provider, setProvider] = useState<Provider>(offered.some(([p]) => p === region) ? region : (offered[0]?.[0] ?? "razorpay"));
  const shown = plans.filter((p) => p.provider === provider);

  // The browser's "payment succeeded" is not proof. Access begins when the provider's webhook reaches
  // the server, usually within seconds, so keep asking the server until it says so.
  const confirm = async () => {
    setState("confirming");
    for (let i = 0; i < 30; i++) {
      const me = await api<Me>("/me").catch(() => null);
      if (me?.subscription.entitled) return hardNavigate(next);
      await new Promise((r) => setTimeout(r, 2000));
    }
    setState("slow");
  };

  const start = async (plan: PlanPrice["plan"]) => {
    setState("starting");
    setError(undefined);
    try {
      const checkout = await api<Checkout>("/billing/subscribe", { method: "POST", body: { plan, provider } });
      await loadCheckout(checkout.provider);
      track("Checkout started", { plan, provider: checkout.provider });
      if (checkout.provider === "paddle") {
        const paddle = window.Paddle!;
        const eventCallback = (event: PaddleEvent) => {
          if (event.name === "checkout.completed") void confirm();
          if (event.name === "checkout.closed") setState((s) => (s === "starting" ? "idle" : s));
        };
        if (paddle.Initialized) paddle.Update({ eventCallback });
        else {
          if (checkout.environment === "sandbox") paddle.Environment.set("sandbox");
          paddle.Initialize({ token: checkout.clientToken, eventCallback });
        }
        paddle.Checkout.open({ items: [{ priceId: checkout.priceId, quantity: 1 }], customer: checkout.customer, customData: checkout.customData });
        return;
      }
      new window.Razorpay!({
        key: checkout.keyId,
        subscription_id: checkout.subscriptionId,
        name: "Fretkey",
        description: `${PLAN_NAMES[plan]} subscription`,
        prefill: checkout.prefill,
        handler: () => void confirm(),
        modal: { ondismiss: () => setState((s) => (s === "starting" ? "idle" : s)) },
      }).open();
    } catch (err) {
      setError((err as Error).message);
      setState("idle");
    }
  };

  if (state === "confirming" || state === "slow") {
    return (
      <div className="step-in flex flex-col gap-4" role="status">
        <h1 className="text-4xl">{state === "confirming" ? "Confirming your payment…" : "Still waiting for confirmation"}</h1>
        <p className="text-lg text-muted-foreground">
          {state === "confirming"
            ? "This usually takes a few seconds. Keep this page open."
            : "Your bank is taking longer than usual. If the payment went through, your lessons unlock on their own; you do not need to pay again."}
        </p>
        {state === "slow" && <div><Button size="lg" onClick={() => void confirm()}>Check again</Button></div>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium tracking-widest text-primary uppercase">Fretkey subscription</p>
        <h1 className="text-4xl">Keep going past the basics.</h1>
        <p className="text-lg text-muted-foreground">Every level as it is released, and daily review that brings ideas back just before you forget them. Cancel any time.</p>
      </div>
      {offered.length > 1 && <Segmented label="Where you are paying from" value={provider} options={offered} onChange={setProvider} />}
      {shown.length === 0 ? (
        <p role="alert" className="text-lg">Plans cannot be shown right now. Nothing is wrong with your account; try again in a little while.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {shown.map((p) => (
            <section key={p.plan} aria-label={`${PLAN_NAMES[p.plan]} plan`} className="flex flex-col gap-4 rounded-2xl border bg-card p-6">
              <h2 className="font-sans text-lg font-medium tracking-normal">{PLAN_NAMES[p.plan]}</h2>
              <p><span className="text-4xl font-semibold">{price(p)}</span> <span className="text-muted-foreground">per {p.plan === "monthly" ? "month" : "year"}</span></p>
              <Button size="lg" disabled={state !== "idle"} onClick={() => void start(p.plan)}>Subscribe {p.plan === "monthly" ? "monthly" : "yearly"}</Button>
            </section>
          ))}
        </div>
      )}
      <p className="text-sm text-muted-foreground">
        {provider === "paddle"
          ? "Payment is handled by Paddle, our reseller outside India: cards, PayPal and more, with any local tax included. Fretkey never sees or stores your card details."
          : "Payment is handled by Razorpay (UPI Autopay or card). Fretkey never sees or stores your card or UPI details."}
      </p>
      {error && <p role="alert" className="text-destructive">{error}</p>}
    </div>
  );
}

const STATUS_TEXT: Record<Subscription["status"], string> = {
  none: "No subscription",
  trialing: "Trial",
  active: "Active",
  past_due: "Payment failed",
  cancelled: "Cancelled",
  expired: "Ended",
};

/** Plan, status and the cancel flow. */
export function BillingSettings({ initial }: { initial: Subscription }) {
  const [sub, setSub] = useState(initial);
  const [asking, setAsking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const ending = sub.cancelAtPeriodEnd || sub.status === "cancelled";

  const cancel = async () => {
    setBusy(true);
    setError(undefined);
    try {
      setSub(await api<Subscription>("/billing/cancel", { method: "POST" }));
      setAsking(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section aria-label="Subscription" className="flex flex-col gap-4 rounded-2xl border bg-card p-6">
      <h2 className="text-2xl">Subscription</h2>
      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
        <dt className="text-muted-foreground">Plan</dt><dd>{sub.plan ? PLAN_NAMES[sub.plan] : "Free"}</dd>
        <dt className="text-muted-foreground">Status</dt><dd>{STATUS_TEXT[sub.status]}</dd>
        {sub.currentPeriodEnd && sub.entitled && (
          <><dt className="text-muted-foreground">{ending ? "Access until" : sub.status === "past_due" ? "Access until" : "Renews on"}</dt><dd>{date(sub.currentPeriodEnd)}</dd></>
        )}
      </dl>
      {sub.status === "past_due" && <p className="text-destructive">Your last payment did not go through. It will be retried; check your card, UPI mandate or PayPal.</p>}
      {ending && sub.entitled && <p className="text-muted-foreground">Your plan will not renew. Everything stays unlocked until {date(sub.currentPeriodEnd)}.</p>}
      {error && <p role="alert" className="text-destructive">{error}</p>}
      {!sub.entitled ? (
        <div><Button asChild><a href="/subscribe?next=/settings">See plans</a></Button></div>
      ) : ending ? null : asking ? (
        <div className="flex flex-col gap-3">
          <p>Cancel your subscription? You keep access until {date(sub.currentPeriodEnd)}, and you will not be charged again.</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="destructive" disabled={busy} onClick={() => void cancel()}>Yes, cancel</Button>
            <Button variant="ghost" disabled={busy} onClick={() => setAsking(false)}>Keep my plan</Button>
          </div>
        </div>
      ) : (
        <div><Button variant="outline" onClick={() => setAsking(true)}>Cancel subscription</Button></div>
      )}
    </section>
  );
}
