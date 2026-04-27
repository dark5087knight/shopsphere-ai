import { useEffect, useState } from "react";

export function Countdown({ to }: { to: number }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, to - now);
  const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
  const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
  const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
  return (
    <div className="inline-flex items-center gap-1 font-mono text-xs">
      <span className="rounded bg-foreground px-1.5 py-0.5 text-background font-bold">{h}</span>:
      <span className="rounded bg-foreground px-1.5 py-0.5 text-background font-bold">{m}</span>:
      <span className="rounded bg-foreground px-1.5 py-0.5 text-background font-bold">{s}</span>
    </div>
  );
}