import { auth } from "@/app/(auth)/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

interface LessonDetailPageProps {
  params: {
    courseId: string;
    lessonId: string;
  };
}

export default async function LessonDetailPage({
  params,
}: LessonDetailPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const lesson = await prisma.lesson.findUnique({
    where: {
      id: params.lessonId,
    },
    include: {
      course: true,
    },
  });

  if (!lesson) {
    notFound();
  }

  // Check if the user is the owner of the course
  if (lesson.course.userId !== session.user.id) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{lesson.title}</h1>
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/courses/${params.courseId}/lessons/${params.lessonId}/edit`}
          >
            <Button variant="outline">Edit Lesson</Button>
          </Link>
          <Link
            href={`/courses/${lesson.course.courseName}/${lesson.slug}`}
            target="_blank"
          >
            <Button>View Lesson</Button>
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div>
          {lesson.published ? (
            <Badge>Published</Badge>
          ) : (
            <Badge variant="outline">Draft</Badge>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          Updated{" "}
          {formatDistanceToNow(new Date(lesson.updatedAt), { addSuffix: true })}
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
          <CardDescription>Preview of your lesson content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none dark:prose-invert">
            <pre className="whitespace-pre-wrap">{lesson.content}</pre>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
          <CardDescription>Tags associated with this lesson</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {lesson.tags.length > 0 ? (
              lesson.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No tags</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
