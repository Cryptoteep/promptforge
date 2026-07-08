"use client";

import * as React from "react";
import Link from "next/link";
import { Flame, Github, Menu, X, BookOpen, FlaskConical, Upload, LayoutGrid, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  external?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Browse", href: "#browse", icon: LayoutGrid },
  { label: "Collections", href: "#collections", icon: Package },
  { label: "Playground", href: "#playground", icon: FlaskConical },
  { label: "Submit", href: "#submit", icon: Upload },
  { label: "Docs", href: "#docs", icon: BookOpen },
  {
    label: "GitHub",
    href: "https://github.com/Cryptoteep/promptforge",
    icon: Github,
    external: true,
  },
];

export function Header() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/80 transition-shadow",
        scrolled ? "shadow-sm" : "shadow-none",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a
          href="#top"
          className="group flex items-center gap-2 font-semibold"
          aria-label="PromptForge home"
        >
          <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            <Flame className="h-4 w-4" aria-hidden />
          </span>
          <span className="text-base tracking-tight">
            Prompt<span className="text-primary">Forge</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 md:flex"
        >
          {NAV_ITEMS.map((item) =>
            item.external ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
              >
                <item.icon className="h-4 w-4" aria-hidden />
                {item.label}
              </a>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
              >
                <item.icon className="h-4 w-4" aria-hidden />
                {item.label}
              </a>
            ),
          )}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Button
            asChild
            size="sm"
            className="hidden sm:inline-flex"
          >
            <a href="#submit">
              <Upload className="mr-1.5 h-4 w-4" aria-hidden />
              Submit a prompt
            </a>
          </Button>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <Flame className="h-3.5 w-3.5" />
                  </span>
                  PromptForge
                </SheetTitle>
              </SheetHeader>
              <nav
                aria-label="Mobile"
                className="mt-4 flex flex-col gap-1 px-2"
              >
                {NAV_ITEMS.map((item) => (
                  <SheetClose asChild key={item.label}>
                    <a
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <item.icon className="h-4 w-4" aria-hidden />
                      {item.label}
                    </a>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-4 px-2">
                <SheetClose asChild>
                  <Button asChild className="w-full">
                    <a href="#submit">
                      <Upload className="mr-1.5 h-4 w-4" />
                      Submit a prompt
                    </a>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
