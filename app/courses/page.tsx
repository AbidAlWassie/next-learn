import { NavBar } from "@/components/nav-bar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    include: {
      user: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          posts: {
            where: {
              published: true,
            },
          },
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-8 space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Browse Courses
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover courses created by experts and expand your knowledge
            </p>
          </div>

          {courses.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Link key={course.id} href={`/courses/${course.subdomain}`}>
                  <Card className="h-full overflow-hidden transition-all hover:border-primary">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="line-clamp-1 text-lg">
                          {course.name}
                        </CardTitle>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {course.description || "No description"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">
                          {course._count.posts} lessons
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          By {course.user.name || "Anonymous"}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="text-xs text-muted-foreground">
                      Updated{" "}
                      {formatDistanceToNow(new Date(course.updatedAt), {
                        addSuffix: true,
                      })}
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-3 py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium">No courses available</h3>
                <p className="text-sm text-muted-foreground">
                  There are no courses available at the moment. Check back
                  later.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
