import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AlertOctagon, PhoneCall, Send, ShieldAlert, X, MapPin, Check, Volume2 } from 'lucide-react';
import { TripConfig } from '../../types';

interface Props {
  trip: TripConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const SosModal: React.FC<Props> = ({ trip, isOpen, onClose }) => {
  const [alarmActive, setAlarmActive] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const toggleAlarm = () => {
    if (!alarmActive) {
      setAlarmActive(true);
      // Generate sharp safety buzzer tone using Web Audio API
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(ctx);
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        (osc as any)._customOsc = true;
      } catch (e) {
        console.warn('Audio tone err:', e);
      }
    } else {
      setAlarmActive(false);
      if (audioContext) {
        audioContext.close();
        setAudioContext(null);
      }
    }
  };

  const handleSendContactSms = () => {
    setSmsSent(true);
  };

  if (!isOpen) return null;

  return (
    <div id="sos-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-sm rounded-3xl overflow-hidden bg-[#0F0503] border border-rose-500/60 shadow-2xl shadow-rose-950/60 p-5 text-white flex flex-col justify-between relative"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <AlertOctagon className="w-5 h-5 animate-bounce text-rose-500" />
            <span>Nights · 紧急安全响应 (SOS)</span>
          </div>

          <button
            onClick={() => {
              if (alarmActive && audioContext) {
                audioContext.close();
              }
              onClose();
            }}
            className="p-1.5 rounded-full bg-[#1F1008] hover:bg-[#2F180C] text-zinc-300 border border-orange-500/25 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Grid */}
        <div className="space-y-3.5 my-2">
          {/* Action 1: High Decibel Alarm */}
          <div className="p-3.5 rounded-2xl bg-[#200806] border border-rose-500/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  alarmActive ? 'bg-rose-500 text-white animate-ping' : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">高分贝避险警报</div>
                <div className="text-[11px] text-zinc-400">持续鸣响震慑威胁、引起周围注意</div>
              </div>
            </div>
            <button
              onClick={toggleAlarm}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                alarmActive
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/50'
                  : 'bg-[#30100C] text-zinc-200 hover:bg-[#451610] border border-rose-500/30'
              }`}
            >
              {alarmActive ? '关闭警报' : '开启鸣响'}
            </button>
          </div>

          {/* Action 2: Emergency Contact Dispatch */}
          <div className="p-3.5 rounded-2xl bg-[#170C07] border border-orange-500/25 space-y-2 text-left shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-200">
              <span className="flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-orange-400" />
                <span>紧急联系人联动 (妈妈 / 室友)</span>
              </span>
              {smsSent && (
                <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-emerald-500/30">
                  <Check className="w-3 h-3" /> 已模拟发送
                </span>
              )}
            </div>

            {/* Generated SMS Card Preview */}
            <div className="p-2.5 rounded-xl bg-black/60 border border-orange-500/20 text-[11px] text-zinc-300 font-mono leading-relaxed">
              <div className="text-rose-400 font-bold mb-0.5">【Nights 安全提醒】</div>
              <div>用户当前夜间出行遇到异常，需要关注与接应！</div>
              <div className="text-zinc-400 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-orange-400" />
                <span>位置：{trip.departure} → {trip.destination} (学院南路中段)</span>
              </div>
              <div className="text-zinc-500 text-[10px] mt-0.5">时间：22:38 · 实时轨迹持续共享中</div>
            </div>

            <button
              onClick={handleSendContactSms}
              disabled={smsSent}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 text-white text-xs font-bold shadow-md shadow-orange-500/25 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
            >
              {smsSent ? '已向紧急联系人发送求助信息与定位' : '一键发送求助短信与实时位置'}
            </button>
          </div>

          {/* Action 3: Quick 110 Call simulation */}
          <div className="p-3 rounded-2xl bg-[#140804] border border-orange-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs font-mono">
                110
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white">官方紧急报警</div>
                <div className="text-[10px] text-zinc-400">已备好当前GPS经纬度与路段</div>
              </div>
            </div>
            <a
              href="tel:110"
              onClick={(e) => {
                e.preventDefault();
                alert('【演示模式】已准备好一键连线当地 110 指挥中心并提供当前坐标。');
              }}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1 cursor-pointer"
            >
              <PhoneCall className="w-3 h-3" />
              <span>快速拨号</span>
            </a>
          </div>
        </div>

        {/* Immediate Safe Action Guidance */}
        <div className="p-2.5 rounded-xl bg-[#0D1F13] border border-emerald-500/30 text-left text-[11px] text-emerald-300 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>安全避险提示：请尽快快步走向前方 80 米全家便利店或有人流的明亮区域。</span>
        </div>
      </motion.div>
    </div>
  );
};
