import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "সাংগঠনিক কর্মক্ষমতা ড্যাশবোর্ড | রোল ও টার্গেট বিশ্লেষণ",
  description: "সাংগঠনিক রোল, টার্গেট, সার্কেল রোল ও মনোভা সংবলিত প্রতিবেদন",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
