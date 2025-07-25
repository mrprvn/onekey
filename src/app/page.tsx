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
import AddPassword from "@/components/ui/shared/add-password";

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
    <main className="min-h-screen flex flex-col bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl flex flex-col flex-1">
        <Header user={user} />
        {passwords && passwords.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {passwords.map((password) => (
              <PassowrdCard key={password.id} password={password}/>
            ))}
          </div>
        ) : (
          <div className="flex gap-2 flex-col flex-1 items-center justify-center">
            <p className="text-muted-foreground">
              No passwords saved yet. Start by adding one!
            </p>
            <AddPassword userId={user.uid} />
          </div>
        )}
      </div>
    </main>
  );
}
