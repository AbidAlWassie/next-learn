import { redirect } from "next/navigation"
import { auth } from "@/app/(auth)/auth"
import { NewCourseForm } from "@/components/new-course-form"

export default async function NewCoursePage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/signin")
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create a New Course</h1>
        <p className="text-muted-foreground">Fill in the details below to create your new course.</p>
      </div>
      <NewCourseForm userId={session.user.id} />
    </div>
  )
}

