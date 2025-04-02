import { auth } from "@/app/(auth)/auth";
import { PostList } from "@/components/post-list";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

interface CourseDetailPageProps {
  params: {
    courseId: string;
  };
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const course = await prisma.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      posts: {
        orderBy: {
          updatedAt: "desc",
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  // Check if the user is the owner of the course
  if (course.userId !== session.user.id) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{course.name}</h1>
        <Link href={`/dashboard/courses/${course.id}/posts/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
            <CardDescription>Manage your course information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Description</h3>
                <p className="text-sm text-muted-foreground">
                  {course.description || "No description"}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Subdomain</h3>
                <p className="text-sm text-muted-foreground">
                  {course.subdomain}.yourdomain.com
                </p>
              </div>
              {course.customDomain && (
                <div>
                  <h3 className="font-medium">Custom Domain</h3>
                  <p className="text-sm text-muted-foreground">
                    {course.customDomain}
                  </p>
                </div>
              )}
              <div className="pt-4">
                <Link href={`/dashboard/courses/${course.id}/edit`}>
                  <Button variant="outline">Edit Course</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Course Stats</CardTitle>
            <CardDescription>View your course statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Total Posts</h3>
                <p className="text-2xl font-bold">{course.posts.length}</p>
              </div>
              <div>
                <h3 className="font-medium">Published Posts</h3>
                <p className="text-2xl font-bold">
                  {course.posts.filter((post) => post.published).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <h2 className="text-xl font-bold tracking-tight">Posts</h2>
        <PostList posts={course.posts} courseId={course.id} />
      </div>
    </div>
  );
}
