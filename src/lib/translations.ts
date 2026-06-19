export type Language = 'en' | 'id';

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

export const translations: Translations = {
  en: {
    // Sidebar
    coreWorkspaces: "Core Workspaces",
    fileConverters: "File Converters",
    advancedTools: "Advanced Tools",
    settings: "Settings",

    // Settings Hub
    settingsTitle: "Preferences",
    language: "Language",
    languageDesc: "Choose your preferred interface language.",
    theme: "Theme",
    themeDesc: "Customize the appearance of your workspace.",
    light: "Light",
    dark: "Dark",

    // Converters
    imageConverter: "Image Converter",
    documentConverter: "Document Converter",
    clickToUpload: "Click to upload",
    orDragDrop: "or drag and drop",
    remove: "Remove",
    convertTo: "Convert to",
    compressionQuality: "Compression Quality",
    downloadImage: "Download Converted Image",
    serverRequired: "Server Required",
    processing: "Processing...",
    convertNow: "Convert Now",
    comingSoon: "Coming Soon",

    // Toasts
    fileTooLarge: "Free mode limit is 20MB. Massive file processing (Qupa Premium) is coming soon! 🚀",
    wrongConverterDoc: "Please use the Document Converter for this file.",
    wrongConverterImg: "Please use the Image Converter for this file.",
    unsupportedFormat: "Unsupported format:",
    convertingTo: "Converting to",
    convertSuccess: "Converted successfully!",
    convertError: "Error during conversion.",
    heicProcessing: "Processing HEIC format...",
    heicSuccess: "HEIC loaded successfully",
    heicError: "Failed to parse HEIC image.",
    docPending: "Client-side document conversion logic pending."
  },
  id: {
    // Sidebar
    coreWorkspaces: "Ruang Kerja Utama",
    fileConverters: "Konverter File",
    advancedTools: "Alat Lanjutan",
    settings: "Pengaturan",

    // Settings Hub
    settingsTitle: "Preferensi",
    language: "Bahasa",
    languageDesc: "Pilih bahasa antarmuka yang Anda inginkan.",
    theme: "Tema",
    themeDesc: "Sesuaikan tampilan ruang kerja Anda.",
    light: "Terang",
    dark: "Gelap",

    // Converters
    imageConverter: "Konverter Gambar",
    documentConverter: "Konverter Dokumen",
    clickToUpload: "Klik untuk mengunggah",
    orDragDrop: "atau seret dan lepas",
    remove: "Hapus",
    convertTo: "Ubah ke",
    compressionQuality: "Kualitas Kompresi",
    downloadImage: "Unduh Gambar",
    serverRequired: "Butuh Server",
    processing: "Memproses...",
    convertNow: "Konversi Sekarang",
    comingSoon: "Segera Hadir",

    // Toasts
    fileTooLarge: "Batas maksimal mode gratis adalah 20MB. Pemrosesan file raksasa (Qupa Premium) akan segera hadir! 🚀",
    wrongConverterDoc: "Harap gunakan Konverter Dokumen untuk file ini.",
    wrongConverterImg: "Harap gunakan Konverter Gambar untuk file ini.",
    unsupportedFormat: "Format tidak didukung:",
    convertingTo: "Mengubah ke",
    convertSuccess: "Berhasil dikonversi!",
    convertError: "Terjadi kesalahan saat konversi.",
    heicProcessing: "Memproses format HEIC...",
    heicSuccess: "HEIC berhasil dimuat",
    heicError: "Gagal memproses gambar HEIC.",
    docPending: "Logika konversi dokumen client-side belum tersedia."
  }
};
