"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { LogoutButton } from "@/components/logout-button";
import { hasEnvVars } from "@/lib/utils";

export function UserStatus() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!hasEnvVars) return;
    const supabase = createClient();
    supabase.auth
      .getUser()
      .then(({ data }: { data: { user: { email?: string } | null } }) => {
        setEmail(data.user?.email ?? null);
      });
  }, []);

  if (email) {
    return (
      <div className="flex items-center gap-3 text-sm">
        Hey, {email}! <LogoutButton />
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button asChild size="sm" variant="outline">
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant="default">
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
