import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  ShieldAlert,
  Volume2,
  PhoneCall,
  Video,
  AlertOctagon,
  Send,
  Sparkles,
  MapPin,
  Clock,
  Footprints,
  Activity,
  CheckCircle2,
  ChevronUp,
  MessageCircle,
  HelpCircle,
  TrendingUp,
  Sliders,
  Car,
  Train,
  Bike
} from 'lucide-react';
import {
  CompanionConfig,
  TripConfig,
  GuardState,
  CompanionMode,
  ChatMessage,
  RiskFactors,
  SafetyMemory,
} from '../../types';
import { ROUTE_CHECKPOINTS } from '../../data/mockData';
import { voiceEngine } from '../../services/voiceSynthesis';
import { SmartCatCompanion } from './SmartCatCompanion';

interface Props {
  companion: CompanionConfig;
  trip: TripConfig;
  memories: SafetyMemory[];
  companionMode: CompanionMode;
  onCompanionModeChange: (mode: CompanionMode) => void;
  onOpenVisualGuard: () => void;
  onOpenFakeCall: () => void;
  onOpenSos: () => void;
  onArriveSafely: () => void;
  onStateChangeExternal?: (state: GuardState) => void;
}

export const GuardActiveScreen: React.FC<Props> = ({
  companion,
  trip,
  memories,
  companionMode,
  onCompanionModeChange,
  onOpenVisualGuard,
  onOpenFakeCall,
  onOpenSos,
  onArriveSafely,
  onStateChangeExternal,
}) => {
  // State Machine: NORMAL -> ANXIOUS -> SUSPICIOUS -> EMERGENCY
  const [guardState, setGuardState] = useState<GuardState>('NORMAL');

  // Checkpoint & Route Progress (0 - 100)
  const [checkpointIndex, setCheckpointIndex] = useState(1);
  const [progress, setProgress] = useState(25);
  const [minutesLeft, setMinutesLeft] = useState(15);
  const [distanceLeft, setDistanceLeft] = useState('0.9 km');

  // Telemetry: Speed & Risk Model Breakdown
  const [speed, setSpeed] = useState(1.2); // m/s
  const [riskFactors, setRiskFactors] = useState<RiskFactors>({
    userFeeling: 10,
    behaviorChange: 15,
    environment: 20,
    historyData: 10,
    totalScore: 13,
    currentSpeed: 1.2,
    isSpeedSpike: false,
    followingDetected: false,
  });

  // Chat & Speech Engine
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'agent',
      text: `${companion.name}正在陪伴你。当前路线状态安全，我一直在呢。`,
      timestamp: '22:02',
      riskLevel: 'LOW',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isAiReplying, setIsAiReplying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showRiskDetail, setShowRiskDetail] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync state to parent if needed
  useEffect(() => {
    if (onStateChangeExternal) {
      onStateChangeExternal(guardState);
    }
  }, [guardState, onStateChangeExternal]);

  // Recalculate Risk Index formula from Section 6.1
  // Risk = UserFeeling(60%) + Behavior(20%) + Environment(10%) + History(10%)
  const calculateTotalRisk = (
    uf: number,
    bc: number,
    env: number,
    hist: number
  ) => {
    const score = Math.round(uf * 0.6 + bc * 0.2 + env * 0.1 + hist * 0.1);
    return Math.min(100, Math.max(0, score));
  };

  const updateRisk = (updates: Partial<RiskFactors>) => {
    setRiskFactors((prev) => {
      const uf = updates.userFeeling !== undefined ? updates.userFeeling : prev.userFeeling;
      const bc = updates.behaviorChange !== undefined ? updates.behaviorChange : prev.behaviorChange;
      const env = updates.environment !== undefined ? updates.environment : prev.environment;
      const hist = updates.historyData !== undefined ? updates.historyData : prev.historyData;
      const total = calculateTotalRisk(uf, bc, env, hist);

      // Auto adjust state machine if needed
      if (total >= 70 && guardState !== 'EMERGENCY') {
        setGuardState('SUSPICIOUS');
      } else if (total >= 40 && guardState === 'NORMAL') {
        setGuardState('ANXIOUS');
      }

      return {
        ...prev,
        ...updates,
        totalScore: total,
      };
    });
  };

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiReplying]);

  // Handle User Message submission & AI response
  const handleSendMessage = async (textToSend?: string) => {
    const msg = (textToSend || inputText).trim();
    if (!msg || isAiReplying) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: msg,
      timestamp: new Date().toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsAiReplying(true);

    // Section 6.2 Keyword sentiment detection
    const lower = msg.toLowerCase();
    let detectedFeeling = riskFactors.userFeeling;

    if (
      lower.includes('害怕') ||
      lower.includes('有人跟着') ||
      lower.includes('救命') ||
      lower.includes('跟踪')
    ) {
      detectedFeeling = 85;
      setGuardState('SUSPICIOUS');
      updateRisk({ userFeeling: 85, followingDetected: true });
    } else if (
      lower.includes('怪怪') ||
      lower.includes('不舒服') ||
      lower.includes('有点怕') ||
      lower.includes('好黑')
    ) {
      detectedFeeling = 55;
      setGuardState('ANXIOUS');
      updateRisk({ userFeeling: 55 });
    } else if (
      lower.includes('累') ||
      lower.includes('下课') ||
      lower.includes('冷') ||
      lower.includes('到了')
    ) {
      detectedFeeling = 15;
      updateRisk({ userFeeling: 15 });
    }

    try {
      // Call Server Gemini API Endpoint
      const res = await fetch('/api/gemini/companion-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          companionName: companion.name,
          voiceStyle: companion.voice,
          personality: companion.personality,
          guardState: guardState,
          currentSpeed: speed,
          location: ROUTE_CHECKPOINTS[checkpointIndex]?.title || trip.departure,
          recentMemory: memories[0]?.note || '',
          transport: trip.transport,
        }),
      });

      const data = await res.json();
      const replyText = data.reply || '我在呢，路上别慌，我一直陪着你走回目的地。';

      const agentMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'agent',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        riskLevel: data.suggestedRisk || 'LOW',
      };

      setMessages((prev) => [...prev, agentMsg]);
      setIsAiReplying(false);

      // Speak response gently
      setIsSpeaking(true);
      voiceEngine.speak(replyText, companion.voice, () => {
        setIsSpeaking(false);
      });
    } catch (e) {
      console.warn('Chat request fallback:', e);
      const fallbackText = '我在呢，握紧手机，我一直陪着你。前方很快就到明亮街区了。';
      const agentMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'agent',
        text: fallbackText,
        timestamp: '22:04',
        riskLevel: 'LOW',
      };
      setMessages((prev) => [...prev, agentMsg]);
      setIsAiReplying(false);
      setIsSpeaking(true);
      voiceEngine.speak(fallbackText, companion.voice, () => {
        setIsSpeaking(false);
      });
    }
  };

  // Speed Slider change & Spike Detection (Section 6.3)
  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    const isSpike = newSpeed >= 1.7;
    const behaviorScore = isSpike ? 75 : Math.round(newSpeed * 15);
    updateRisk({
      currentSpeed: newSpeed,
      isSpeedSpike: isSpike,
      behaviorChange: behaviorScore,
    });

    if (isSpike && guardState === 'NORMAL') {
      setGuardState('ANXIOUS');
      // Prompt companion concern
      const alertMsg = '察觉到你的步速突然加快了，是遇到什么情况了吗？别害怕，我在呢。';
      setMessages((prev) => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          sender: 'agent',
          text: alertMsg,
          timestamp: new Date().toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          riskLevel: 'MEDIUM',
        },
      ]);
      voiceEngine.speak(alertMsg, companion.voice);
    }
  };

  // Advance Checkpoint
  const handleNextCheckpoint = () => {
    if (checkpointIndex < ROUTE_CHECKPOINTS.length - 1) {
      const nextIdx = checkpointIndex + 1;
      setCheckpointIndex(nextIdx);
      const cp = ROUTE_CHECKPOINTS[nextIdx];
      setProgress(cp.progress);
      setMinutesLeft(cp.minutesLeft);
      setDistanceLeft(cp.distanceLeft);

      // If reached memory spot (index 2)
      if (nextIdx === 2) {
        updateRisk({ historyData: 60 });
        const memAlert = '前方已进入学院南路中段（曾标记偏暗），小夜已为你加强专注守护。';
        setMessages((prev) => [
          ...prev,
          {
            id: `mem-${Date.now()}`,
            sender: 'agent',
            text: memAlert,
            timestamp: '22:08',
            riskLevel: 'MEDIUM',
          },
        ]);
        voiceEngine.speak(memAlert, companion.voice);
      }

      // If destination reached
      if (nextIdx === ROUTE_CHECKPOINTS.length - 1) {
        onArriveSafely();
      }
    } else {
      onArriveSafely();
    }
  };

  // State Badge info
  const getStateBadge = () => {
    switch (guardState) {
      case 'NORMAL':
        return {
          bg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
          dot: 'bg-emerald-400',
          text: '🟢 当前安全 · 正常陪伴',
        };
      case 'ANXIOUS':
        return {
          bg: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
          dot: 'bg-amber-400',
          text: '🟡 增强陪伴 · 风险关注',
        };
      case 'SUSPICIOUS':
        return {
          bg: 'bg-orange-500/20 border-orange-500/50 text-orange-300',
          dot: 'bg-orange-400',
          text: '🟠 风险确认 · 视觉守护建议',
        };
      case 'EMERGENCY':
        return {
          bg: 'bg-red-500/30 border-red-500/60 text-red-300',
          dot: 'bg-red-500 animate-ping',
          text: '🔴 紧急响应 · 正在联动',
        };
    }
  };

  const stateBadge = getStateBadge();
  const currentCheckpoint = ROUTE_CHECKPOINTS[checkpointIndex] || ROUTE_CHECKPOINTS[0];

  return (
    <div id="guard-active-screen" className="flex flex-col justify-between min-h-[580px] h-full bg-[#0A0502] text-white select-none relative overflow-hidden">
      {/* Top Header Guard Status Bar (Section 4.2) */}
      <div className="px-4 py-2.5 bg-[#120804]/95 backdrop-blur-md border-b border-orange-500/20 z-20">
        <div className="flex items-center justify-between mb-1.5">
          <div className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold flex items-center gap-1.5 ${stateBadge.bg}`}>
            <span className={`w-2 h-2 rounded-full ${stateBadge.dot}`} />
            <span>{stateBadge.text}</span>
          </div>

          {/* Companion Mini Floating Avatar */}
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-orange-500 via-amber-500 to-rose-600 flex items-center justify-center text-xs shadow-sm">
              {companion.avatar === 'avatar_cat' && '🐱'}
              {companion.avatar === 'avatar_night' && '🌌'}
              {companion.avatar === 'avatar_warm' && '🌸'}
              {companion.avatar === 'avatar_gentle' && '✨'}
              {companion.avatar === 'avatar_custom' && '💫'}
            </div>
            <span className="text-[11px] font-medium text-zinc-300">{companion.name}正在陪伴</span>
          </div>
        </div>

        {/* ETA & Distance */}
        <div className="flex items-center justify-between text-xs text-zinc-300">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span className="truncate">{currentCheckpoint.title}</span>
          </div>
          <div className="text-right shrink-0 font-medium">
            距离目的地：<strong className="text-orange-300">{minutesLeft}分钟</strong> ({distanceLeft})
          </div>
        </div>

        {/* Continuous Multi-Segment Stage Badges if multi-segment */}
        {trip.segments && trip.segments.length > 1 && (
          <div className="mt-2 pt-1.5 border-t border-orange-500/10 flex items-center justify-between gap-1 overflow-x-auto custom-scrollbar">
            {trip.segments.map((seg, idx) => {
              const SIcon = seg.transport === '步行' ? Footprints : seg.transport === '地铁' ? Train : seg.transport === '骑行' ? Bike : Car;
              // Determine if this segment is roughly active based on progress
              const segCount = trip.segments.length;
              const segProgressSpan = 100 / segCount;
              const currentSegIdx = Math.min(segCount - 1, Math.floor(progress / segProgressSpan));
              const isCurrent = idx === currentSegIdx;
              const isPassed = idx < currentSegIdx;

              return (
                <div
                  key={seg.id || idx}
                  className={`flex-1 min-w-[75px] py-1 px-1.5 rounded-lg border text-[9px] flex items-center gap-1 transition-all ${
                    isCurrent
                      ? 'bg-orange-500/25 border-orange-400 text-orange-200 font-bold shadow-xs'
                      : isPassed
                      ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300/80'
                      : 'bg-[#150B06] border-orange-500/10 text-zinc-500'
                  }`}
                >
                  <SIcon className="w-3 h-3 shrink-0" />
                  <span className="truncate">{idx + 1}.{seg.transport}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Interactive Progress Bar & Fast-forward simulator */}
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-orange-500/15">
            <div
              className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <button
            onClick={handleNextCheckpoint}
            title="模拟前行至下一路段"
            className="px-2 py-0.5 rounded bg-[#1C100B] hover:bg-[#2A150D] text-[10px] text-zinc-300 flex items-center gap-0.5 border border-orange-500/25 active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <span>下个路段</span>
            <TrendingUp className="w-2.5 h-2.5 text-orange-400" />
          </button>
        </div>
      </div>

      {/* Center Chat & Companion Voice Feed (Section 5) */}
      <div className="flex-1 overflow-y-auto px-4 py-2.5 space-y-2.5 custom-scrollbar z-10 text-left">
        {/* Visual AI Cat Companion Hero Widget */}
        <SmartCatCompanion
          name={companion.name}
          guardState={guardState}
          isSpeaking={isSpeaking}
          isAiReplying={isAiReplying}
          speed={speed}
          onPetCat={(reassuringText) => {
            setIsSpeaking(true);
            voiceEngine.speak(reassuringText, companion.voice, () => {
              setIsSpeaking(false);
            });
          }}
        />

        {/* Dynamic Safety AI Advice Pill (Section 9) */}
        {guardState === 'ANXIOUS' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-2.5 rounded-xl bg-[#1E1106] border border-amber-500/40 text-xs text-amber-200 flex items-start gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300">中风险安全建议：</span>{' '}
              前方 300 米有全家便利店，如果你觉得不舒服，我们可以先过去买瓶温水。
            </div>
          </motion.div>
        )}

        {guardState === 'SUSPICIOUS' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-2.5 rounded-xl bg-[#280F06] border border-orange-500/50 text-xs text-orange-200 flex items-start gap-2 shadow-sm"
          >
            <ShieldAlert className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-orange-300">环境异常感知：</span>{' '}
              建议点击下方【帮我确认环境】开启视觉守护，或直接进入附近明亮店铺。
            </div>
          </motion.div>
        )}

        {/* Chat History */}
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[84%] p-3 rounded-2xl text-xs leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-br-xs shadow-md shadow-orange-950/60'
                    : 'bg-[#150D08] text-zinc-100 rounded-bl-xs border border-orange-500/20 backdrop-blur-sm shadow-sm'
                }`}
              >
                {!isUser && (
                  <div className="text-[10px] font-bold text-orange-300 mb-0.5 flex items-center gap-1">
                    <span>{companion.name}</span>
                    {isSpeaking && <Volume2 className="w-2.5 h-2.5 text-orange-300 animate-bounce" />}
                  </div>
                )}
                <p>{m.text}</p>
              </div>
              <span className="text-[9px] text-zinc-500 mt-0.5 px-1">{m.timestamp}</span>
            </motion.div>
          );
        })}

        {isAiReplying && (
          <div className="flex items-center gap-1.5 text-xs text-orange-300/90 italic p-2">
            <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-400" />
            <span>{companion.name} 正在思考温暖回应...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Emotions & Scenarios Quick Tags */}
      <div className="px-3 pt-1 pb-1 bg-[#100704] border-t border-orange-500/10 z-10 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[10px] text-zinc-400 shrink-0">快捷情绪：</span>
        {[
          '今天上课好累呀',
          '感觉有点害怕…',
          '后面好像有人跟着',
          '帮我确认一下环境',
          '司机师傅在打探我',
        ].map((tag) => (
          <button
            key={tag}
            onClick={() => handleSendMessage(tag)}
            className="px-2.5 py-1 rounded-full bg-[#180E09] hover:bg-[#25150E] text-[10px] text-zinc-300 border border-orange-500/20 whitespace-nowrap active:scale-95 transition-all cursor-pointer"
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Real-time Telemetry & Risk Controller Drawer Toggle */}
      <div className="px-3 py-1.5 bg-[#120804] border-t border-orange-500/15 flex items-center justify-between text-xs text-zinc-400 z-10">
        <div className="flex items-center gap-3">
          {/* Speed Indicator & Interactive Slider */}
          <div className="flex items-center gap-1.5">
            <Footprints className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px]">步速：<strong className="text-white font-mono">{speed.toFixed(1)} m/s</strong></span>
          </div>

          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-[11px]">风险指数：<strong className="text-white font-mono">{riskFactors.totalScore}</strong></span>
          </div>
        </div>

        <button
          onClick={() => setShowRiskDetail(!showRiskDetail)}
          className="text-[11px] text-orange-300 hover:text-orange-200 flex items-center gap-1 cursor-pointer"
        >
          <Sliders className="w-3 h-3" />
          <span>{showRiskDetail ? '收起感知面板' : '风险感知模型'}</span>
          <ChevronUp className={`w-3 h-3 transition-transform ${showRiskDetail ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Expandable Risk Formula Sandbox (Section 6) */}
      <AnimatePresence>
        {showRiskDetail && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 py-3 bg-[#150A05] border-t border-orange-500/25 text-left text-xs z-20 space-y-2.5 overflow-hidden shadow-inner"
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-zinc-200">
              <span>Section 6.1 风险输入模型公式运算</span>
              <span className="text-orange-300 font-mono">
                {riskFactors.totalScore} = 感受({riskFactors.userFeeling}*0.6) + 行为({riskFactors.behaviorChange}*0.2) + 环境({riskFactors.environment}*0.1) + 记忆({riskFactors.historyData}*0.1)
              </span>
            </div>

            {/* Speed Simulation Slider */}
            <div>
              <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1">
                <span>实时步速模拟（测试 1.2m/s 正常 → 1.8m/s 突增）</span>
                <span className={speed >= 1.7 ? 'text-amber-400 font-bold' : 'text-zinc-300'}>
                  {speed >= 1.7 ? '⚠️ 步速突增判定：可能紧张' : '正常平稳步伐'}
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.1"
                value={speed}
                onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#25150E] rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            {/* State Machine Switcher */}
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="text-zinc-400">强制状态流转：</span>
              {(['NORMAL', 'ANXIOUS', 'SUSPICIOUS', 'EMERGENCY'] as GuardState[]).map((st) => (
                <button
                  key={st}
                  onClick={() => setGuardState(st)}
                  className={`px-2 py-0.5 rounded text-[10px] transition-all cursor-pointer ${
                    guardState === st ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold shadow-sm' : 'bg-[#22120A] text-zinc-400 border border-orange-500/20'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Safety Actions Dock & Chat Input (Section 7, 8, 10, 14, 15) */}
      <div className="p-3 bg-[#120804] border-t border-orange-500/20 z-20 space-y-2">
        {/* Chat Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="对小夜说说话，或者描述周围情况..."
            className="flex-1 px-3 py-2 rounded-xl bg-[#1C100B] border border-orange-500/25 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-orange-400"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isAiReplying}
            className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white disabled:opacity-40 transition-all cursor-pointer shrink-0 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Action Button Grid */}
        <div className="grid grid-cols-4 gap-1.5 pt-0.5">
          {/* Action 1: Visual Guard (Section 8) */}
          <button
            id="btn-trigger-visual-guard"
            onClick={onOpenVisualGuard}
            className="p-2 rounded-xl bg-[#1A0E08] hover:bg-[#25150E] border border-orange-500/30 text-orange-300 flex flex-col items-center gap-1 active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            <Video className="w-4 h-4 text-orange-400" />
            <span className="text-[10px] font-medium leading-tight">确认环境</span>
          </button>

          {/* Action 2: Fake Call (Section 10) */}
          <button
            id="btn-trigger-fake-call"
            onClick={onOpenFakeCall}
            className="p-2 rounded-xl bg-[#22120A] hover:bg-[#30180D] border border-amber-500/35 text-amber-300 flex flex-col items-center gap-1 active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            <PhoneCall className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-medium leading-tight">防探来电</span>
          </button>

          {/* Action 3: SOS Emergency (Section 14) */}
          <button
            id="btn-trigger-sos"
            onClick={onOpenSos}
            className="p-2 rounded-xl bg-[#2B0B0B] hover:bg-[#3D1010] border border-rose-500/50 text-rose-300 flex flex-col items-center gap-1 active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            <AlertOctagon className="w-4 h-4 text-rose-400 animate-pulse" />
            <span className="text-[10px] font-bold leading-tight">紧急求助</span>
          </button>

          {/* Action 4: Safe Arrival (Section 15) */}
          <button
            id="btn-trigger-arrive-safely"
            onClick={onArriveSafely}
            className="p-2 rounded-xl bg-[#0D2014] hover:bg-[#132E1D] border border-emerald-500/40 text-emerald-300 flex flex-col items-center gap-1 active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-bold leading-tight">安全到达</span>
          </button>
        </div>
      </div>
    </div>
  );
};
