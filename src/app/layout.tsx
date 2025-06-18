"use client";

import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@/styles/globals.css";
import { RootChildren } from "@/core/interfaces/root";
import Providers from "./Provider";
import { useEffect, useState } from "react";
import { getThemeFromCSS } from "@/core/utils/getThemeFromCss";

export default function RootLayout({ children }: RootChildren) {
  const [theme, setTheme] = useState<any>(null);

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const themeName = prefersDark ? "mydarktheme" : "mytheme";

    document.documentElement.setAttribute("data-theme", themeName);
    setTheme(getThemeFromCSS());
  }, []);

  if (!theme) return null; // o un loading screen

  return (
    <html lang="en">
      <head>
        <title>HINT - Cammeras</title>
        <meta
          name="description"
          content="HINT by heimdal, Cámaras de seguridad y monitoreo en tiempo real"
        />
        <meta name="robots" content="noindex, nofollow" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link
          rel="icon"
          href="https://heimdal.ec/wp-content/uploads/2023/01/cropped-Icono.png"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Providers>{children}</Providers>
        </MantineProvider>
      </body>
    </html>
  );
}
