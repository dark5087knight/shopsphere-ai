import { createFileRoute } from "@tanstack/react-router";
import { CreditCard } from "lucide-react";

export const Route = createFileRoute("/account/payment")({
  component: () => (
    <div className="rounded-2xl border border-border p-10 text-center text-muted-foreground">
      <CreditCard className="h-8 w-8 mx-auto mb-2" />
      No saved payment methods yet.
    </div>
  ),
});