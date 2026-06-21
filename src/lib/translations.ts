export type Language = 'en';

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

export const translations: Translations = {
  en: {
    // Sidebar
    coreWorkspaces: "Workspace",
    dashboard: "Dashboard",
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
    docPending: "Client-side document conversion logic pending.",

    // Dashboard & Batch
    pinTool: "Pin to Dashboard",
    unpinTool: "Unpin from Dashboard",
    downloadZip: "Download as ZIP",
    clearAll: "Clear All",
    compressFile: "Compress to ZIP",
    extractArchive: "Extract Archive"
  }
};
