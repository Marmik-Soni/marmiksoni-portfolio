import type { Metadata } from "next";
import "./globals.css";
import { FluidScaleProvider } from "@/components/providers/FluidScaleProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Marmik Soni — Portfolio",
  description: "Personal portfolio of Marmik Soni",
};

const initScript = `
  (function() {
    try {
      var localTheme = window.localStorage.getItem('theme');
      var theme = localTheme ? localTheme : 'light';
      document.documentElement.setAttribute('data-theme', theme);

      var MIN_W = 1024, MAX_W = 2560;
      var X1 = 0.35, Y1 = 0.15, X2 = 0.65, Y2 = 0.85;
      function bez(t, a, b) { var u = 1 - t; return 3 * u * u * t * a + 3 * u * t * t * b + t * t * t; }
      function bezSlope(t, a, b) { var u = 1 - t; return 3 * u * u * a + 6 * u * t * (b - a) + 3 * t * t * (1 - b); }
      function ease(x) {
        if (x <= 0) return 0; if (x >= 1) return 1;
        var t = x, i;
        for (i = 0; i < 8; i++) {
          var err = bez(t, X1, X2) - x; if (Math.abs(err) < 1e-6) break;
          var s = bezSlope(t, X1, X2); if (Math.abs(s) < 1e-6) break;
          t -= err / s;
        }
        if (!(t >= 0 && t <= 1) || Math.abs(bez(t, X1, X2) - x) > 1e-4) {
          var lo = 0, hi = 1; t = x;
          for (i = 0; i < 30; i++) { if (bez(t, X1, X2) < x) lo = t; else hi = t; t = (lo + hi) / 2; }
        }
        return bez(t, Y1, Y2);
      }
      var w = document.documentElement.clientWidth || window.innerWidth;
      var p = ease((w - MIN_W) / (MAX_W - MIN_W));
      document.documentElement.style.setProperty('--p', p.toFixed(4));
    } catch (e) {}
  })();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/fonts/Trap-Regular.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Trap-Medium.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Trap-SemiBold.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
      </head>
      <body>
        <ThemeProvider>
          <FluidScaleProvider>{children}</FluidScaleProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
