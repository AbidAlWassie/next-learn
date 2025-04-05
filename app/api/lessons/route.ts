import { auth } from "@/app/(auth)/auth";
import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, slug, content, published, tags, courseId } = body;

    // Check if the user is the owner of the course
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course || course.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if slug is already taken for this course
    const existingLesson = await prisma.lesson.findUnique({
      where: {
        courseId_slug: {
          courseId,
          slug,
        },
      },
    });

    if (existingLesson) {
      return NextResponse.json(
        { error: "Slug already taken for this course" },
        { status: 400 }
      );
    }

    // Create the lesson
    const lesson = await prisma.lesson.create({
      data: {
        title,
        slug,
        content,
        published,
        tags,
        courseId,
      },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("Error creating lesson:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const courseId = url.searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    // Check if the user is the owner of the course
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course || course.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const lessons = await prisma.lesson.findMany({
      where: {
        courseId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
