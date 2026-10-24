import "./globals.css";
import { Bricolage_Grotesque } from "next/font/google";

const font = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = { title: "School Portal", description: "Admin, teacher and student portal" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${font.variable} font-sans min-h-screen`}>{children}</body>
    </html>
  );
}
