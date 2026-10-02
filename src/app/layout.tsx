import type { Metadata, Viewport } from 'next';
// Schriften liegen als npm-Pakete im Projekt (selbst gehostet, kein Abruf
// bei Google Fonts – gut für Datenschutz und Offline-Builds).
// Fraunces: editoriale Display-Schrift · Manrope: gut lesbare Grotesk
import '@fontsource-variable/fraunces/index.css';
import '@fontsource-variable/fraunces/wght-italic.css';
import '@fontsource-variable/manrope/index.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Unter der Donau – Die faszinierende Unterwasserwelt Österreichs',
  description:
    'Eine interaktive Ausstellung über die Fische in Österreichs Flüssen und Seen: Lebensräume, Merkmale, Gefährdung und Schutz.',
};

export const viewport: Viewport = {
  themeColor: '#01090d',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de-AT">
      <body>{children}</body>
    </html>
  );
}
