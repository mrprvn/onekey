"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/firebase";
import { addUser, loginWithGoogle } from "@/lib/firebase-auth";
import { onAuthStateChanged } from "firebase/auth";
import { CheckCircle, Key, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SignInPage = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleGoogleLogin = async () => {
    try {
      const user = await loginWithGoogle();
      if (!user) return;
      await addUser(user);
      router.replace("/");
    } catch (err: unknown) {
      console.error("Google Sign-In Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <div className="flex items-center gap-2">
            <Key className="h-6 w-6" />
            <span className="font-bold text-xl">OneKey</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-3">
                Secure Your Digital Life
              </h1>
              <p className="text-xl text-muted-foreground">
                OneKey is your personal vault for passwords, keeping your online
                accounts safe and accessible.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium">End-to-end encryption</h3>
                  <p className="text-muted-foreground">
                    Your data is encrypted and only accessible by you
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium">Cross-device access</h3>
                  <p className="text-muted-foreground">
                    Access your passwords from any device, anytime
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium">Master key protection</h3>
                  <p className="text-muted-foreground">
                    Extra layer of security with your personal master key
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Card className="w-full max-w-md">
              <CardHeader className="space-y-1 text-center">
                <div className="flex justify-center mb-2">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Create your vault</CardTitle>
                <CardDescription>
                  Sign up with Google to start managing your passwords securely
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Button
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center cursor-pointer justify-center gap-2"
                >
                  <div className="bg-white rounded-full p-0.5 flex items-center justify-center">
                    <svg
                      width="18"
                      height="18"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                    >
                      <path
                        fill="#FFC107"
                        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                      />
                      <path
                        fill="#FF3D00"
                        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                      />
                      <path
                        fill="#4CAF50"
                        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                      />
                      <path
                        fill="#1976D2"
                        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                      />
                    </svg>
                  </div>
                  <span>Sign up with Google</span>
                </Button>
              </CardContent>
              <CardFooter className="flex flex-col items-center text-center text-sm text-muted-foreground">
                <p>
                  Please read our About Us page to learn how we protect your
                  data.
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              <span className="font-semibold">OneKey</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} OneKey. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/about" className="hover:underline">
                About Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SignInPage;
