"use client";

import { motion } from "framer-motion";
import { FolderUp, Settings, Combine, Scissors, FileImage, FileText } from "lucide-react";

export default function WelcomeDashboard() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-6xl mx-auto pt-24 px-6 md:px-10 pb-16"
    >
      <div className="mb-10">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2"
        >
          Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Creator.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-slate-500 dark:text-slate-400 text-lg"
        >
          Your secure, client-side workspace is ready.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Stat Card 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 dark:bg-[#1C1C1E]/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-2xl shadow-sm"
        >
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
            <Combine className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Files Processed</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">124</p>
        </motion.div>

        {/* Stat Card 2 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/70 dark:bg-[#1C1C1E]/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-2xl shadow-sm"
        >
          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4">
            <FolderUp className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Storage Saved</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">1.2 GB</p>
        </motion.div>

        {/* Stat Card 3 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/70 dark:bg-[#1C1C1E]/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-2xl shadow-sm"
        >
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mb-4">
            <Settings className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Local Processing</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">100%</p>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/50 dark:bg-[#1A1A1C]/50 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/50">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h2>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
          {[
            { name: "Q3_Financial_Report_Final.pdf", tool: "Merge PDF", icon: Combine, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-500/10", time: "2 mins ago" },
            { name: "vacation_photos.zip", tool: "Image Converter", icon: FileImage, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-500/10", time: "1 hour ago" },
            { name: "contract_pages_1_to_3.pdf", tool: "Split PDF", icon: Scissors, color: "text-rose-500", bg: "bg-rose-100 dark:bg-rose-500/10", time: "Yesterday" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 px-6 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.bg} ${item.color}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.tool}</p>
                </div>
              </div>
              <span className="text-xs font-medium text-slate-400">{item.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
