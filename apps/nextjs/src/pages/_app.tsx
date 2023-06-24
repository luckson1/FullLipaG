import {
  createBrowserSupabaseClient,
  type Session,
} from "@supabase/auth-helpers-nextjs";

import "../styles/globals.css";
import { useState } from "react";
import type { AppProps } from "next/app";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

import { api } from "~/utils/api";
import { ThemeProvider } from "~/components/theme-provider";
import { Toast, ToastProvider } from "~/components/ui/toast";

function MyApp({
  Component,
  pageProps,
}: AppProps<{ initialSession: Session | null }>) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionContextProvider>
  );
}

export default api.withTRPC(MyApp);
