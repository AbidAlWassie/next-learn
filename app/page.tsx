import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Learn Anything, Anytime, Anywhere
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Discover courses created by experts and expand your knowledge
                  with our interactive learning platform.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/courses">
                  <Button size="lg">Browse Courses</Button>
                </Link>
                <Link href="/signin">
                  <Button variant="outline" size="lg">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-chart-1 p-4">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Expert Instructors</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Learn from industry professionals with years of experience.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-chart-1 p-4">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Learn at Your Pace</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Access course content anytime and learn at your own pace.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-chart-1 p-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Community Support</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Engage with other learners and get help when you need it.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-gray-500 md:text-left">
            © 2025 NextLearn. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
