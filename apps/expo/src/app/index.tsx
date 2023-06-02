import React from "react";
import { Redirect } from "expo-router";
import { useSession } from "@supabase/auth-helpers-react";

const Index = () => {
  const session = useSession();
  return (
    <>
      {session && <Redirect href={"/home"} />}
      {!session && <Redirect href={"/onboarding"} />}
    </>
  );
};

export default Index;
