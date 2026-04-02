"use client";

// LinkButton — wraps shadcn Button with Next.js Link using base-ui's render prop.
// Usage: <LinkButton href="/foo" variant="outline" size="lg">テキスト</LinkButton>

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";

type LinkButtonProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
} & VariantProps<typeof buttonVariants> &
  Omit<ComponentPropsWithoutRef<"a">, "href" | "className" | "children">;

export function LinkButton({
  href,
  variant = "default",
  size = "default",
  className,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </Link>
  );
}
