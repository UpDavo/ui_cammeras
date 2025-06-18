"use client";
import React, { useEffect, useState } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/core/store";
import { useAppDispatch } from "@/core/hooks/useAppDispatch";
import { refreshAccessToken } from "@/auth/hooks/useAuth";
import { Loader, Text, Container } from "@mantine/core";

function AuthLoader({ children }) {
  const dispatch = useAppDispatch();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    (async () => {
      await dispatch(refreshAccessToken());
      setCheckingAuth(false);
    })();
  }, [dispatch]);

  if (checkingAuth) {
    return (
      <Container className="flex flex-col items-center justify-center h-screen">
        <Loader size="xl" variant="bars" color="blue" />
        <Text className="mt-4 text-xl">Cargando sesión...</Text>
      </Container>
    );
  }

  return <>{children}</>;
}

export default function Providers({ children }) {
  return (
    <ReduxProvider store={store}>
      <AuthLoader>{children}</AuthLoader>
    </ReduxProvider>
  );
}
