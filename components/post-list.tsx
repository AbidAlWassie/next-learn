import Link from "next/link"
import type { Post } from "@prisma/client"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PostListProps {
  posts: Post[]
  courseId: string
}

export function PostList({ posts, courseId }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 py-12">
        <div className="text-center">
          <h3 className="text-lg font-medium">No posts yet</h3>
          <p className="text-sm text-muted-foreground">
            You haven&apos;t created any posts for this course yet. Start creating content now.
          </p>
        </div>
        <Link href={`/dashboard/courses/${courseId}/posts/new`}>
          <div className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
            Create Post
          </div>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-4 pt-4 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Link key={post.id} href={`/dashboard/courses/${courseId}/posts/${post.id}`}>
          <Card className="h-full overflow-hidden transition-all hover:border-primary">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="line-clamp-1 text-lg">{post.title}</CardTitle>
                {post.published ? <Badge>Published</Badge> : <Badge variant="outline">Draft</Badge>}
              </div>
              <CardDescription className="line-clamp-2">
                {post.content.substring(0, 100) || "No content"}
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
              Updated {formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })}
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}

