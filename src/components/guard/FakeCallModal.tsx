import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, PhoneOff, PhoneIncoming, Volume2, Mic, UserCheck, Shield } from 'lucide-react';
import { voiceEngine } from '../../services/voiceSynthesis';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CALL_SCRIPTS = [
  {
    speaker: '好朋友 (安安)',
    text: '喂！你快到了吗？我和老周已经在小区东门便利店门口等你了！',
    duration: 3500,
  },
  {
    speaker: '提示你回答',
    text: '（你可以回答：快啦，大概还有三四分钟就到东门了！）',
    duration: 2500,
  },
  {
    speaker: '好朋友 (安安)',
    text: '好嘞！车牌号我看你在群里发了，看见车我就走过来接你，路上注意安全哈！',
    duration: 4000,
  },
];

export const FakeCallModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [callStatus, setCallStatus] = useState<'RINGING' | 'CONNECTED' | 'ENDED'>('RINGING');
  const [scriptIndex, setScriptIndex] = useState(0);
  const [callTimer, setCallTimer] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCallStatus('RINGING');
      setScriptIndex(0);
      setCallTimer(0);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: any;
    if (callStatus === 'CONNECTED') {
      timer = setInterval(() => {
        setCallTimer((prev) => prev + 1);
      }, 1000);

      // Play current script
      if (scriptIndex < CALL_SCRIPTS.length) {
        const item = CALL_SCRIPTS[scriptIndex];
        if (item.speaker.includes('好朋友')) {
          voiceEngine.speak(item.text, '活泼朋友声');
        }

        const nextTimer = setTimeout(() => {
          setScriptIndex((prev) => prev + 1);
        }, item.duration);

        return () => {
          clearInterval(timer);
          clearTimeout(nextTimer);
        };
      }
    }
    return () => clearInterval(timer);
  }, [callStatus, scriptIndex]);

  const handleAnswer = () => {
    setCallStatus('CONNECTED');
  };

  const handleHangup = () => {
    voiceEngine.stop();
    setCallStatus('ENDED');
    setTimeout(() => {
      onClose();
    }, 400);
  };

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div id="fake-call-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-sm h-[560px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#120804] via-[#1A0C06] to-[#0A0402] border border-orange-500/30 shadow-2xl shadow-orange-950/50 flex flex-col justify-between p-6 text-white relative select-none"
      >
        {/* Top Header info */}
        <div className="text-center mt-4">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-500/15 text-orange-300 text-[10px] font-semibold border border-orange-500/30 mb-4">
            <Shield className="w-3 h-3 text-orange-400" />
            <span>Nights · 夜间防探拟真电话</span>
          </div>

          <div className="relative w-24 h-24 mx-auto mb-3">
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-orange-500 via-amber-500 to-rose-600 flex items-center justify-center text-4xl shadow-xl shadow-orange-500/30 border-2 border-orange-400/40">
              🌸
            </div>
            {callStatus === 'RINGING' && (
              <div className="absolute -inset-2 rounded-full border-2 border-orange-400/60 animate-ping" />
            )}
          </div>

          <h3 className="text-xl font-bold text-white tracking-tight">安安 (好朋友)</h3>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            {callStatus === 'RINGING' && '来电中...'}
            {callStatus === 'CONNECTED' && `通话中 ${formatTime(callTimer)}`}
            {callStatus === 'ENDED' && '通话已结束'}
          </p>
        </div>

        {/* Dynamic Connected Dialogue Box */}
        {callStatus === 'CONNECTED' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-2xl bg-[#1F1008] border border-orange-500/25 space-y-2 text-left shadow-sm"
          >
            <div className="flex items-center justify-between text-[11px] text-orange-300 font-semibold">
              <span className="flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                <span>实时模拟对白</span>
              </span>
              <span className="text-[10px] text-zinc-400">扬声器外放震慑</span>
            </div>

            <div className="text-xs text-zinc-200 leading-relaxed font-medium">
              {scriptIndex < CALL_SCRIPTS.length ? (
                <div>
                  <span className="font-bold text-amber-400">
                    {CALL_SCRIPTS[scriptIndex].speaker}：
                  </span>{' '}
                  “{CALL_SCRIPTS[scriptIndex].text}”
                </div>
              ) : (
                <div className="text-zinc-400 italic">
                  （已成功营造有朋友在路口接应氛围，如仍觉危险可一键SOS）
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Bottom Call Controls */}
        <div className="mb-2">
          {callStatus === 'RINGING' ? (
            <div className="flex items-center justify-around">
              {/* Decline Button */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handleHangup}
                  className="w-16 h-16 rounded-full bg-[#3D1010] hover:bg-[#4E1515] border border-rose-500/40 text-rose-300 flex items-center justify-center shadow-lg shadow-rose-950/50 active:scale-95 transition-all cursor-pointer"
                >
                  <PhoneOff className="w-7 h-7" />
                </button>
                <span className="text-xs text-zinc-400 font-medium">拒绝</span>
              </div>

              {/* Accept Button */}
              <div className="flex flex-col items-center gap-2">
                <button
                  id="btn-accept-fake-call"
                  onClick={handleAnswer}
                  className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/40 animate-bounce active:scale-95 transition-all cursor-pointer font-bold"
                >
                  <Phone className="w-7 h-7" />
                </button>
                <span className="text-xs text-emerald-400 font-bold">接听</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={handleHangup}
                className="w-16 h-16 rounded-full bg-[#3D1010] hover:bg-[#4E1515] border border-rose-500/40 text-rose-300 flex items-center justify-center shadow-lg shadow-rose-950/50 active:scale-95 transition-all cursor-pointer"
              >
                <PhoneOff className="w-7 h-7" />
              </button>
              <span className="text-xs text-zinc-400 font-medium">挂断电话</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
