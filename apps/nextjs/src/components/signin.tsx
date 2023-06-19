import React, { useState } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { Icons } from "~/components/Icons";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = useSupabaseClient();

  const [email, setEmail] = useState("");

  const signInWithGoogle = async () => {
    setIsLoading(true);
    const { error, data } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "/dashboard" },
    });

    if (error) {
      alert(error.message);
      setIsLoading(false);
    } else if (data.url) {
      setIsLoading(false);
    }
  };

  const signInWithOTP = async (email: string) => {
    setIsLoading(true);
    const { error, data } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: "/dashboard" },
    });
    if (error) {
      alert(error.message);
      setIsLoading(false);
    }
    if (data.user) {
      setIsLoading(false);
      alert(`A login link has been sent to your em ail : ${email}`);
    }
  };
  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={() => signInWithOTP(email)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // disabled={isLoading}
            />
          </div>
          <Button
            className="bg-teal-500 hover:bg-teal-700"
            // disabled={isLoading}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        onClick={signInWithGoogle}
        // disabled={isLoading}
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button>
    </div>
  );
}
