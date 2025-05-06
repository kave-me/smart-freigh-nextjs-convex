"use client";

import { Button } from "@/components/ui/button";
import branding from "@/config/branding";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-10 bg-background p-4 border-b-2 border-slate-200 dark:border-slate-800 flex flex-row justify-between items-center">
      {branding.company.name}
      </header>
      <main className="container mx-auto">
      <section className="grid place-items-center lg:max-w-screen-xl gap-8 mx-auto py-20 md:py-32">
        <div className="text-center space-y-8">
          <div className="max-w-screen-md mx-auto text-center text-4xl md:text-6xl font-bold">
            <h1>
              Streamline your
              <span className="text-transparent px-2 bg-gradient-to-r from-[#D247BF] to-primary bg-clip-text">
                invoice
              </span>
              management
            </h1>
          </div>

          <p className="max-w-screen-sm mx-auto text-xl text-muted-foreground">
            Efficiently manage your invoices, track payments, and handle escalations with our
            intelligent invoice management system.
          </p>

          <div className="space-y-4 md:space-y-0 md:space-x-4">
            <Button asChild className="w-5/6 md:w-1/4 font-bold group/arrow">
              <Link href="/dashboard">
                Dashboard
                <ArrowRight className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button
              variant="secondary"
              className="w-5/6 md:w-1/4 font-bold"
              asChild
            >
              <Link href="#features">
                Learn More
              </Link>
            </Button>
          </div>
        </div>

       
      </section>
    </main>

    </>
  );
}
