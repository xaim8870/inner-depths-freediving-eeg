"use client";

import { useSyncExternalStore } from "react";

// Greeting and date use the visitor's clock, which the server doesn't know: the server
// snapshot is null (neutral text), the client snapshot is the time the page was opened.
let openedAt: Date | null = null;
const subscribe = () => () => {};
const clientNow = () => (openedAt ??= new Date());
const serverNow = () => null;

export default function Greeting({ name }: { name: string }) {
  const now = useSyncExternalStore(subscribe, clientNow, serverNow);
  const hour = now?.getHours();
  const hello = hour === undefined ? "Welcome back" : hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const date = now ? now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }).replace(",", "").toUpperCase() : "TODAY";
  return (
    <div>
      <span className="ui-eyebrow">{date} · DAILY CHECK-IN</span>
      <h1 className="ui-title">{hello}, <em>{name}.</em></h1>
    </div>
  );
}
