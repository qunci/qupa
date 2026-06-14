import ImageConverter from "@/components/ImageConverter";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center py-20 bg-gray-50 text-gray-900 px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold mb-3 tracking-tight">Qupa</h1>
        <p className="text-lg text-gray-500 font-medium">The Ultimate Client-Side File Converter</p>
      </div>

      {/* Core Application */}
      <ImageConverter />
    </main>
  );
}