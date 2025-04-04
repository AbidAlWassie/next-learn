import { auth } from "@/app/(auth)/auth";
import { NewLessonForm } from "@/components/new-lesson-form";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

interface NewLessonPageProps {
  params: {
    courseId: string;
  };
}

export default async function NewLessonPage({ params }: NewLessonPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const course = await prisma.course.findUnique({
    where: {
      id: params.courseId,
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
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Create a New Lesson
        </h1>
        <p className="text-muted-foreground">
          Create a new lesson for your course: {course.name}
        </p>
      </div>
      <NewLessonForm courseId={params.courseId} />
    </div>
  );
}
