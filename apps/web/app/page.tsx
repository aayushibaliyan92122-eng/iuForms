"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export default function Home() {
  const router = useRouter();

  const [showFormInput, setShowFormInput] = useState(false);
  const [formId, setFormId] = useState("");

  const openForm = () => {
    const id = formId.trim();

    if (!id) return;

    router.push(`/form/${id}`);
  };

  return (
    <main className="min-h-screen bg-black text-white">

      {/* Navbar */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight"
        >
          IuForms
        </Link>

        <Link
          href="/signin"
          className="text-sm text-white/60 transition hover:text-white"
        >
          Sign in
        </Link>
      </nav>

      {/* Hero */}
      <section className="mx-auto flex min-h-[80vh] max-w-4xl flex-col items-center justify-center px-6 text-center">

        <p className="mb-5 text-sm text-white/40">
          Simple forms. Better responses.
        </p>

        <h1 className="max-w-3xl text-5xl font-medium tracking-tight sm:text-6xl md:text-7xl">
          Forms should feel
          <span className="text-white/40"> effortless.</span>
        </h1>

        <p className="mt-7 max-w-xl text-base leading-7 text-white/50 sm:text-lg">
          Create beautiful forms, share them with anyone,
          and collect responses without unnecessary complexity.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">

          <Button
            asChild
            size="lg"
            className="bg-white text-black hover:bg-white/90"
          >
            <Link href="/dashboard">
              Create your own form
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => setShowFormInput((value) => !value)}
            className="border-white/15 bg-transparent text-white hover:bg-white/10"
          >
            Fill a form
          </Button>

        </div>

        {/* Form ID input */}

        {showFormInput && (
          <div className="mt-8 w-full max-w-md border-t border-white/10 pt-8">

            <p className="mb-4 text-sm text-white/50">
              Enter the form ID shared with you.
            </p>

            <div className="flex gap-2">

              <Input
                value={formId}
                onChange={(event) => setFormId(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    openForm();
                  }
                }}
                placeholder="Form ID"
                className="border-white/10 bg-white/5 text-white placeholder:text-white/25"
              />

              <Button
                onClick={openForm}
                disabled={!formId.trim()}
                className="bg-white text-black hover:bg-white/90"
              >
                Open
                <ArrowRight className="ml-2 size-4" />
              </Button>

            </div>

          </div>
        )}

      </section>

      <footer className="pb-8 text-center text-xs text-white/25">
        Built with IuForms
      </footer>

    </main>
  );
}