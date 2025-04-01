import Link from "next/link"
import type { Course } from "@prisma/client"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface EnrolledCourseListProps {
  courses: Course[]
}

export function EnrolledCourseList({ courses }: EnrolledCourseListProps) {
  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 py-12">
        <div className="text-center">
          <h3 className="text-lg font-medium">No enrolled courses</h3>
          <p className="text-sm text-muted-foreground">
            You haven&apos;t enrolled in any courses yet. Browse available courses.
          </p>
        </div>
        <Link href="/courses">
          <div className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
            Browse Courses
          </div>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <Link key={course.id} href={`/courses/${course.subdomain}`}>
          <Card className="h-full overflow-hidden transition-all hover:border-primary">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="line-clamp-1 text-lg">{course.name}</CardTitle>
              </div>
              <CardDescription className="line-clamp-2">{course.description || "No description"}</CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <Badge variant="outline">{course.subdomain}</Badge>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              Updated {formatDistanceToNow(new Date(course.updatedAt), { addSuffix: true })}
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}

