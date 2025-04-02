// app/courses/[courseName]/page.tsx
import { auth } from "@/app/(auth)/auth";
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
import { notFound } from "next/navigation";

interface CoursePageProps {
  params: {
    courseName: string;
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const session = await auth();

  const course = await prisma.course.findUnique({
    where: {
      courseName: params.courseName,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      posts: {
        where: {
          published: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-8 space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">{course.name}</h1>
            <p className="text-xl text-muted-foreground">
              {course.description}
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  {course.user.image ? (
                    <img
                      src={course.user.image || "/placeholder.svg"}
                      alt={course.user.name || "Instructor"}
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      {course.user.name?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">Instructor</p>
                  <p className="text-sm text-muted-foreground">
                    {course.user.name}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Posts</p>
                <p className="text-sm text-muted-foreground">
                  {course.posts.length} lessons
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <h2 className="text-2xl font-bold tracking-tight">
              Course Content
            </h2>
            {course.posts.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {course.posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/courses/${course.courseName}/${post.slug}`}
                  >
                    <Card className="h-full overflow-hidden transition-all hover:border-primary">
                      <CardHeader className="pb-3">
                        <CardTitle className="line-clamp-1 text-lg">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {post.content.substring(0, 100)}...
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="text-xs text-muted-foreground">
                        Updated{" "}
                        {formatDistanceToNow(new Date(post.updatedAt), {
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
                  <h3 className="text-lg font-medium">No content yet</h3>
                  <p className="text-sm text-muted-foreground">
                    The instructor hasn&apos;t published any content for this
                    course yet.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
