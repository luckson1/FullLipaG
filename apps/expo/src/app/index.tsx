import React from "react";
import { Redirect } from "expo-router";
import { useUser } from "@supabase/auth-helpers-react";

const Index = () => {
  const user = useUser();
  return (
    <>
      {user && <Redirect href={"/home"} />}
      {!user && <Redirect href={"/onboarding"} />}
    </>
  );
};

export default Index;
