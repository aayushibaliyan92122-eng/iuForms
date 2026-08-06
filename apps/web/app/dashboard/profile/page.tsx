"use client";

import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";

import { useUser } from "~/hooks/api/auth";
import { Button } from "~/components/ui/button";

function formatDate(dateString?: string | null) {
  if (!dateString) return "Unknown";
  return new Date(dateString).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DashboardProfile() {
  const { user, isLoading, error } = useUser();

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="space-y-2">
            <p className="text-sm text-white/60">Account</p>
            <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
            <p className="text-sm text-white/50">Manage your account details and sign out from here.</p>
          </div>
          <Button asChild variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 size-4" />
              Overview
            </Link>
          </Button>
        </div>

        <section className="rounded-3xl border border-white/10 bg-zinc-950 p-8">
          {isLoading ? (
            <div className="text-sm text-white/60">Loading profile…</div>
          ) : error ? (
            <div className="text-sm text-red-400">Unable to load profile.</div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-[280px_minmax(0,1fr)]">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center gap-4">
                  <div className="grid h-14 w-14 place-items-center rounded-3xl bg-white/10 text-white">
                    <User className="size-6" />
                  </div>
                  <div>
                    <p className="text-sm text-white/50">Signed in as</p>
                    <p className="text-lg font-semibold text-white">{user?.fullName ?? "Owner"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl border border-white/10 bg-black/60 p-6">
                  <p className="text-sm text-white/60">Email</p>
                  <p className="mt-2 text-base text-white">{user?.email ?? "No email available"}</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-black/60 p-6">
                  <p className="text-sm text-white/60">Member since</p>
                  <p className="mt-2 text-base text-white">{formatDate(user?.createdAt)}</p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
