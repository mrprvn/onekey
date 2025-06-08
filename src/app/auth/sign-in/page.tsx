"use client";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { addUser, loginWithGoogle } from "@/lib/firebase-auth";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SignInPage = () => {
  const [error, setError] = useState("");
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
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <Button
        onClick={handleGoogleLogin}
        className="cursor-pointer px-4 py-2 rounded"
      >
        Sign in with Google
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default SignInPage;
