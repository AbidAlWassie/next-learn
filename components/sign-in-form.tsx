"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Github, Mail } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export function SignInForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSignIn = async (provider: string) => {
    setIsLoading(true)
    try {
      await signIn(provider, { callbackUrl: "/dashboard" })
    } catch (error) {
      console.error("Sign in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <Button variant="outline" className="w-full" onClick={() => handleSignIn("github")} disabled={isLoading}>
            <Github className="mr-2 h-4 w-4" />
            Sign in with GitHub
          </Button>
          <Button variant="outline" className="w-full" onClick={() => handleSignIn("google")} disabled={isLoading}>
            <Mail className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
          <Separator />
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

