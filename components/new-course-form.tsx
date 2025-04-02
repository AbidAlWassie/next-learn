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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Course name must be at least 3 characters.",
  }),
  description: z.string().optional(),
  courseName: z
    .string()
    .min(3, {
      message: "Course name must be at least 3 characters.",
    })
    .regex(/^[a-z0-9-]+$/, {
      message:
        "Course name can only contain lowercase letters, numbers, and hyphens.",
    }),
});

interface NewCourseFormProps {
  userId: string;
}

export function NewCourseForm({ userId }: NewCourseFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      courseName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create course");
      }

      const course = await response.json();
      toast.success("Course created", {
        description: "Your course has been created successfully.",
      });
      router.push(`/dashboard/courses/${course.id}`);
      router.refresh();
    } catch (error) {
      toast.error("Error", {
        description: "Failed to create course. Please try again.",
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Web Development Fundamentals"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the title of your course as it will appear to
                    students.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Learn the fundamentals of web development with HTML, CSS, and JavaScript."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a brief description of your course to help students
                    understand what they will learn.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="courseName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course URL Name</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Input placeholder="web-dev" {...field} />
                      <span className="ml-2 text-muted-foreground">
                        (for URL)
                      </span>
                    </div>
                  </FormControl>
                  <FormDescription>
                    This will be used to create a unique URL for your course.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Course"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
