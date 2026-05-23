import { Instrument_Serif, Barlow } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
});

const barlow = Barlow({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-barlow",
});

export const metadata = {
  title: "Veridex — Stop Paying for AI You Don't Use",
  description:
    "Discover hidden AI overspending across ChatGPT, Claude, Cursor, and more. Built for startups that scale fast.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${barlow.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
