"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser, useSignOut } from "~/hooks/api/auth";
import { Button } from "~/components/ui/button";

const navItems = [
  { label: "Overview", href: "/dashboard" },
  { label: "Forms", href: "/dashboard/forms" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const { signOutAsync, isPending } = useSignOut();

  const handleSignOut = async () => {
    try {
      await signOutAsync();
    } catch (err) {
      // ignore errors during sign-out (allow client to navigate away)
    } finally {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="grid min-h-screen grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-white/10 bg-zinc-950 px-4 py-6">
          <div className="mb-10 flex flex-col gap-2">
            <Link href="/dashboard" className="text-lg font-semibold tracking-tight">
              IuForms
            </Link>
            <p className="text-sm text-white/60">Your forms, responses, and profile.</p>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-12 border-t border-white/10 pt-6">
            <div className="space-y-1 text-sm text-white/60">
              <div className="font-medium text-white">{user?.fullName ?? "Owner"}</div>
              <div>{user?.email ?? "No email"}</div>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <Link href="/dashboard/profile" className="rounded-xl bg-white/5 px-4 py-3 text-left text-sm text-white hover:bg-white/10">
                Profile
              </Link>
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="w-full border-white/10 text-white"
                disabled={isPending}
              >
                {isPending ? "Signing out..." : "Sign out"}
              </Button>
            </div>
          </div>
        </aside>

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
