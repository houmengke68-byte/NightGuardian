import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  MapPin,
  Navigation,
  Sparkles,
  Shield,
  Clock,
  ChevronRight,
  AlertTriangle,
  Settings,
  Volume2,
  PhoneCall,
  History,
  Heart,
  Footprints,
  Bike,
  Train,
  Car
} from 'lucide-react';
import { CompanionConfig, TripConfig, CompanionMode, SafetyMemory, TransportType } from '../../types';
import { voiceEngine } from '../../services/voiceSynthesis';

interface Props {
  companion: CompanionConfig;
  trip: TripConfig;
  memories: SafetyMemory[];
  activeMode: CompanionMode;
  onModeChange: (mode: CompanionMode) => void;
  onTransportChange?: (transport: TransportType) => void;
  onStartGuard: () => void;
  onOpenSettings: () => void;
  onTriggerFakeCall: () => void;
}

export const HomeScreen: React.FC<Props> = ({
  companion,
  trip,
  memories,
  activeMode,
  onModeChange,
  onTransportChange,
  onStartGuard,
  onOpenSettings,
  onTriggerFakeCall,
}) => {
  const [isPlayingGreeting, setIsPlayingGreeting] = useState(false);
  const recentMemory = memories[0] || null;

  const handleSpeakGreeting = () => {
    setIsPlayingGreeting(true);
    const greetingText = `你下课啦？今天也回${trip.destination.split('(')[0]}吗？我陪你一起走。`;
    voiceEngine.speak(greetingText, companion.voice, () => {
      setIsPlayingGreeting(false);
    });
  };

  const getTransportIcon = (type: TransportType) => {
    switch (type) {
      case '步行':
        return Footprints;
      case '骑行':
        return Bike;
      case '地铁':
        return Train;
      case '打车':
        return Car;
      default:
        return Footprints;
    }
  };

  const selectedTransports = trip.transports && trip.transports.length > 0 
    ? trip.transports 
    : [trip.transport || '步行'];

  const TransportIcon = getTransportIcon(trip.transport || selectedTransports[0]);

  return (
    <div id="home-screen-container" className="flex flex-col justify-between min-h-[580px] h-full px-4.5 py-4 bg-[#0A0502] text-white select-none relative overflow-y-auto custom-scrollbar">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <div className="flex items-center justify-between z-10 pt-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
          <span className="text-xs font-semibold text-zinc-200">
            Nights <span className="text-orange-400 font-bold">· 守望中</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onTriggerFakeCall}
            title="模拟防打探来电"
            className="p-2 rounded-xl bg-[#1A0E08] hover:bg-[#25150E] text-orange-300 text-xs flex items-center gap-1 border border-orange-500/30 active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            <PhoneCall className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-[11px] font-medium hidden sm:inline">防探来电</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-[#1A0E08] hover:bg-[#25150E] text-zinc-300 border border-orange-500/20 active:scale-95 transition-all cursor-pointer"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Companion Emotional Presence Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="my-3 flex flex-col items-center text-center z-10"
      >
        {/* Animated Companion Avatar */}
        <div className="relative mb-3 group cursor-pointer" onClick={handleSpeakGreeting}>
          {/* Subtle Outer Glow Ring */}
          <div className="absolute -inset-2 bg-gradient-to-r from-orange-500/25 via-amber-500/35 to-rose-600/25 rounded-full blur-lg animate-pulse" />

          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 via-amber-500 to-rose-600 p-[2px] shadow-xl shadow-orange-950/80">
            <div className="w-full h-full rounded-full bg-[#120804] flex items-center justify-center text-3xl overflow-hidden border border-orange-400/30">
              {companion.avatar === 'avatar_cat' && '🐱'}
              {companion.avatar === 'avatar_night' && '🌌'}
              {companion.avatar === 'avatar_warm' && '🌸'}
              {companion.avatar === 'avatar_gentle' && '✨'}
              {companion.avatar === 'avatar_custom' && '💫'}
            </div>
          </div>

          <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-md border-2 border-zinc-950">
            <Volume2 className={`w-3 h-3 ${isPlayingGreeting ? 'animate-bounce' : ''}`} />
          </div>
        </div>

        {/* Companion Greetings */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-300 bg-orange-500/15 px-2.5 py-0.5 rounded-full border border-orange-500/30 shadow-sm">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{companion.name} 在等你</span>
          </div>

          <h2 className="text-xl font-bold text-white tracking-tight mt-1">
            “你下课啦？”
          </h2>
          <p className="text-sm text-zinc-300 font-medium">
            “今天也回学校吗？”
          </p>
          <p className="text-xs text-orange-300/90 font-medium italic">
            “我陪你一起走。”
          </p>
        </div>
      </motion.div>

      {/* Commute Route Card (Section 3) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-4 rounded-2xl bg-[#140C08] border border-orange-500/25 shadow-xl shadow-orange-950/40 space-y-3 z-10"
      >
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-zinc-200 font-semibold">
            <TransportIcon className="w-4 h-4 text-orange-400" />
            <span>常用夜间通勤路线</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <Clock className="w-3 h-3" />
            <span>常用时间 {trip.commonTime}</span>
          </span>
        </div>

        {/* Origin to Destination Card */}
        <div className="p-3 rounded-xl bg-[#1D100A] border border-orange-500/20 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex flex-col items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-400 ring-2 ring-orange-500/30" />
                <div className="w-0.5 h-4 bg-orange-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-500/30" />
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-200">{trip.departure}</div>
                <div className="text-xs font-bold text-white mt-1.5">{trip.destination}</div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-base font-extrabold text-orange-400">
                {trip.estimatedMinutes} <span className="text-xs font-normal text-zinc-400">分钟</span>
              </div>
              <div className="text-[10px] text-zinc-400">
                {trip.segments && trip.segments.length > 1
                  ? `${trip.segments.length}段连续出行`
                  : `${trip.transport || selectedTransports[0]}直达`}
              </div>
            </div>
          </div>

          {/* Continuous Multi-Segment Chain Visualizer */}
          {trip.segments && trip.segments.length > 0 && (
            <div className="pt-2 border-t border-orange-500/15 space-y-1.5 text-left">
              <div className="text-[10px] font-semibold text-zinc-400 flex items-center justify-between">
                <span>全过程接力守护链：</span>
                <span className="text-orange-300">无缝切换策略</span>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {trip.segments.map((seg, idx) => {
                  const SIcon = getTransportIcon(seg.transport);
                  return (
                    <div
                      key={seg.id || idx}
                      className="p-1.5 rounded-lg bg-[#160B06] border border-orange-500/15 flex flex-col justify-between"
                    >
                      <div className="flex items-center gap-1">
                        <span className="w-3.5 h-3.5 rounded-full bg-orange-500/20 text-orange-400 text-[9px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <SIcon className="w-3 h-3 text-orange-400 shrink-0" />
                        <span className="text-[10px] font-bold text-zinc-200 truncate">{seg.transport}</span>
                      </div>
                      <div className="text-[9px] text-zinc-400 truncate mt-1">
                        {seg.toName}
                      </div>
                      <div className="text-[8px] text-orange-300/80 font-mono mt-0.5">
                        {seg.estimatedMinutes}分钟 · 守护
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Multi-transport switch strip if user selected multiple */}
        {selectedTransports.length > 1 && (
          <div className="flex items-center justify-between pt-0.5 pb-1 px-1">
            <span className="text-[10px] text-zinc-400">今晚出行方式：</span>
            <div className="flex items-center gap-1.5">
              {selectedTransports.map((t) => {
                const Icon = getTransportIcon(t);
                const isActive = (trip.transport || selectedTransports[0]) === t;
                return (
                  <button
                    key={t}
                    onClick={() => onTransportChange && onTransportChange(t)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-medium flex items-center gap-1 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold shadow-sm shadow-orange-500/30 ring-1 ring-orange-400/40'
                        : 'bg-[#1D100A] text-zinc-400 hover:text-zinc-200 border border-orange-500/15'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{t}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Big P0 Action Button: [和我一起回去] */}
        <button
          id="btn-start-guard-with-me"
          onClick={onStartGuard}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-orange-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer group ring-1 ring-orange-400/40"
        >
          <Heart className="w-4 h-4 text-orange-200 fill-orange-200/50 group-hover:scale-110 transition-transform" />
          <span>和我一起回去</span>
          <ChevronRight className="w-4 h-4 text-orange-200 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </motion.div>

      {/* Safety Memory Card (Section 3 & Section 12) */}
      {recentMemory && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-3.5 rounded-2xl bg-[#1E1106] border border-amber-500/35 text-left z-10 shadow-sm"
        >
          <div className="flex items-center justify-between text-amber-300 text-xs font-bold mb-1">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>最近一次安全记忆</span>
            </div>
            <span className="text-[10px] text-amber-300 bg-amber-500/15 px-1.5 py-0.5 rounded border border-amber-500/30">
              触达预警
            </span>
          </div>

          <p className="text-xs text-amber-200 font-medium">
            “{recentMemory.locationName} 曾让你感到害怕”
          </p>
          <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
            {recentMemory.note}
          </p>
        </motion.div>
      )}

      {/* Companion Mode Selector Pill */}
      <div className="pt-2 z-10">
        <div className="text-[11px] font-medium text-zinc-400 mb-1.5 text-left flex items-center gap-1">
          <Shield className="w-3 h-3 text-orange-400" />
          <span>陪伴交互模式</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#140C08] border border-orange-500/20">
          {(
            [
              { id: 'GIRLFRIEND', label: '闺蜜陪伴型', desc: '主动畅聊' },
              { id: 'QUIET', label: '安静守护型', desc: '低频静候' },
              { id: 'FULL_CARE', label: '全程守护型', desc: '高频确认' },
            ] as const
          ).map((m) => {
            const isSelected = activeMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onModeChange(m.id)}
                className={`py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold shadow-md shadow-orange-500/30'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1E1108]'
                }`}
              >
                <div className="text-[11px] leading-tight">{m.label}</div>
                <div className="text-[9px] opacity-75">{m.desc}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
