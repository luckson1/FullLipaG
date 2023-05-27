import React from "react";
import { Redirect } from "expo-router";

const index = () => {
  const isAuth = true;
  return (
    <>
      {isAuth && <Redirect href={"/home"} />}
      {!isAuth && <Redirect href={"/onboarding"} />}
    </>
  );
};

export default index;
