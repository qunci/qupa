import "@/app/globals.css";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "sonner";
import { SettingsProvider } from "@/hooks/useSettings";


export const metadata = {
  title: "Qupa - The Ultimate File Converter",
  description: "Secure client-side file converter",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Suppress hydration warning to allow manual DOM class manipulation for dark mode
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Theme Initialization Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="flex min-h-screen bg-white dark:bg-[#131314] text-slate-900 dark:text-slate-100 antialiased transition-colors duration-300">
        <SettingsProvider>
          {/* Main Sidebar */}
          <Sidebar />
          
          <div className="flex-1 flex flex-col overflow-y-auto">
            {children}
          </div>
        </SettingsProvider>
        
        {/* Toast Provider */}
        <Toaster position="bottom-right" theme="system" richColors closeButton />
      </body>
    </html>
  );
}