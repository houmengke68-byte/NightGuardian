import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Sparkles, User, Heart, MessageSquare, ArrowRight, ArrowLeft } from 'lucide-react';
import { CompanionConfig, VoiceType, PersonalityType, AvatarType } from '../../types';
import { voiceEngine } from '../../services/voiceSynthesis';

interface Props {
  config: CompanionConfig;
  onChange: (config: CompanionConfig) => void;
  onNext: () => void;
  onBack: () => void;
}

const VOICE_OPTIONS: { type: VoiceType; label: string; desc: string; sample: string }[] = [
  {
    type: '温柔女性声',
    label: '温柔女性声',
    desc: '轻柔治愈、如冬日温水',
    sample: '辛苦啦，再走一会儿就到了，我在呢。',
  },
  {
    type: '活泼朋友声',
    label: '活泼朋友声',
    desc: '开朗亲切、像闺蜜挽手',
    sample: '今天下课挺准时嘛！走走走，我陪你聊着回宿舍！',
  },
  {
    type: '沉稳陪伴声',
    label: '沉稳陪伴声',
    desc: '坚定沉着、给足安全感',
    sample: '我在。保持正常步速，周围环境我一直在关注。',
  },
];

const PERSONALITY_OPTIONS: { type: PersonalityType; label: string; desc: string; badge: string }[] = [
  {
    type: '温柔安慰型',
    label: '温柔安慰型',
    desc: '敏锐察觉紧绷情绪，适时给予温柔抚慰',
    badge: '推荐',
  },
  {
    type: '简洁可靠型',
    label: '简洁可靠型',
    desc: '低频打扰，关键路口与风险点清晰提示',
    badge: '极简',
  },
  {
    type: '活泼聊天型',
    label: '活泼聊天型',
    desc: '主动开启轻松生活话题，驱散夜行孤单',
    badge: '解压',
  },
  {
    type: '成熟陪伴型',
    label: '成熟陪伴型',
    desc: '理性沉静，遇突发事件提供清晰避险建议',
    badge: '安心',
  },
];

const AVATAR_PRESETS: { type: AvatarType; name: string; bgGradient: string; glowColor: string; emoji: string }[] = [
  {
    type: 'avatar_cat',
    name: '小夜·智能守护喵',
    bgGradient: 'from-orange-500 via-amber-600 to-rose-700',
    glowColor: 'shadow-orange-500/40',
    emoji: '🐱',
  },
  {
    type: 'avatar_night',
    name: '小夜·夜空星语',
    bgGradient: 'from-indigo-600 via-purple-600 to-slate-900',
    glowColor: 'shadow-indigo-500/40',
    emoji: '🌌',
  },
  {
    type: 'avatar_warm',
    name: '安安·樱粉暖曦',
    bgGradient: 'from-rose-500 via-pink-600 to-amber-700',
    glowColor: 'shadow-rose-500/40',
    emoji: '🌸',
  },
  {
    type: 'avatar_gentle',
    name: '暖暖·月辉薄荷',
    bgGradient: 'from-emerald-500 via-teal-600 to-cyan-900',
    glowColor: 'shadow-teal-500/40',
    emoji: '✨',
  },
];

const NAME_RECOMMENDATIONS = ['小夜', '安安', '暖暖', '晴晴', '十一'];

export const CompanionSetupStep: React.FC<Props> = ({ config, onChange, onNext, onBack }) => {
  const [subStep, setSubStep] = useState<1 | 2 | 3 | 4>(1);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);

  const handlePlayVoice = (voiceType: VoiceType, sample: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPlayingVoice(voiceType);
    voiceEngine.speak(sample, voiceType, () => {
      setPlayingVoice(null);
    });
  };

  return (
    <div id="companion-setup-container" className="flex flex-col justify-between min-h-[580px] h-full px-5 py-6 bg-[#0C0603] text-white select-none relative overflow-hidden">
      {/* Top Header & Sub-step Progress */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              if (subStep > 1) {
                setSubStep((prev) => (prev - 1) as any);
              } else {
                onBack();
              }
            }}
            className="p-2 rounded-xl bg-[#1A0E08] hover:bg-[#25150E] text-zinc-300 border border-orange-500/20 active:scale-95 transition-all cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  subStep === step
                    ? 'w-6 bg-orange-400 shadow-sm shadow-orange-500/50'
                    : subStep > step
                    ? 'w-3 bg-emerald-400/80'
                    : 'w-2 bg-zinc-800'
                }`}
              />
            ))}
          </div>

          <span className="text-[11px] font-semibold text-orange-300/90 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/25 shadow-sm">
            Step 2 / 4
          </span>
        </div>

        <div className="text-left mb-4">
          <div className="text-[11px] font-medium text-orange-400/80 uppercase tracking-wider">
            {subStep === 1 && '情感建立 ① · 选择声音 (P0)'}
            {subStep === 2 && '情感建立 ② · 设置说话方式 (P0)'}
            {subStep === 3 && '陪伴形象 ③ · 视觉呈现 (P1)'}
            {subStep === 4 && '专属昵称 ④ · 命名陪伴者'}
          </div>
          <h2 className="text-lg font-bold text-white mt-1">
            {subStep === 1 && '“你希望我用怎样的声音陪伴你？”'}
            {subStep === 2 && '“你更喜欢怎样的陪伴交流感？”'}
            {subStep === 3 && '“为你的守护者挑选一个形象”'}
            {subStep === 4 && '“你希望怎么称呼我呢？”'}
          </h2>
        </div>
      </div>

      {/* Dynamic Content by Sub-step */}
      <div className="flex-1 overflow-y-auto py-1 pr-1 custom-scrollbar">
        <AnimatePresence mode="wait">
          {/* Sub-step 1: Voice Selection */}
          {subStep === 1 && (
            <motion.div
              key="substep-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              {VOICE_OPTIONS.map((item) => {
                const isSelected = config.voice === item.type;
                const isPlaying = playingVoice === item.type;
                return (
                  <div
                    key={item.type}
                    onClick={() => onChange({ ...config, voice: item.type })}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-[#22120A] border-orange-500 shadow-lg shadow-orange-950/60 ring-1 ring-orange-500/40'
                        : 'bg-[#140C08] border-orange-500/15 hover:bg-[#1C100B] hover:border-orange-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/30'
                              : 'bg-white/10 text-zinc-300'
                          }`}
                        >
                          <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-bounce' : ''}`} />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white flex items-center gap-2">
                            <span>{item.label}</span>
                            {isSelected && (
                              <span className="text-[10px] bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full border border-orange-500/30">
                                当前选中
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-zinc-400 mt-0.5">{item.desc}</div>
                        </div>
                      </div>

                      {/* Play Preview Button */}
                      <button
                        onClick={(e) => handlePlayVoice(item.type, item.sample, e)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                          isPlaying
                            ? 'bg-orange-500 text-white border-orange-400 shadow-md shadow-orange-500/40 animate-pulse'
                            : 'bg-white/10 text-zinc-200 border-white/15 hover:bg-white/20'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{isPlaying ? '试听中...' : '试听'}</span>
                      </button>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-white/5 text-[11px] text-zinc-300/80 italic">
                      “{item.sample}”
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* Sub-step 2: Personality Mode */}
          {subStep === 2 && (
            <motion.div
              key="substep-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-2.5"
            >
              {PERSONALITY_OPTIONS.map((item) => {
                const isSelected = config.personality === item.type;
                return (
                  <div
                    key={item.type}
                    onClick={() => onChange({ ...config, personality: item.type })}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#22120A] border-amber-500 shadow-lg shadow-amber-950/60 ring-1 ring-amber-500/40'
                        : 'bg-[#140C08] border-orange-500/15 hover:bg-[#1C100B] hover:border-orange-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                            isSelected ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white' : 'bg-white/10 text-zinc-300'
                          }`}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <div className="text-sm font-semibold text-white">{item.label}</div>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          isSelected
                            ? 'bg-amber-500/25 text-amber-200 border border-amber-500/40'
                            : 'bg-white/10 text-zinc-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 mt-2 pl-10.5 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* Sub-step 3: Avatar Selection */}
          {subStep === 3 && (
            <motion.div
              key="substep-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 text-center"
            >
              <div className="grid grid-cols-2 gap-2.5">
                {AVATAR_PRESETS.map((preset) => {
                  const isSelected = config.avatar === preset.type;
                  return (
                    <div
                      key={preset.type}
                      onClick={() => onChange({ ...config, avatar: preset.type })}
                      className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                        isSelected
                          ? `bg-[#22120A] border-orange-400 shadow-xl shadow-orange-950/80 scale-[1.02] ring-1 ring-orange-400/50`
                          : 'bg-[#140C08] border-orange-500/15 hover:bg-[#1C100B]'
                      }`}
                    >
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${preset.bgGradient} flex items-center justify-center text-2xl shadow-inner relative`}
                      >
                        <span>{preset.emoji}</span>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-zinc-950 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-zinc-200 truncate w-full text-center">
                        {preset.name.split('·')[0]}
                      </div>
                      <div className="text-[10px] text-zinc-400 truncate w-full">
                        {preset.name.split('·')[1]}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 rounded-xl bg-[#160D08] border border-orange-500/20 text-left flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-zinc-300 leading-relaxed">
                  形象将在夜间守护主界面以小巧动态灵动岛/悬浮窗常驻，在视觉守护模式下作为虚拟视频伙伴陪伴在身旁。
                </p>
              </div>
            </motion.div>
          )}

          {/* Sub-step 4: Name Setup */}
          {subStep === 4 && (
            <motion.div
              key="substep-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center my-2">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-orange-500 via-amber-500 to-rose-600 flex items-center justify-center text-3xl shadow-xl shadow-orange-500/20 mb-3 border border-orange-400/30">
                  {config.avatar === 'avatar_cat' && '🐱'}
                  {config.avatar === 'avatar_night' && '🌌'}
                  {config.avatar === 'avatar_warm' && '🌸'}
                  {config.avatar === 'avatar_gentle' && '✨'}
                  {config.avatar === 'avatar_custom' && '💫'}
                </div>
                <div className="text-xs text-orange-300 font-medium">输入你最习惯呼唤的专属昵称</div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">陪伴者名称</label>
                <div className="relative">
                  <input
                    id="input-companion-name"
                    type="text"
                    value={config.name}
                    onChange={(e) => onChange({ ...config, name: e.target.value })}
                    maxLength={10}
                    placeholder="输入名字，如 小夜"
                    className="w-full px-4 py-3 rounded-xl bg-[#180E09] border border-orange-500/25 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 text-sm font-medium"
                  />
                  <User className="w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <div className="text-xs font-medium text-zinc-400 mb-2">推荐昵称：</div>
                <div className="flex flex-wrap gap-2">
                  {NAME_RECOMMENDATIONS.map((name) => (
                    <button
                      key={name}
                      onClick={() => onChange({ ...config, name })}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                        config.name === name
                          ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/30'
                          : 'bg-[#180E09] text-zinc-300 hover:bg-[#25150E] border border-orange-500/15'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#160D08] border border-orange-500/20 text-xs text-zinc-300 flex items-center gap-2">
                <Heart className="w-4 h-4 text-orange-400 shrink-0" />
                <span>
                  你将拥有属于你的 <strong className="text-orange-300">{config.name || '小夜'}</strong>，用【{config.voice}】和【{config.personality}】守护你。
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Action */}
      <div className="mt-4 pt-3 border-t border-orange-500/15 flex items-center justify-between gap-3">
        <button
          onClick={() => {
            if (subStep > 1) {
              setSubStep((prev) => (prev - 1) as any);
            } else {
              onBack();
            }
          }}
          className="py-3 px-4 rounded-xl bg-[#180E09] hover:bg-[#25150E] text-zinc-300 border border-orange-500/20 text-xs font-medium transition-all cursor-pointer"
        >
          上一步
        </button>

        <button
          id="btn-companion-setup-next"
          onClick={() => {
            if (subStep < 4) {
              setSubStep((prev) => (prev + 1) as any);
            } else {
              onNext();
            }
          }}
          className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 text-white font-semibold text-xs shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer ring-1 ring-orange-400/30"
        >
          <span>{subStep === 4 ? '完成并设置常用出行' : '下一步'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
