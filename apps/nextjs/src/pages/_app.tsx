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
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "~/components/ui/toast";

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
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ToastProvider>
          <Component {...pageProps} />
          <Toast>
            <ToastTitle />
            <ToastDescription />
            <ToastClose />
            <ToastAction altText="close" />
          </Toast>
          <ToastViewport />
        </ToastProvider>
      </ThemeProvider>
    </SessionContextProvider>
  );
}

export default api.withTRPC(MyApp);
