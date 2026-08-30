import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Camera, X, ShieldAlert, Eye, Volume2, Sparkles, AlertCircle } from 'lucide-react';
import { CompanionConfig } from '../../types';
import { voiceEngine } from '../../services/voiceSynthesis';

interface Props {
  companion: CompanionConfig;
  isOpen: boolean;
  onClose: () => void;
  onEmergency: () => void;
}

export const VisualGuardModal: React.FC<Props> = ({
  companion,
  isOpen,
  onClose,
  onEmergency,
}) => {
  const [useRealCamera, setUseRealCamera] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Non-alarming AI companion voice prompt as prescribed in Section 7.3 & 8.2
  const aiMessage =
    '别担心，我在看着呢。后面那个人和我们走了一段了，我会继续帮你留意。';

  useEffect(() => {
    if (isOpen) {
      // Auto voice accompaniment
      setIsSpeaking(true);
      voiceEngine.speak(aiMessage, companion.voice, () => {
        setIsSpeaking(false);
      });

      // Try camera stream if permitted
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: { facingMode: 'environment' } })
          .then((stream) => {
            streamRef.current = stream;
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              setUseRealCamera(true);
            }
          })
          .catch(() => {
            // Fallback to simulated nocturnal street feed
            setCameraError(true);
            setUseRealCamera(false);
          });
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isOpen, companion.voice]);

  if (!isOpen) return null;

  return (
    <div id="visual-guard-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm rounded-3xl overflow-hidden bg-[#0C0603] border border-orange-500/30 shadow-2xl shadow-orange-950/40 flex flex-col relative"
      >
        {/* Top Header Badge */}
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-orange-500/30 text-xs font-semibold text-orange-400">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
            <span>视觉守护 · 正在观察</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/70 hover:bg-black/90 text-zinc-300 hover:text-white backdrop-blur-md border border-orange-500/25 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video / AR Camera Area */}
        <div className="relative w-full h-80 bg-[#070301] overflow-hidden flex items-center justify-center">
          {useRealCamera && !cameraError ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            // Simulated nocturnal street feed with moving elements
            <div className="w-full h-full relative bg-gradient-to-b from-[#0A0402] via-[#140804] to-[#1E0C06] flex flex-col justify-end p-4">
              {/* Street background graphics */}
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:16px_16px]" />
              
              {/* Street light glow */}
              <div className="absolute top-10 right-10 w-24 h-24 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-16 left-12 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Simulated Detected Person Box (AR Overaly) */}
              <div className="absolute top-20 right-16 w-28 h-36 border-2 border-amber-500/80 rounded-xl bg-amber-500/10 backdrop-blur-[1px] p-2 flex flex-col justify-between animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.25)]">
                <div className="flex items-center justify-between text-[9px] font-bold text-amber-300 bg-black/70 px-1 py-0.5 rounded">
                  <span>同行目标</span>
                  <span>相距 ~15m</span>
                </div>
                <div className="text-[9px] text-amber-200 bg-black/80 px-1 py-0.5 rounded text-center font-mono">
                  同向持续: 70米
                </div>
              </div>

              <div className="relative z-10 p-2.5 rounded-xl bg-black/75 backdrop-blur-md border border-orange-500/25 text-xs text-zinc-300 flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>AI 多模态环境检测：未发现直接攻击行为，保持观察</span>
              </div>
            </div>
          )}

          {/* Picture-in-Picture AI Companion Bubble */}
          <div className="absolute bottom-3 right-3 z-20 w-24 h-24 rounded-2xl bg-gradient-to-tr from-[#1E0C06]/95 to-[#2E1208]/95 backdrop-blur-md border border-orange-500/30 p-2 shadow-2xl flex flex-col items-center justify-center text-center">
            <div className="text-2xl mb-1 animate-bounce">
              {companion.avatar === 'avatar_night' && '🌌'}
              {companion.avatar === 'avatar_warm' && '🌸'}
              {companion.avatar === 'avatar_gentle' && '✨'}
              {companion.avatar === 'avatar_custom' && '💫'}
            </div>
            <div className="text-[10px] font-bold text-white truncate w-full">{companion.name}在陪你</div>
            <div className="text-[8px] text-orange-300 font-mono">连线中</div>
          </div>
        </div>

        {/* AI Dialogue Box (Strict Non-alarming Principle) */}
        <div className="p-4 space-y-3 bg-[#100704] border-t border-orange-500/20">
          <div className="p-3 rounded-2xl bg-[#1A0E08] border border-orange-500/25 flex items-start gap-2.5 shadow-sm">
            <div className="p-1.5 rounded-lg bg-orange-500/20 text-orange-300 shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-[11px] font-semibold text-orange-300 flex items-center gap-1.5">
                <span>{companion.name} 的轻柔提醒</span>
                {isSpeaking && <Volume2 className="w-3 h-3 text-orange-300 animate-pulse" />}
              </div>
              <p className="text-xs text-zinc-200 mt-1 leading-relaxed font-medium">
                “{aiMessage}”
              </p>
            </div>
          </div>

          {/* Safety Suggestions */}
          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>前方 280 米处有全家 24h 便利店，可随时转入避险。</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#1F120B] hover:bg-[#2C1910] text-zinc-200 border border-orange-500/20 text-xs font-semibold transition-all cursor-pointer"
            >
              关闭视频
            </button>

            <button
              onClick={onEmergency}
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-orange-500/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>需要帮助</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
