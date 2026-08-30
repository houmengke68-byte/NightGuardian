import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Shield, Heart, Volume2, Bell, Eye } from 'lucide-react';
import { GuardState } from '../../types';

interface SmartCatCompanionProps {
  name: string;
  guardState: GuardState;
  isSpeaking: boolean;
  isAiReplying: boolean;
  speed: number;
  onPetCat?: (reassuringText: string) => void;
  compact?: boolean;
}

const PURR_MESSAGES = [
  '喵~ 别害怕，小夜猫咪一直睁大眼睛帮你看着四周呢！',
  '呼噜呼噜… 步速很平稳，再走几分钟就到明亮大路啦！',
  '喵呜！我的耳朵一直在听着周围动静，安心走吧~',
  '蹭蹭你的手心🐾，有我在，夜晚一点也不孤单。',
  '喵~ 放心握紧手机，前方路况一切正常。',
];

export const SmartCatCompanion: React.FC<SmartCatCompanionProps> = ({
  name,
  guardState,
  isSpeaking,
  isAiReplying,
  speed,
  onPetCat,
  compact = false,
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [isPetted, setIsPetted] = useState(false);
  const [petMessage, setPetMessage] = useState<string | null>(null);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  // Periodic blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 3800);
    return () => clearInterval(blinkInterval);
  }, []);

  // Handle petting the cat
  const handlePet = () => {
    setIsPetted(true);
    const randomMsg = PURR_MESSAGES[Math.floor(Math.random() * PURR_MESSAGES.length)];
    setPetMessage(randomMsg);
    if (onPetCat) {
      onPetCat(randomMsg);
    }

    // Spawn floating heart particles
    const newHeart = { id: Date.now(), x: (Math.random() - 0.5) * 40, y: -20 };
    setHearts((prev) => [...prev.slice(-3), newHeart]);

    setTimeout(() => setIsPetted(false), 1200);
    setTimeout(() => setPetMessage(null), 4000);
  };

  // Determine state-based theme colors and status
  const getCatMood = () => {
    if (guardState === 'SUSPICIOUS') {
      return {
        mood: 'alert',
        collarColor: '#EF4444',
        eyeColor: '#F97316',
        badge: '警戒守护中',
        glowRing: 'ring-rose-500/50 shadow-rose-950/80',
        bgBox: 'from-[#2A100B] to-[#160805] border-rose-500/40',
      };
    }
    if (guardState === 'ANXIOUS') {
      return {
        mood: 'cautious',
        collarColor: '#F59E0B',
        eyeColor: '#FBBF24',
        badge: '专注陪伴中',
        glowRing: 'ring-amber-500/50 shadow-amber-950/80',
        bgBox: 'from-[#261308] to-[#140804] border-amber-500/40',
      };
    }
    if (isSpeaking || isAiReplying) {
      return {
        mood: 'speaking',
        collarColor: '#FB923C',
        eyeColor: '#38BDF8',
        badge: '正在温暖回应',
        glowRing: 'ring-cyan-400/40 shadow-cyan-950/60',
        bgBox: 'from-[#22130B] to-[#150B06] border-orange-500/35',
      };
    }
    return {
      mood: 'calm',
      collarColor: '#F97316',
      eyeColor: '#38BDF8',
      badge: '全程实时守护',
      glowRing: 'ring-orange-500/30 shadow-orange-950/50',
      bgBox: 'from-[#1C0F08] to-[#120804] border-orange-500/25',
    };
  };

  const moodInfo = getCatMood();

  if (compact) {
    // Compact avatar mode (for headers/badges)
    return (
      <div
        onClick={handlePet}
        className="relative cursor-pointer select-none group inline-block"
        title="轻触抚摸小猫"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600/40 to-orange-700/50 p-0.5 border border-orange-500/40 shadow-sm flex items-center justify-center relative overflow-hidden">
          {/* Mini Cat Face SVG */}
          <svg viewBox="0 0 100 100" className="w-8 h-8 drop-shadow">
            {/* Ears */}
            <polygon points="18,38 32,10 46,32" fill="#EA580C" />
            <polygon points="24,34 32,18 40,30" fill="#FDBA74" />
            <polygon points="54,32 68,10 82,38" fill="#EA580C" />
            <polygon points="60,30 68,18 76,34" fill="#FDBA74" />
            {/* Head */}
            <circle cx="50" cy="55" r="35" fill="#C2410C" />
            <ellipse cx="50" cy="62" rx="26" ry="20" fill="#EA580C" />
            <ellipse cx="50" cy="66" rx="16" ry="12" fill="#FFEDD5" />
            {/* Eyes */}
            {isBlinking ? (
              <>
                <path d="M 32 50 Q 38 52 44 50" stroke="#FFF" strokeWidth="3" strokeLinecap="round" fill="none" />
                <path d="M 56 50 Q 62 52 68 50" stroke="#FFF" strokeWidth="3" strokeLinecap="round" fill="none" />
              </>
            ) : (
              <>
                <ellipse cx="38" cy="50" rx="6" ry="7" fill={moodInfo.eyeColor} />
                <circle cx="40" cy="48" r="2.5" fill="#FFFFFF" />
                <ellipse cx="62" cy="50" rx="6" ry="7" fill={moodInfo.eyeColor} />
                <circle cx="64" cy="48" r="2.5" fill="#FFFFFF" />
              </>
            )}
            {/* Nose & Mouth */}
            <polygon points="47,60 53,60 50,63" fill="#F43F5E" />
            <path d="M 46 64 Q 50 67 54 64" stroke="#7C2D12" strokeWidth="2" fill="none" />
            {/* Collar */}
            <path d="M 30 84 Q 50 92 70 84" stroke={moodInfo.collarColor} strokeWidth="5" fill="none" />
            <circle cx="50" cy="88" r="4" fill="#FBBF24" />
          </svg>
        </div>
        {isSpeaking && (
          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-[9px] animate-pulse">
            🔊
          </span>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-3 rounded-2xl bg-gradient-to-b ${moodInfo.bgBox} border relative shadow-lg ${moodInfo.glowRing} transition-all duration-300 select-none`}
    >
      {/* Floating interactive hearts */}
      <AnimatePresence>
        {hearts.map((h) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 1, y: 0, scale: 0.8, x: h.x }}
            animate={{ opacity: 0, y: -45, scale: 1.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none text-rose-400 text-sm z-30 flex items-center gap-1 font-bold"
          >
            <span>❤️</span>
            <span className="text-[10px] text-amber-200">喵~</span>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="flex items-center justify-between gap-3">
        {/* Animated Interactive Cat Visual */}
        <div
          onClick={handlePet}
          className="relative cursor-pointer group shrink-0"
          title="点击摸摸小猫，获得温柔安抚"
        >
          {/* Subtle Breathing / Speaking Aura Rings */}
          <div
            className={`absolute -inset-1.5 rounded-full bg-gradient-to-tr from-orange-500/20 via-amber-400/20 to-rose-500/20 blur-md transition-all ${
              isSpeaking || isAiReplying ? 'animate-pulse scale-110 opacity-100' : 'opacity-60 group-hover:opacity-100'
            }`}
          />

          <motion.div
            animate={
              isPetted
                ? { y: [0, -6, 0, -3, 0], rotate: [0, -4, 4, 0] }
                : isSpeaking
                ? { y: [0, -2, 0, -2, 0], scale: [1, 1.03, 1] }
                : { y: [0, -2, 0] }
            }
            transition={{ repeat: isPetted ? 0 : Infinity, duration: isSpeaking ? 1.2 : 3, ease: 'easeInOut' }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-b from-[#31160C] to-[#1A0A04] border border-orange-500/30 p-1.5 flex items-center justify-center relative overflow-hidden shadow-inner active:scale-95 transition-transform"
          >
            {/* SVG Cat Character */}
            <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
              <defs>
                <linearGradient id="catFur" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F97316" />
                  <stop offset="60%" stopColor="#C2410C" />
                  <stop offset="100%" stopColor="#7C2D12" />
                </linearGradient>
                <linearGradient id="catEarInner" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FDA4AF" />
                  <stop offset="100%" stopColor="#FB7185" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="glow" />
                  <feComposite in="SourceGraphic" in2="glow" operator="over" />
                </filter>
              </defs>

              {/* Cat Ears */}
              <motion.polygon
                points="22,46 36,12 55,38"
                fill="url(#catFur)"
                animate={isPetted || guardState === 'SUSPICIOUS' ? { rotate: [-5, 5, -5] } : {}}
                style={{ originX: '36px', originY: '46px' }}
              />
              <polygon points="28,42 36,22 48,36" fill="url(#catEarInner)" />

              <motion.polygon
                points="65,38 84,12 98,46"
                fill="url(#catFur)"
                animate={isPetted || guardState === 'SUSPICIOUS' ? { rotate: [5, -5, 5] } : {}}
                style={{ originX: '84px', originY: '46px' }}
              />
              <polygon points="72,36 84,22 92,42" fill="url(#catEarInner)" />

              {/* Head Body Base */}
              <ellipse cx="60" cy="68" rx="42" ry="36" fill="url(#catFur)" />
              <ellipse cx="60" cy="74" rx="34" ry="26" fill="#EA580C" />
              {/* White muzzle cheeks */}
              <ellipse cx="60" cy="80" rx="22" ry="16" fill="#FFF7ED" />

              {/* Forehead Stripes */}
              <path d="M 60 42 L 60 52" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round" />
              <path d="M 52 45 L 48 53" stroke="#7C2D12" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 68 45 L 72 53" stroke="#7C2D12" strokeWidth="2.5" strokeLinecap="round" />

              {/* Whiskers */}
              <line x1="20" y1="76" x2="42" y2="78" stroke="#FED7AA" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="18" y1="84" x2="42" y2="82" stroke="#FED7AA" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="100" y1="76" x2="78" y2="78" stroke="#FED7AA" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="102" y1="84" x2="78" y2="82" stroke="#FED7AA" strokeWidth="1.5" strokeLinecap="round" />

              {/* Animated Eyes */}
              {isBlinking ? (
                <>
                  <path d="M 38 64 Q 46 68 54 64" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                  <path d="M 66 64 Q 74 68 82 64" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                </>
              ) : (
                <>
                  {/* Left Eye */}
                  <ellipse cx="46" cy="62" rx="8" ry="9.5" fill={moodInfo.eyeColor} />
                  <ellipse cx="46" cy="62" rx="4" ry="8" fill="#0F172A" />
                  <circle cx="48.5" cy="59" r="3.5" fill="#FFFFFF" />
                  <circle cx="43.5" cy="65" r="1.5" fill="#FFFFFF" />

                  {/* Right Eye */}
                  <ellipse cx="74" cy="62" rx="8" ry="9.5" fill={moodInfo.eyeColor} />
                  <ellipse cx="74" cy="62" rx="4" ry="8" fill="#0F172A" />
                  <circle cx="76.5" cy="59" r="3.5" fill="#FFFFFF" />
                  <circle cx="71.5" cy="65" r="1.5" fill="#FFFFFF" />
                </>
              )}

              {/* Cute Pink Nose */}
              <polygon points="56,74 64,74 60,78" fill="#F43F5E" />

              {/* Mouth */}
              {isSpeaking ? (
                <ellipse cx="60" cy="84" rx="4" ry="5" fill="#BE123C" />
              ) : (
                <path d="M 54 79 Q 60 84 66 79" stroke="#7C2D12" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              )}

              {/* Cute Blush */}
              <ellipse cx="34" cy="74" rx="5" ry="3" fill="#FB7185" opacity="0.6" />
              <ellipse cx="86" cy="74" rx="5" ry="3" fill="#FB7185" opacity="0.6" />

              {/* Collar & Golden Safety Bell */}
              <path d="M 34 102 Q 60 114 86 102" stroke={moodInfo.collarColor} strokeWidth="6" strokeLinecap="round" fill="none" />
              <circle cx="60" cy="110" r="5.5" fill="#FBBF24" filter="url(#glow)" />
              <circle cx="60" cy="111" r="1.5" fill="#78350F" />
            </svg>

            {/* Little tap-to-pet hint badge */}
            <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] text-amber-200/90 text-center py-0.2 backdrop-blur-xs font-medium">
              摸摸我🐾
            </div>
          </motion.div>
        </div>

        {/* Cat Dialog & Identity Info */}
        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center justify-between gap-1.5 mb-1">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-xs font-bold text-orange-200 flex items-center gap-1">
                <span>{name} (智能守护猫)</span>
                <Sparkles className="w-3 h-3 text-amber-400" />
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                {moodInfo.badge}
              </span>
            </div>

            {isSpeaking && (
              <div className="flex items-center gap-1 text-[10px] text-orange-300 bg-orange-500/20 px-2 py-0.5 rounded-full border border-orange-400/30 animate-pulse shrink-0">
                <Volume2 className="w-3 h-3 text-orange-300 animate-bounce" />
                <span>正在说话</span>
              </div>
            )}
          </div>

          {/* Current Status Dialogue Bubble */}
          <div className="p-2 rounded-xl bg-[#130905]/80 border border-orange-500/15 text-[11px] text-zinc-200 leading-relaxed shadow-sm relative">
            <p className="line-clamp-2">
              {petMessage ||
                (isAiReplying
                  ? '喵~ 正在为你细心研判路况与组织温暖话语...'
                  : guardState === 'SUSPICIOUS'
                  ? '小夜猫咪已进入高度警觉守护状态，紧盯周围风吹草动！'
                  : guardState === 'ANXIOUS'
                  ? '别紧张，我在呢。你可以摸摸我，或者我们一起拐去前面亮处。'
                  : '小夜正在全程陪伴你。当前步速适中、路线安全，随时对我说说话吧~')}
            </p>
          </div>

          {/* Interactive hints and sensor telemetry */}
          <div className="flex items-center justify-between mt-1.5 text-[9px] text-zinc-400 px-0.5">
            <span className="flex items-center gap-1">
              <Shield className="w-2.5 h-2.5 text-emerald-400" />
              <span>多模态视觉与听觉哨兵激活</span>
            </span>
            <span className="text-orange-400/80 font-mono">
              步速感知 {speed.toFixed(1)} km/h
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
