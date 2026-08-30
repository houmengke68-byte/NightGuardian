import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Moon, Heart, Sparkles, CheckCircle2, ShieldCheck, MapPin, Clock, ArrowRight } from 'lucide-react';
import { CompanionConfig, TripConfig } from '../../types';
import { voiceEngine } from '../../services/voiceSynthesis';

interface Props {
  companion: CompanionConfig;
  trip: TripConfig;
  durationMinutes: number;
  onFinish: () => void;
}

export const ArrivalCelebration: React.FC<Props> = ({
  companion,
  trip,
  durationMinutes,
  onFinish,
}) => {
  useEffect(() => {
    // Confetti celebration effect
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#a855f7', '#6366f1', '#34d399', '#fbbf24'],
    });

    // Voice farewell
    const farewell = `你已经安全到达啦。今天辛苦了。早点休息，祝你有一个好梦。`;
    voiceEngine.speak(farewell, companion.voice);
  }, [companion.voice]);

  return (
    <div id="arrival-celebration-container" className="flex flex-col justify-between min-h-[580px] h-full px-5 py-6 bg-[#0A0502] text-white select-none relative overflow-y-auto custom-scrollbar">
      {/* Top Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center gap-1.5 px-3 py-1 mx-auto rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-semibold border border-emerald-500/30"
      >
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>GPS 已确认进入安全围栏 · 安全到达</span>
      </motion.div>

      {/* Main Avatar & Warm Farewell Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="my-4 flex flex-col items-center text-center"
      >
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-500 via-amber-500 to-rose-600 p-0.5 shadow-xl shadow-orange-500/30 flex items-center justify-center text-3xl">
            {companion.avatar === 'avatar_night' && '🌌'}
            {companion.avatar === 'avatar_warm' && '🌸'}
            {companion.avatar === 'avatar_gentle' && '✨'}
            {companion.avatar === 'avatar_custom' && '💫'}
          </div>
          <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full border-2 border-[#0A0502] text-slate-950">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="text-xs font-bold text-orange-300 mb-1">{companion.name} 陪你走完了全程</div>
        <h2 className="text-2xl font-bold text-white tracking-tight mb-2">你已经安全到达啦</h2>

        <blockquote className="text-xs text-zinc-300 font-medium bg-[#1A0E08] border-l-2 border-orange-400 pl-3 py-2 rounded-r-xl max-w-xs text-left leading-relaxed space-y-1 shadow-sm border-t border-b border-r border-orange-500/15">
          <p>“今天辛苦了。”</p>
          <p>“早点休息，祝你有一个好梦。”</p>
        </blockquote>
      </motion.div>

      {/* Safety Summary Record (Section 15) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-4 rounded-2xl bg-[#140A05] backdrop-blur-md border border-orange-500/25 space-y-3 text-left shadow-sm"
      >
        <div className="flex items-center justify-between text-xs font-bold text-zinc-200 border-b border-orange-500/15 pb-2">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>今日守护行程报告</span>
          </span>
          <span className="text-emerald-400 font-mono">🟢 路线安全完成</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-[#0D0603] border border-orange-500/15">
            <div className="text-[10px] text-zinc-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-orange-400" />
              <span>守护陪伴用时</span>
            </div>
            <div className="text-sm font-bold text-white mt-1">
              {durationMinutes || 18} <span className="text-[10px] font-normal text-zinc-400">分钟</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0D0603] border border-orange-500/15">
            <div className="text-[10px] text-zinc-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>终点区域</span>
            </div>
            <div className="text-xs font-bold text-white mt-1 truncate">
              {trip.destination.split('(')[0]}
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#1C0E07] border border-orange-500/20 text-[11px] text-zinc-300 leading-relaxed">
          <span className="font-semibold text-orange-300">行程关注点：</span>{' '}
          学院南路中段（历史记忆区）已平稳通过，同行观察期 0.8km，未出现实质风险。
        </div>
      </motion.div>

      {/* Return Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-3 pt-2"
      >
        <button
          id="btn-finish-arrival"
          onClick={onFinish}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>完成守护 · 返回首页</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
};
