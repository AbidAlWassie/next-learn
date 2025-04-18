"use client";

// import { signInWithCredentials } from "@/app/(auth)/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SignInForm } from "../components/SignInForm";
import { SignUpForm } from "../components/SignUpForm";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  // const router = useRouter();
  // const searchParams = useSearchParams();

  // const handleSignIn = async () => {
  //   setIsLoading(true);
  //   try {
  //     const callbackUrl = searchParams.get("callbackUrl") || "/";
  //     const result = await signInWithCredentials({ email, password });
  //     if (result.success) {
  //       toast.success("Signed in successfully");
  //       router.push(callbackUrl);
  //       router.refresh();
  //     } else {
  //       toast.error(result.error || "Failed to sign in");
  //     }
  //   } catch (error) {
  //     console.error("Sign in error:", error);
  //     toast.error("An unexpected error occurred");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleSignUpSuccess = () => {
  //   toast.success(
  //     "Account created! Please check your email to verify your account."
  //   );
  //   router.push("/verify-request");
  // };

  // const handleSignUpError = (error: string) => {
  //   toast.error(error);
  // };

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger
                value="signin"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <SignInForm
                email={email}
                password={password}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onSubmit={() => console.log("sign in triggered")}
                // onSubmit={handleSignIn}
                isLoading={isLoading}
              />
            </TabsContent>
            <TabsContent value="signup">
              <SignUpForm
              // onSuccess={() => console.log("sign up triggered")}
              // onError={() => console.log("sign up triggered")}
              // onSuccess={handleSignUpSuccess}
              // onError={handleSignUpError}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
