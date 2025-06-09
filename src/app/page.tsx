"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { usePasswordStore } from "@/lib/password-store";
import PassowrdCard from "@/components/ui/shared/password-card";
import Header from "@/components/ui/shared/header";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/user-store";
import { LoaderCircle } from "lucide-react";

export type PasswordType = {
  id: string;
  title: string;
  username: string;
  password: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function HomePage() {
  const { setUser } = useUserStore();
  const user = useUserStore((state) => state.user);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const passwords = usePasswordStore((state) => state.passwords);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        router.replace("/");
      } else {
        router.replace("/auth/sign-in");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, setUser]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoaderCircle className="animate-spin" size={40} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Header user={user} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {passwords?.map((password) => (
            <PassowrdCard key={password.id} password={password} />
          ))}
        </div>
      </div>
    </main>
  );
}
