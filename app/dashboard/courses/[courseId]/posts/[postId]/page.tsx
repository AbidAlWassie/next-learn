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

interface PostDetailPageProps {
  params: {
    courseId: string;
    postId: string;
  };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const post = await prisma.post.findUnique({
    where: {
      id: params.postId,
    },
    include: {
      course: true,
    },
  });

  if (!post) {
    notFound();
  }

  // Check if the user is the owner of the course
  if (post.course.userId !== session.user.id) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/courses/${params.courseId}/posts/${params.postId}/edit`}
          >
            <Button variant="outline">Edit Post</Button>
          </Link>
          <Link
            href={`/courses/${post.course.courseName}/${post.slug}`}
            target="_blank"
          >
            <Button>View Post</Button>
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div>
          {post.published ? (
            <Badge>Published</Badge>
          ) : (
            <Badge variant="outline">Draft</Badge>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          Updated{" "}
          {formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })}
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
          <CardDescription>Preview of your post content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none dark:prose-invert">
            <pre className="whitespace-pre-wrap">{post.content}</pre>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
          <CardDescription>Tags associated with this post</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {post.tags.length > 0 ? (
              post.tags.map((tag) => (
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
