import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Navigation,
  Clock,
  Footprints,
  Bike,
  Train,
  Car,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Layers,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { TripConfig, TransportType, TripSegment } from '../../types';
import { MULTI_SEGMENT_PRESETS } from '../../data/mockData';

interface Props {
  config: TripConfig;
  onChange: (config: TripConfig) => void;
  onNext: () => void;
  onBack: () => void;
}

const TRANSPORTS: { type: TransportType; icon: any; label: string; desc: string; defaultHint: string }[] = [
  { type: '步行', icon: Footprints, label: '步行', desc: '暗路照明·步速感知', defaultHint: '暗路照明感知 · 闺蜜对话' },
  { type: '地铁', icon: Train, label: '地铁', desc: '进出站·静默待命', defaultHint: '进出站引导 · 静默后台待命' },
  { type: '骑行', icon: Bike, label: '骑行', desc: '车速与偏航监控', defaultHint: '偏航与夜行车速监控' },
  { type: '打车', icon: Car, label: '打车', desc: '路线监控·防探来电', defaultHint: '路线偏航监控 · 防探来电' },
];

export const TripSetupStep: React.FC<Props> = ({ config, onChange, onNext, onBack }) => {
  const [activeTab, setActiveTab] = useState<'multi' | 'single'>(config.isMultiSegment ? 'multi' : 'multi');

  // Ensure default segments exist
  const segments: TripSegment[] = config.segments && config.segments.length > 0
    ? config.segments
    : [
        {
          id: 'seg-1',
          order: 1,
          fromName: config.departure || '新东方(中关村校区)',
          toName: '海淀黄庄地铁站A口',
          transport: '步行',
          estimatedMinutes: 6,
          strategyHint: '暗路照明感知 · 闺蜜对话陪伴',
        },
        {
          id: 'seg-2',
          order: 2,
          fromName: '海淀黄庄地铁站',
          toName: '魏公村地铁站B口',
          transport: '地铁',
          estimatedMinutes: 12,
          strategyHint: '进出站引导 · 静默后台待命',
        },
        {
          id: 'seg-3',
          order: 3,
          fromName: '魏公村地铁站B口',
          toName: config.destination || '学校(宿舍3号楼)',
          transport: '骑行',
          estimatedMinutes: 8,
          strategyHint: '偏航与车速监控 · 尾随研判',
        },
      ];

  const totalMinutes = segments.reduce((sum, s) => sum + (s.estimatedMinutes || 5), 0);

  // Apply a preset
  const handleApplyPreset = (preset: typeof MULTI_SEGMENT_PRESETS[0]) => {
    const updatedSegments: TripSegment[] = preset.segments.map((p, idx) => ({
      id: `seg-${Date.now()}-${idx}`,
      order: p.order,
      fromName: idx === 0 ? config.departure || p.fromName : p.fromName,
      toName: idx === preset.segments.length - 1 ? config.destination || p.toName : p.toName,
      transport: p.transport,
      estimatedMinutes: p.estimatedMinutes,
      strategyHint: p.strategyHint,
    }));

    const nextDep = updatedSegments[0]?.fromName || config.departure;
    const nextDest = updatedSegments[updatedSegments.length - 1]?.toName || config.destination;
    const nextTransports = Array.from(new Set(updatedSegments.map((s) => s.transport)));
    const totalEst = updatedSegments.reduce((sum, s) => sum + s.estimatedMinutes, 0);

    onChange({
      ...config,
      departure: nextDep,
      destination: nextDest,
      segments: updatedSegments,
      transports: nextTransports,
      transport: nextTransports[0] || '步行',
      estimatedMinutes: totalEst,
      isMultiSegment: updatedSegments.length > 1,
    });
  };

  // Update a specific segment
  const handleUpdateSegment = (id: string, updates: Partial<TripSegment>) => {
    const nextSegments = segments.map((seg) => {
      if (seg.id === id) {
        const next = { ...seg, ...updates };
        if (updates.transport && !updates.strategyHint) {
          const tInfo = TRANSPORTS.find((t) => t.type === updates.transport);
          next.strategyHint = tInfo?.defaultHint || '';
        }
        return next;
      }
      return seg;
    });

    const nextDep = nextSegments[0]?.fromName || config.departure;
    const nextDest = nextSegments[nextSegments.length - 1]?.toName || config.destination;
    const nextTransports = Array.from(new Set(nextSegments.map((s) => s.transport)));
    const totalEst = nextSegments.reduce((sum, s) => sum + (s.estimatedMinutes || 5), 0);

    onChange({
      ...config,
      departure: nextDep,
      destination: nextDest,
      segments: nextSegments,
      transports: nextTransports,
      transport: nextTransports[0] || '步行',
      estimatedMinutes: totalEst,
    });
  };

  // Add a new segment
  const handleAddSegment = () => {
    const lastSeg = segments[segments.length - 1];
    const newSeg: TripSegment = {
      id: `seg-${Date.now()}`,
      order: segments.length + 1,
      fromName: lastSeg ? lastSeg.toName : '换乘中转点',
      toName: config.destination || '学校(宿舍)',
      transport: '骑行',
      estimatedMinutes: 6,
      strategyHint: '偏航与夜行车速监控',
    };
    const nextSegments = [...segments, newSeg];
    const nextTransports = Array.from(new Set(nextSegments.map((s) => s.transport)));
    const totalEst = nextSegments.reduce((sum, s) => sum + s.estimatedMinutes, 0);

    onChange({
      ...config,
      segments: nextSegments,
      transports: nextTransports,
      estimatedMinutes: totalEst,
      isMultiSegment: true,
    });
  };

  // Remove a segment
  const handleRemoveSegment = (id: string) => {
    if (segments.length <= 1) return;
    const nextSegments = segments
      .filter((s) => s.id !== id)
      .map((s, idx) => ({ ...s, order: idx + 1 }));

    const nextDep = nextSegments[0]?.fromName || config.departure;
    const nextDest = nextSegments[nextSegments.length - 1]?.toName || config.destination;
    const nextTransports = Array.from(new Set(nextSegments.map((s) => s.transport)));
    const totalEst = nextSegments.reduce((sum, s) => sum + (s.estimatedMinutes || 5), 0);

    onChange({
      ...config,
      departure: nextDep,
      destination: nextDest,
      segments: nextSegments,
      transports: nextTransports,
      transport: nextTransports[0] || '步行',
      estimatedMinutes: totalEst,
      isMultiSegment: nextSegments.length > 1,
    });
  };

  const getTransportIcon = (type: TransportType) => {
    switch (type) {
      case '步行':
        return Footprints;
      case '地铁':
        return Train;
      case '骑行':
        return Bike;
      case '打车':
        return Car;
      default:
        return Footprints;
    }
  };

  return (
    <div id="trip-setup-container" className="flex flex-col justify-between min-h-[580px] h-full px-4.5 py-4 bg-[#0C0603] text-white select-none relative overflow-hidden">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <button
            onClick={onBack}
            className="p-1.5 rounded-xl bg-[#1A0E08] hover:bg-[#25150E] text-zinc-300 border border-orange-500/20 active:scale-95 transition-all cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-[10px] font-semibold text-orange-300/90 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/25 shadow-sm">
            Step 3 / 4 · 全过程出行设置
          </span>
        </div>

        <div className="text-left mb-2">
          <div className="text-[10px] font-medium text-orange-400/80 uppercase tracking-wider">常用路线与全过程守护</div>
          <h2 className="text-base font-bold text-white mt-0.5">设置你最常走的晚归路线</h2>
          <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
            支持<strong className="text-orange-300 font-semibold">连续多段出行</strong>（如：先步行到地铁站 ➔ 乘地铁 ➔ 出站骑行回校），Nights 将全过程分段接力守护。
          </p>
        </div>

        {/* Mode Switch Tabs */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#140A06] rounded-xl border border-orange-500/15 mb-2.5">
          <button
            type="button"
            onClick={() => {
              setActiveTab('multi');
              onChange({ ...config, isMultiSegment: true });
            }}
            className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'multi'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>连续多段出行 (推荐)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('single');
              onChange({ ...config, isMultiSegment: false });
            }}
            className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'single'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>单一快捷路线</span>
          </button>
        </div>
      </div>

      {/* Form Fields / Content */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 space-y-2.5 overflow-y-auto pr-1 custom-scrollbar text-left"
      >
        {activeTab === 'multi' ? (
          <>
            {/* Quick Continuous Presets */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] text-zinc-300 font-medium">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>快捷选择常用连续出行模板：</span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {MULTI_SEGMENT_PRESETS.slice(0, 2).map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="p-2 rounded-xl bg-[#170C07] hover:bg-[#22120A] border border-orange-500/20 text-left transition-all active:scale-98 cursor-pointer group"
                  >
                    <div className="text-[11px] font-bold text-orange-200 group-hover:text-orange-300 line-clamp-1">
                      {preset.title.split(' ')[0]}
                    </div>
                    <div className="text-[9px] text-zinc-400 line-clamp-1 mt-0.5">{preset.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Continuous Segments Chain Builder */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                  <span>连续通勤各阶段守护链 ({segments.length} 段)</span>
                </span>
                <span className="text-[10px] text-orange-300 bg-orange-500/15 px-2 py-0.5 rounded-full border border-orange-500/25">
                  预计全程 {totalMinutes} 分钟
                </span>
              </div>

              {/* Segments Cards */}
              <div className="space-y-2">
                <AnimatePresence initial={false}>
                  {segments.map((seg, idx) => {
                    return (
                      <motion.div
                        key={seg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-2.5 rounded-2xl bg-[#140C08] border border-orange-500/25 relative shadow-sm"
                      >
                        {/* Segment Top Bar */}
                        <div className="flex items-center justify-between pb-1.5 border-b border-orange-500/15 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-4.5 h-4.5 rounded-full bg-gradient-to-tr from-orange-500 to-amber-600 text-[10px] font-bold flex items-center justify-center text-white shadow-sm">
                              {idx + 1}
                            </span>
                            <span className="text-xs font-bold text-zinc-100">
                              阶段 {idx + 1} · {seg.transport}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            {/* Transport Switcher Pills */}
                            <div className="flex items-center gap-1 bg-[#1F100B] p-0.5 rounded-lg border border-orange-500/20">
                              {TRANSPORTS.map((t) => {
                                const TIcon = t.icon;
                                const isCur = seg.transport === t.type;
                                return (
                                  <button
                                    key={t.type}
                                    type="button"
                                    onClick={() => handleUpdateSegment(seg.id, { transport: t.type })}
                                    title={t.label}
                                    className={`p-1 rounded-md text-[10px] transition-all cursor-pointer ${
                                      isCur
                                        ? 'bg-orange-500 text-white shadow-xs'
                                        : 'text-zinc-400 hover:text-zinc-200'
                                    }`}
                                  >
                                    <TIcon className="w-3 h-3" />
                                  </button>
                                );
                              })}
                            </div>

                            {/* Delete button (if > 1) */}
                            {segments.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveSegment(seg.id)}
                                className="p-1 rounded-lg text-zinc-500 hover:text-rose-400 transition-colors ml-1 cursor-pointer"
                                title="删除该阶段"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* From & To Inputs for this segment */}
                        <div className="grid grid-cols-1 gap-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-zinc-400 w-8 shrink-0">起：</span>
                            <input
                              type="text"
                              value={seg.fromName}
                              onChange={(e) => handleUpdateSegment(seg.id, { fromName: e.target.value })}
                              placeholder="起点或接驳点"
                              className="flex-1 px-2 py-1.5 rounded-lg bg-[#1C100B] border border-orange-500/20 text-zinc-100 text-[11px] placeholder-zinc-500 focus:outline-none focus:border-orange-400"
                            />
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-zinc-400 w-8 shrink-0">讫：</span>
                            <input
                              type="text"
                              value={seg.toName}
                              onChange={(e) => handleUpdateSegment(seg.id, { toName: e.target.value })}
                              placeholder="终点或换乘点"
                              className="flex-1 px-2 py-1.5 rounded-lg bg-[#1C100B] border border-orange-500/20 text-zinc-100 text-[11px] placeholder-zinc-500 focus:outline-none focus:border-orange-400"
                            />
                          </div>
                        </div>

                        {/* Strategy Tip and Duration row */}
                        <div className="flex items-center justify-between pt-1.5 mt-1.5 border-t border-orange-500/10 text-[10px]">
                          <div className="flex items-center gap-1 text-orange-300/90">
                            <ShieldCheck className="w-3 h-3 text-orange-400 shrink-0" />
                            <span className="truncate max-w-[170px]">{seg.strategyHint || '专属智能安全守护'}</span>
                          </div>

                          <div className="flex items-center gap-1 text-zinc-400 shrink-0">
                            <Clock className="w-3 h-3 text-zinc-500" />
                            <input
                              type="number"
                              min={1}
                              max={60}
                              value={seg.estimatedMinutes}
                              onChange={(e) => handleUpdateSegment(seg.id, { estimatedMinutes: parseInt(e.target.value) || 5 })}
                              className="w-9 px-1 py-0.5 text-center rounded bg-[#1C100B] border border-orange-500/20 text-white font-mono text-[10px]"
                            />
                            <span>分</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Add Segment Button */}
              {segments.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddSegment}
                  className="w-full py-2 rounded-xl border border-dashed border-orange-500/30 hover:border-orange-500/60 bg-[#160B06]/50 hover:bg-[#1A0E08] text-orange-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>添加中转 / 接驳换乘阶段 (如出地铁换单车)</span>
                </button>
              )}
            </div>
          </>
        ) : (
          /* Single Leg Route Setting */
          <>
            <div className="p-3.5 rounded-2xl bg-[#140C08] border border-orange-500/20 space-y-3 shadow-sm">
              <div>
                <label className="block text-[11px] font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                  <span>出发地（如培训机构、自习室、公司）</span>
                </label>
                <input
                  id="input-trip-departure"
                  type="text"
                  value={config.departure}
                  onChange={(e) => onChange({ ...config, departure: e.target.value })}
                  placeholder="例如：新东方 / 图书馆"
                  className="w-full px-3 py-2 rounded-xl bg-[#1A0E09] border border-orange-500/25 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-400 text-xs font-medium"
                />
              </div>

              <div className="h-[1px] bg-orange-500/15 relative">
                <div className="absolute right-4 -top-2 bg-[#140C08] px-2 text-[10px] text-zinc-400 font-medium border border-orange-500/15 rounded-md">
                  直达通勤
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                  <span>目的地（如学校、宿舍、住处）</span>
                </label>
                <input
                  id="input-trip-destination"
                  type="text"
                  value={config.destination}
                  onChange={(e) => onChange({ ...config, destination: e.target.value })}
                  placeholder="例如：学校 / 宿舍楼"
                  className="w-full px-3 py-2 rounded-xl bg-[#1A0E09] border border-orange-500/25 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-400 text-xs font-medium"
                />
              </div>
            </div>

            {/* Transport Options for Single Leg */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-zinc-200">单一交通方式选择</label>
              <div className="grid grid-cols-2 gap-2">
                {TRANSPORTS.map((t) => {
                  const Icon = t.icon;
                  const isSelected = config.transport === t.type;
                  return (
                    <div
                      key={t.type}
                      onClick={() =>
                        onChange({
                          ...config,
                          transport: t.type,
                          transports: [t.type],
                        })
                      }
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                        isSelected
                          ? 'bg-[#24130B] border-orange-500 shadow-md text-white ring-1 ring-orange-500/50'
                          : 'bg-[#140C08] border-orange-500/15 text-zinc-400 hover:bg-[#1C100B]'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          isSelected ? 'bg-gradient-to-br from-orange-500 to-amber-600 text-white' : 'bg-white/10 text-zinc-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className={`text-xs font-semibold ${isSelected ? 'text-orange-200' : 'text-zinc-300'}`}>
                          {t.label}
                        </div>
                        <div className="text-[10px] opacity-75">{t.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Common Time Card */}
        <div className="p-2.5 rounded-2xl bg-[#140C08] border border-orange-500/20 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-orange-500/20 text-orange-300 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">常用出发时间</div>
              <div className="text-[9px] text-zinc-400">到达该时间后小夜将主动提醒迎候</div>
            </div>
          </div>
          <input
            id="input-trip-time"
            type="time"
            value={config.commonTime}
            onChange={(e) => onChange({ ...config, commonTime: e.target.value })}
            className="px-2 py-1 rounded-xl bg-[#1A0E09] border border-orange-500/30 text-xs font-semibold text-white focus:outline-none focus:border-orange-400"
          />
        </div>
      </motion.div>

      {/* Bottom Button */}
      <div className="mt-3 pt-2.5 border-t border-orange-500/15 flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="py-2.5 px-4 rounded-xl bg-[#180E09] hover:bg-[#25150E] text-zinc-300 border border-orange-500/20 text-xs font-medium transition-all cursor-pointer"
        >
          上一步
        </button>

        <button
          id="btn-trip-setup-next"
          onClick={onNext}
          className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 text-white font-semibold text-xs shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer ring-1 ring-orange-400/30"
        >
          <span>下一步：授权守护权限</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

