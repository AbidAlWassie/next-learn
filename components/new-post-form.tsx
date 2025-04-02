"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Define the schema with explicit types
const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  slug: z
    .string()
    .min(3, {
      message: "Slug must be at least 3 characters.",
    })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug can only contain lowercase letters, numbers, and hyphens.",
    }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  published: z.boolean(),
  tags: z.string().optional(),
});

// Define the type for our form values
type FormValues = z.infer<typeof formSchema>;

interface NewPostFormProps {
  courseId: string;
}

export function NewPostForm({ courseId }: NewPostFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Use the FormValues type for the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      published: false,
      tags: "",
    },
  });

  // Use the FormValues type for the onSubmit function
  async function onSubmit(values: FormValues) {
    setIsLoading(true);

    try {
      // Convert tags string to array
      const tagsArray = values.tags
        ? values.tags.split(",").map((tag) => tag.trim())
        : [];

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          tags: tagsArray,
          courseId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const post = await response.json();
      toast.success("Post created", {
        description: "Your post has been created successfully.",
      });
      router.push(`/dashboard/courses/${courseId}/posts/${post.id}`);
      router.refresh();
    } catch (error) {
      toast.error("Error", {
        description: "Failed to create post. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Introduction to HTML" {...field} />
                  </FormControl>
                  <FormDescription>The title of your post.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="introduction-to-html" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be used in the URL of your post.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your post content here..."
                      className="min-h-[300px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The content of your post. You can use Markdown for
                    formatting.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="html, css, beginner" {...field} />
                  </FormControl>
                  <FormDescription>
                    Comma-separated list of tags for your post.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Published</FormLabel>
                    <FormDescription>
                      Make this post visible to students.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Post"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
