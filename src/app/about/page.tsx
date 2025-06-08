import type React from "react";
import Link from "next/link";
import {
  Key,
  Shield,
  Lock,
  RefreshCw,
  FolderLock,
  Edit2,
  Github,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="h-6 w-6" />
            <span className="font-bold text-xl">OneKey</span>
          </div>
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/">Get Started</Link>
          </Button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden border-b">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Why OneKey?
              </h1>
              <p className="text-xl text-muted-foreground">
                Your digital life deserves better protection — here&#39;s how
                OneKey keeps you safe.
              </p>
            </div>
          </div>
          {/* Background Icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <Lock className="w-[600px] h-[600px]" />
          </div>
        </section>

        {/* Core Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Core Features
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <FeatureCard
                icon={<Shield className="h-8 w-8" />}
                title="Secure Google Sign-In"
                description="Sign in easily and securely with Google OAuth."
              />
              <FeatureCard
                icon={<Lock className="h-8 w-8" />}
                title="Zero-Knowledge Encryption"
                description="Only you can decrypt your passwords with your personal master key."
              />
              <FeatureCard
                icon={<RefreshCw className="h-8 w-8" />}
                title="Real-Time Sync"
                description="Your passwords update instantly across devices."
              />
              <FeatureCard
                icon={<FolderLock className="h-8 w-8" />}
                title="Organized Vault"
                description="Save usernames, passwords, titles, and notes in a personal encrypted vault."
              />
              <FeatureCard
                icon={<Edit2 className="h-8 w-8" />}
                title="Edit & Delete Anytime"
                description="Full control over your data — edit or delete when needed."
              />
              <FeatureCard
                icon={<Github className="h-8 w-8" />}
                title="Open Source & Transparent"
                description="Code you can trust."
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              How It Works
            </h2>
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[22px] top-0 bottom-0 w-[2px] bg-border" />

                <div className="space-y-12">
                  <TimelineStep
                    number={1}
                    title="Sign in with Google"
                    description="Use your Google account to sign in securely without creating another password."
                  />
                  <TimelineStep
                    number={2}
                    title="Set your master key"
                    description="Create a master key that's not stored anywhere — it's the only way to decrypt your passwords."
                  />
                  <TimelineStep
                    number={3}
                    title="Add passwords"
                    description="Your passwords are encrypted before storage and can only be decrypted with your master key."
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* User Trust Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                Why Users Trust Us
              </h2>

              {/* Testimonial */}
              <Card className="mb-12">
                <CardContent className="pt-6">
                  <blockquote className="text-lg italic">
                    &#34;OneKey has completely changed how I manage my
                    passwords. The master key concept gives me peace of mind
                    knowing that my data is truly secure.&#34;
                  </blockquote>
                  <div className="mt-4 flex items-center">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <span className="font-medium text-sm">JD</span>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">Jane Doe</p>
                      <p className="text-sm text-muted-foreground">
                        Software Developer
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Statement */}
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  Our Privacy Commitment
                </h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Your data is encrypted before it ever leaves your device. We
                  can&#39;t see your passwords — and never will.
                </p>
              </div>

              {/* Security Points */}
              <div className="space-y-4 max-w-xl mx-auto">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <p>
                    End-to-end encryption ensures only you can access your data
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <p>
                    Your master key is never transmitted or stored on our
                    servers
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <p>
                    Open source code means security experts can verify our
                    claims
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Start securing your digital life today.
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Join thousands of users who trust OneKey to protect their most
              sensitive information.
            </p>
            <Button asChild size="lg" className="gap-2">
              <Link href="/auth/sign-in">
                Get Started with OneKey
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              <span className="font-semibold">OneKey</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} OneKey. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function TimelineStep({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-6">
      <div className="relative shrink-0">
        <div className="h-12 w-12 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-primary font-semibold z-10 relative">
          {number}
        </div>
      </div>
      <div className="pt-2">
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
