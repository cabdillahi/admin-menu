import { SignInForm } from "@/components/auth/sign-in";
import React from "react";

const SignIn: React.FC = () => {
  return (
    <main className="h-screen bg-gray-900 overflow-y-hidden flex items-center justify-center p-4">
      <SignInForm />
    </main>
  );
};

export default SignIn;
