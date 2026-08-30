import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Camera, Mic, ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { PermissionsState } from '../../types';

interface Props {
  permissions: PermissionsState;
  onChange: (permissions: PermissionsState) => void;
  onComplete: () => void;
  onBack: () => void;
}

export const PermissionStep: React.FC<Props> = ({ permissions, onChange, onComplete, onBack }) => {
  const togglePermission = (key: keyof PermissionsState) => {
    onChange({
      ...permissions,
      [key]: !permissions[key],
    });
  };

  const handleGrantAll = () => {
    onChange({
      gps: true,
      camera: true,
      microphone: true,
    });
  };

  const allGranted = permissions.gps && permissions.camera && permissions.microphone;

  return (
    <div id="permission-step-container" className="flex flex-col justify-between min-h-[580px] h-full px-5 py-6 bg-[#0C0603] text-white select-none relative overflow-hidden">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-[#1A0E08] hover:bg-[#25150E] text-zinc-300 border border-orange-500/20 active:scale-95 transition-all cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-semibold text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-sm">
            Step 4 / 4 · 守护权限
          </span>
        </div>

        <div className="text-left mb-4">
          <div className="text-[11px] font-medium text-orange-400/80 uppercase tracking-wider">安全守护权限授权</div>
          <h2 className="text-lg font-bold text-white mt-1">仅在守护时使用，绝不后台窥探</h2>
          <p className="text-xs text-zinc-400 mt-1">Nights 遵循隐私保护第一原则，所有环境数据端侧脱敏。</p>
        </div>
      </div>

      {/* Permissions List */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar"
      >
        {/* GPS Permission */}
        <div
          onClick={() => togglePermission('gps')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
            permissions.gps
              ? 'bg-[#122418] border-emerald-500/60 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500/30'
              : 'bg-[#140C08] border-orange-500/15 hover:bg-[#1C100B]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                permissions.gps ? 'bg-emerald-500 text-zinc-950 font-bold' : 'bg-white/10 text-zinc-300'
              }`}
            >
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>位置信息 (GPS)</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded font-normal">
                  核心基石
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                用途：判断实时路线、偏航、暗路风险区与安全到达检测
              </div>
            </div>
          </div>
          <div className="shrink-0 pl-2">
            {permissions.gps ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <div className="w-5 h-5 rounded-full border border-zinc-600" />
            )}
          </div>
        </div>

        {/* Camera Permission */}
        <div
          onClick={() => togglePermission('camera')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
            permissions.camera
              ? 'bg-[#122418] border-emerald-500/60 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500/30'
              : 'bg-[#140C08] border-orange-500/15 hover:bg-[#1C100B]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                permissions.camera ? 'bg-emerald-500 text-zinc-950 font-bold' : 'bg-white/10 text-zinc-300'
              }`}
            >
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>摄像头 (视觉守护)</span>
                <span className="text-[10px] text-orange-300 bg-orange-500/20 px-1.5 py-0.2 rounded font-normal">
                  主动触发
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                用途：仅在用户主动点击“帮我确认环境”时开启视觉同行分析
              </div>
            </div>
          </div>
          <div className="shrink-0 pl-2">
            {permissions.camera ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <div className="w-5 h-5 rounded-full border border-zinc-600" />
            )}
          </div>
        </div>

        {/* Microphone Permission */}
        <div
          onClick={() => togglePermission('microphone')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
            permissions.microphone
              ? 'bg-[#122418] border-emerald-500/60 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500/30'
              : 'bg-[#140C08] border-orange-500/15 hover:bg-[#1C100B]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                permissions.microphone ? 'bg-emerald-500 text-zinc-950 font-bold' : 'bg-white/10 text-zinc-300'
              }`}
            >
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>麦克风 (语音陪伴)</span>
                <span className="text-[10px] text-amber-300 bg-amber-500/20 px-1.5 py-0.2 rounded font-normal">
                  自然交流
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                用途：AI语音连线、情绪语调分析与危急语音暗语识别
              </div>
            </div>
          </div>
          <div className="shrink-0 pl-2">
            {permissions.microphone ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <div className="w-5 h-5 rounded-full border border-zinc-600" />
            )}
          </div>
        </div>

        {!allGranted && (
          <button
            onClick={handleGrantAll}
            className="w-full py-2.5 rounded-xl bg-[#1A0E08] hover:bg-[#25150E] text-xs text-orange-300 font-medium transition-all cursor-pointer border border-orange-500/30"
          >
            一键授予全部守护权限
          </button>
        )}
      </motion.div>

      {/* Bottom Button */}
      <div className="mt-4 pt-3 border-t border-orange-500/15 flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="py-3 px-4 rounded-xl bg-[#180E09] hover:bg-[#25150E] text-zinc-300 border border-orange-500/20 text-xs font-medium transition-all cursor-pointer"
        >
          上一步
        </button>

        <button
          id="btn-complete-onboarding"
          onClick={onComplete}
          className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 hover:from-orange-400 hover:to-emerald-400 text-zinc-950 font-bold text-xs shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer ring-1 ring-orange-400/30"
        >
          <ShieldCheck className="w-4 h-4 text-zinc-950" />
          <span>进入 Nights 守护首页</span>
          <ArrowRight className="w-4 h-4 text-zinc-950" />
        </button>
      </div>
    </div>
  );
};
