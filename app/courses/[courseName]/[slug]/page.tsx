import { auth } from "@/app/(auth)/auth";
import { CommentSection } from "@/components/comment-section";
import { NavBar } from "@/components/nav-bar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// Update the interface to match Next.js 15 expectations
interface PageProps {
  params: {
    courseName: string;
    slug: string;
  };
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function PostPage({ params }: PageProps) {
  const session = await auth();

  const post = await prisma.post.findFirst({
    where: {
      slug: params.slug,
      published: true,
      course: {
        courseName: params.courseName,
      },
    },
    include: {
      course: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1">
        <div className="container py-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 space-y-4">
              <Link
                href={`/courses/${params.courseName}`}
                className="text-sm text-muted-foreground hover:underline"
              >
                ← Back to {post.course.name}
              </Link>
              <h1 className="text-4xl font-bold tracking-tight">
                {post.title}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    {post.course.user.image ? (
                      <Image
                        src={post.course.user.image || "/placeholder.svg"}
                        alt={post.course.user.name || "Instructor"}
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        {post.course.user.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">Instructor</p>
                    <p className="text-sm text-muted-foreground">
                      {post.course.user.name}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Updated{" "}
                  {formatDistanceToNow(new Date(post.updatedAt), {
                    addSuffix: true,
                  })}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="prose max-w-none dark:prose-invert">
                  <pre className="whitespace-pre-wrap">{post.content}</pre>
                </div>
              </CardContent>
            </Card>
            {session?.user && (
              <div className="mt-8">
                <CommentSection
                  postId={post.id}
                  userId={session.user.id as string}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
