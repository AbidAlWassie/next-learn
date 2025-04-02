import { auth, signOut } from "@/app/(auth)/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export async function NavBar() {
  const session = await auth();

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-bold">
            NextLearn
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/courses"
              className="text-sm font-medium hover:underline"
            >
              Courses
            </Link>
            {session?.user && (
              <Link
                href="/dashboard"
                className="text-sm font-medium hover:underline"
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {session?.user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <Button type="submit" variant="ghost" size="sm">
                  Sign Out
                </Button>
              </form>
            </div>
          ) : (
            <Link href="/signin">
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
