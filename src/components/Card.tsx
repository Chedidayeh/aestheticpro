/** @format */

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type CardProps = {
  label: string;
  icon: LucideIcon;
  amount: string;
};

export default function Card(props: CardProps) {
  return (
    <CardContent className="bg-white">
      <section className="flex justify-between gap-6">
        {/* label */}
        <p className="text-sm   text-blue-600 font-semibold">{props.label}</p>
        {/* icon */}
        <props.icon className="h-4 w-4 text-blue-600 " />
      </section>
      <section className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold">{props.amount}</h2>
      </section>
    </CardContent>
  );
}

export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "flex w-full flex-col gap-3 rounded-xl border p-5 ring-inset lg:rounded-2xl shadow-lg",
        props.className
      )}
    />
  );
}
