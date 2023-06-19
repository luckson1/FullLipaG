import React, { useState } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { Icons } from "~/components/Icons";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { supabase } from "~/lib/client";
import { cn } from "~/lib/utils";
import { ToastAction } from "./ui/toast";
import { toast, useToast } from "./ui/use-toast";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [email, setEmail] = useState("");

  const signInWithGoogle = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "/dashboard" },
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: ` There was a problem: ${error.message}`,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      setIsLoading(false);
    } else {
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
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: ` There was a problem: ${error.message}`,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });

      setIsLoading(false);
    }
    if (data.user) {
      setIsLoading(false);
      toast({
        title: "Magic Link sent to your Email.",
        description: ` Check your inbox for a link to log you in`,
        action: <ToastAction altText="Close">Close</ToastAction>,
      });
    }
  };
  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await signInWithOTP(email);
        }}
      >
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
