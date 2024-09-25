import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/transactions")({
  component: TransactionsPage
});

function TransactionsPage() {
  return (
    <div className="p-2">
      <h3>Transactions Page</h3>
    </div>
  );
}
