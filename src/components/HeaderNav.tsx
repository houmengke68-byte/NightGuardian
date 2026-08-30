import React from 'react';
import { Smartphone, FileText, SplitSquareVertical, Sparkles, Moon, Play } from 'lucide-react';
import { SCENARIO_PRESETS } from '../data/mockData';
import { ScenarioPreset } from '../types';

export type ViewMode = 'APP' | 'DOCS' | 'SPLIT';

interface Props {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onSelectPreset: (preset: ScenarioPreset) => void;
  onResetOnboarding: () => void;
}

export const HeaderNav: React.FC<Props> = ({
  viewMode,
  onViewModeChange,
  onSelectPreset,
  onResetOnboarding,
}) => {
  return (
    <header className="w-full bg-[#0D0704]/90 backdrop-blur-xl border-b border-orange-500/15 sticky top-0 z-50 px-4 py-2.5 shadow-lg shadow-black/60">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-orange-500/25 ring-1 ring-orange-400/30">
            <Moon className="w-4 h-4 text-orange-100" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-white text-sm">
              <span className="tracking-tight">Nights</span>
              <span className="text-[10px] bg-orange-500/15 text-orange-300 px-1.5 py-0.2 rounded-full font-medium border border-orange-500/30 shadow-sm shadow-orange-950/50">
                AI 安全陪伴 Agent
              </span>
            </div>
            <div className="text-[11px] text-zinc-400">
              女性夜间出行详细设计 (DDD) 交互原型系统
            </div>
          </div>
        </div>

        {/* Middle Quick Scenario Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-0.5 custom-scrollbar">
          <span className="text-[11px] font-medium text-zinc-400 shrink-0 flex items-center gap-1">
            <Play className="w-3 h-3 text-orange-400" />
            <span>演示场景：</span>
          </span>
          {SCENARIO_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className="px-2.5 py-1 rounded-lg bg-[#180E09] hover:bg-[#25150E] text-[11px] text-zinc-300 hover:text-orange-200 border border-orange-500/20 whitespace-nowrap active:scale-95 transition-all cursor-pointer font-medium hover:border-orange-500/40"
              title={preset.description}
            >
              {preset.title.split('：')[0]}
            </button>
          ))}
        </div>

        {/* Right View Mode Toggles */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-[#140C08] border border-orange-500/20 text-xs">
            <button
              onClick={() => onViewModeChange('APP')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'APP'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>移动端体验</span>
            </button>

            <button
              onClick={() => onViewModeChange('DOCS')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'DOCS'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>详细设计文档 (DDD)</span>
            </button>

            <button
              onClick={() => onViewModeChange('SPLIT')}
              className={`px-3 py-1.5 rounded-lg font-medium hidden lg:flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'SPLIT'
                  ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 text-white shadow-md shadow-orange-600/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span>双屏对照演示</span>
            </button>
          </div>

          <button
            onClick={onResetOnboarding}
            className="px-2.5 py-1.5 rounded-xl bg-[#140C08] hover:bg-[#20130D] text-[11px] text-zinc-400 hover:text-orange-200 border border-orange-500/20 active:scale-95 transition-all cursor-pointer font-medium"
            title="重置为首次使用流体验"
          >
            重开向导
          </button>
        </div>
      </div>
    </header>
  );
};
