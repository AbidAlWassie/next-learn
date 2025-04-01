"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BookOpen, Layers, Plus, Settings, Users } from "lucide-react"

const items = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: Layers,
  },
  {
    title: "My Courses",
    href: "/dashboard/courses",
    icon: BookOpen,
  },
  {
    title: "Enrolled Courses",
    href: "/dashboard/enrolled",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden w-[220px] flex-col md:flex">
      <div className="flex flex-col gap-2 py-6">
        <Link href="/dashboard/courses/new">
          <Button className="w-full justify-start">
            <Plus className="mr-2 h-4 w-4" />
            New Course
          </Button>
        </Link>
      </div>
      <div className="flex flex-col gap-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        ))}
      </div>
    </nav>
  )
}

