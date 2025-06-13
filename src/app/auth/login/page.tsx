"use client";
import { useAuth } from "@/hooks/useAuth";
import LoginForm from "./components/LoginForm";
import { Container } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    } else {
      setCheckingAuth(false);
    }
  }, [user, router]);

  if (checkingAuth) return null;

  return (
    <div className="flex items-center justify-center h-screen-dvh bg-gradient-to-r from-primary to-accent">
      <Container
        fluid
        className="flex flex-col items-center justify-center px-4 py-10 bg-white shadow-lg rounded-xl max-w-md w-full mx-10 md:mx-0"
      >
        <h1 className="text-6xl font-bold mb-2 text-neutral">HINT</h1>
        <h1 className="text-2xl mb-6 text-neutral">Login</h1>
        <LoginForm />
      </Container>
    </div>
  );
}

export default LoginPage;
