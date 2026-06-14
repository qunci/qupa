import "@/app/globals.css";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "react-hot-toast";

// Metadata
export const metadata = {
  title: "Qupa - The Ultimate File Converter",
  description: "Secure client-side file converter",
};

// Render
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-gray-50 text-gray-900 antialiased">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-y-auto">
          {children}
        </div>
        
        {/* Toast Provider */}
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
              fontSize: '14px',
            },
          }} 
        />
      </body>
    </html>
  );
}