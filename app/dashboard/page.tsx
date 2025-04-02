import { auth } from "@/app/(auth)/auth";
import { CourseList } from "@/components/course-list";
import { EnrolledCourseList } from "@/components/enrolled-course-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prisma } from "@/lib/prisma";
import { BookOpen, Layers } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const userId = session.user.id;

  // Fetch user's courses
  const userCourses = await prisma.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 5,
  });

  // Fetch enrolled courses (this would require an enrollment model, which isn't in your schema yet)
  // For now, we'll just show all courses not created by the user
  const enrolledCourses = await prisma.course.findMany({
    where: {
      userId: {
        not: userId,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 5,
  });

  // Count total courses and posts
  const courseCount = await prisma.course.count({
    where: {
      userId,
    },
  });

  const postCount = await prisma.post.count({
    where: {
      course: {
        userId,
      },
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courseCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{postCount}</div>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="my-courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-courses">My Courses</TabsTrigger>
          <TabsTrigger value="enrolled">Enrolled Courses</TabsTrigger>
        </TabsList>
        <TabsContent value="my-courses" className="space-y-4">
          <CourseList courses={userCourses} />
        </TabsContent>
        <TabsContent value="enrolled" className="space-y-4">
          <EnrolledCourseList courses={enrolledCourses} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
