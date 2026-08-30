import React from 'react';
import { motion } from 'motion/react';
import { Moon, ShieldCheck, Heart, Sparkles, ArrowRight } from 'lucide-react';

interface Props {
  onStart: () => void;
}

export const WelcomeStep: React.FC<Props> = ({ onStart }) => {
  return (
    <div id="welcome-step-container" className="flex flex-col items-center justify-between min-h-[580px] h-full text-center px-6 py-10 relative overflow-hidden bg-gradient-to-b from-[#140A05] via-[#0E0603] to-[#0A0502] text-white select-none">
      {/* Subtle night stars animation background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-12 left-10 w-1 h-1 bg-orange-300 rounded-full animate-ping" />
        <div className="absolute top-24 right-12 w-1.5 h-1.5 bg-amber-200 rounded-full animate-pulse" />
        <div className="absolute top-1/2 left-6 w-1 h-1 bg-orange-400 rounded-full" />
        <div className="absolute top-3/4 right-8 w-1 h-1 bg-amber-300 rounded-full animate-pulse" />
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-72 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center mt-6 z-10"
      >
        {/* Glowing Logo Icon */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-500/20 via-amber-500/20 to-rose-500/20 backdrop-blur-xl border border-orange-500/30 flex items-center justify-center shadow-2xl shadow-orange-500/20 ring-1 ring-orange-400/20">
            <Moon className="w-12 h-12 text-orange-300 drop-shadow-[0_0_12px_rgba(249,115,22,0.6)]" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-zinc-950 p-1.5 rounded-full ring-4 ring-[#0C0603] shadow-md">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 backdrop-blur-md border border-orange-500/20 text-orange-300 text-xs font-medium mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>女性夜间出行 AI 安全陪伴</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white mb-3">
          欢迎来到 <span className="bg-gradient-to-r from-orange-300 via-amber-200 to-rose-300 bg-clip-text text-transparent">Nights</span>
        </h1>

        <blockquote className="text-base text-zinc-300 font-medium italic border-l-2 border-orange-500/70 pl-3 py-1 my-3 bg-[#1A0E08]/80 border border-y-0 border-r-0 rounded-r-lg max-w-xs">
          “夜晚的路，我陪你一起走。”
        </blockquote>

        <p className="text-xs text-zinc-400 max-w-[260px] leading-relaxed mt-2">
          不仅是工具，更像时刻在身旁的朋友。理解情绪、多模态守护、懂你的安全记忆。
        </p>
      </motion.div>

      {/* Core Highlights pill */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-xs space-y-2 z-10 my-4"
      >
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#180E08] border border-orange-500/20 text-left shadow-sm">
          <div className="p-2 rounded-lg bg-orange-500/20 text-orange-300 shrink-0">
            <Heart className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-200">情感建立优先</div>
            <div className="text-[11px] text-zinc-400">定制专属声音与人格，像闺蜜般温暖</div>
          </div>
        </div>
      </motion.div>

      {/* Start Button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-xs z-10"
      >
        <button
          id="btn-start-companion-creation"
          onClick={onStart}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 text-white font-semibold text-sm shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer ring-1 ring-orange-400/30"
        >
          <span>开始创建陪伴者</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
};
