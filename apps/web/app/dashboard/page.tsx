"use client";

import Link from "next/link";
import { ArrowRight, LayoutGrid } from "lucide-react";

import { Button } from "~/components/ui/button";
import { useDashboardStats, useRecentForms } from "~/hooks/api/dashboard";
import { useUser } from "~/hooks/api/auth";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatDate(dateString?: string | null) {
  if (!dateString) return "Unknown";
  return new Date(dateString).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DashboardOverview() {
  const { user } = useUser();
  const { stats, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { forms, isLoading: formsLoading, error: formsError } = useRecentForms();

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-white/60">{getGreeting()}, {user?.fullName ?? "there"}</p>
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-white/50">Manage your forms, review responses, and keep building smarter.</p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
              <p className="text-sm text-white/60">Total forms</p>
              <p className="mt-4 text-3xl font-semibold">{statsLoading ? "—" : stats?.totalForms ?? 0}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
              <p className="text-sm text-white/60">Total responses</p>
              <p className="mt-4 text-3xl font-semibold">{statsLoading ? "—" : stats?.totalResponses ?? 0}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
              <p className="text-sm text-white/60">Total fields</p>
              <p className="mt-4 text-3xl font-semibold">{statsLoading ? "—" : stats?.totalFields ?? 0}</p>
            </div>
          </div>
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-white/60">Recent forms</p>
              <h2 className="text-2xl font-semibold tracking-tight">Latest activity</h2>
            </div>
            <Button asChild className="bg-white text-black hover:bg-white/90">
              <Link href="/dashboard/forms">View all forms</Link>
            </Button>
          </div>

          {formsLoading ? (
            <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6 text-sm text-white/60">Loading forms…</div>
          ) : formsError ? (
            <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6 text-sm text-red-400">Unable to load recent forms.</div>
          ) : forms && forms.length > 0 ? (
            <div className="grid gap-4">
              {forms.slice(0, 5).map((form) => (
                <article key={form.id} className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-white/50">
                        <LayoutGrid className="size-4" />
                        <span>{formatDate(form.updatedAt ?? form.createdAt)}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-white">{form.title}</h3>
                      <p className="text-sm text-white/60">{form.description || "No description"}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/60">
                        <span className="rounded-full bg-white/5 px-3 py-1">{form.fieldCount} fields</span>
                        <span className="rounded-full bg-white/5 px-3 py-1">{form.responseCount} responses</span>
                      </div>
                    </div>
                    <div className="grid gap-2 sm:w-[220px]">
                      <Button asChild variant="outline" className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                        <Link href={`/dashboard/forms/${form.id}`}>Build</Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                        <Link href={`/dashboard/forms/${form.id}/submissions`}>Responses</Link>
                      </Button>
                      <Button asChild variant="ghost" className="w-full justify-start rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white hover:bg-white/10">
                        <Link href={`/form/${form.id}`}>Public form</Link>
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6 text-sm text-white/60">
              No recent forms yet. Create a form to see it appear here.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
