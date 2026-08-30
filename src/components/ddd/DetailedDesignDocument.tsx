import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  Layers,
  Activity,
  Heart,
  ShieldCheck,
  Eye,
  PhoneCall,
  MapPin,
  AlertTriangle,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  Cpu,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface Props {
  onJumpToScenario?: (scenarioId: string) => void;
}

export const DetailedDesignDocument: React.FC<Props> = ({ onJumpToScenario }) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [expandedSection, setExpandedSection] = useState<string | null>('sec-arch');

  const toggleSection = (secId: string) => {
    setExpandedSection(expandedSection === secId ? null : secId);
  };

  return (
    <div id="detailed-design-doc" className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 text-zinc-200 text-left">
      {/* Document Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#140804] via-[#1A0C06] to-[#0A0402] border border-orange-500/25 shadow-2xl shadow-orange-950/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 text-orange-300 text-xs font-semibold border border-orange-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>产品经理作品集核心设计案例 · AI Agent 落地架构</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Nights 女性夜间出行 AI 安全陪伴助手
            <span className="block text-xl sm:text-2xl text-orange-300 font-semibold mt-1">
              —— 详细设计文档（Detailed Design Document, DDD）
            </span>
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-2 border-t border-orange-500/15">
            <span><strong>版本：</strong>V1.0</span>
            <span><strong>产品类型：</strong>AI Agent + 安全陪伴 App</span>
            <span><strong>平台：</strong>移动端 (iOS / Android)</span>
            <span><strong>设计基调：</strong>“夜晚的路，我陪你一起走”</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0D0603] border border-orange-500/20 text-xs text-zinc-300 space-y-1.5 mt-3 shadow-inner">
            <div className="font-bold text-white flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-orange-400" />
              <span>本设计文档核心定位：</span>
            </div>
            <p>
              • <strong>PRD 回答：</strong>做什么、为什么做；
            </p>
            <p>
              • <strong>详细设计文档（DDD）回答：</strong>具体怎么做、页面怎么设计、系统如何运行、AI 如何决策。
            </p>
          </div>
        </div>
      </div>

      {/* Chapters Content Sections */}
      <div className="space-y-6">

        {/* Section 1: 架构设计 */}
        <div className="p-6 rounded-2xl bg-[#120804] border border-orange-500/20 shadow-lg space-y-4">
          <div className="flex items-center gap-2.5 text-lg font-bold text-white border-b border-orange-500/15 pb-3">
            <Cpu className="w-5 h-5 text-orange-400" />
            <h2>一、产品整体架构设计</h2>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed">
            Nights 由<strong>五大核心模块</strong>组成：用户理解、出行感知、风险判断、陪伴交互与安全响应系统。
          </p>

          <div className="p-4 rounded-xl bg-[#080301] border border-orange-500/20 font-mono text-xs text-zinc-300 overflow-x-auto">
            <pre className="leading-relaxed">
{`                 Nights AI Agent
                        |
 ------------------------------------------------
 |              |              |              |
用户理解      出行感知       风险判断       陪伴交互
 |              |              |              |
情绪分析      GPS定位       环境分析       AI人格
行为分析      路线识别       尾随判断       语音交互
历史记忆      场景识别       风险等级       视频守护
                        |
                 安全响应系统
                        |
          提醒 / 陪伴 / 建议 / 求助`}
            </pre>
          </div>
        </div>

        {/* Section 2: 核心用户流程 */}
        <div className="p-6 rounded-2xl bg-[#120804] border border-orange-500/20 shadow-lg space-y-4">
          <div className="flex items-center gap-2.5 text-lg font-bold text-white border-b border-orange-500/15 pb-3">
            <Layers className="w-5 h-5 text-amber-400" />
            <h2>二、核心用户流程设计（首次使用流）</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#180E09] border border-orange-500/20 space-y-2">
              <div className="font-bold text-orange-300">Step 1: 用户进入</div>
              <p className="text-zinc-300">页面：欢迎来到 Nights</p>
              <p className="italic text-zinc-400">文案：“夜晚的路，我陪你一起走。”</p>
              <div className="text-[11px] text-emerald-400 font-semibold">按钮：【开始创建陪伴者】</div>
            </div>

            <div className="p-4 rounded-xl bg-[#180E09] border border-orange-500/20 space-y-2">
              <div className="font-bold text-amber-300">Step 2: 创建 AI 陪伴者（情感建立优先）</div>
              <p className="text-zinc-300">① 声音选择(P0)：温柔女性声 / 活泼朋友声 / 沉稳陪伴声</p>
              <p className="text-zinc-300">② 说话方式(P0)：温柔安慰型 / 简洁可靠型 / 活泼聊天型 / 成熟陪伴型</p>
              <p className="text-zinc-300">③ 形象(P1)：<strong>小夜·智能守护喵🐱（支持互动抚摸/眨眼/声波动态反馈）</strong> / 夜空星语 / 樱粉暖曦 / 月辉薄荷</p>
              <p className="text-zinc-300">④ 名称：小夜 / 安安 / 暖暖（支持自定义）</p>
            </div>

            <div className="p-4 rounded-xl bg-[#180E09] border border-orange-500/20 space-y-2">
              <div className="font-bold text-rose-300">Step 3: 出行设置（常用场景 & 连续多段出行链）</div>
              <p className="text-zinc-300">• 出发地：例如 新东方(中关村校区)</p>
              <p className="text-zinc-300">• 目的地：例如 学校(宿舍3号楼)</p>
              <p className="text-zinc-300">• 常用时间：22:00</p>
              <p className="text-zinc-300">• <strong>全过程连续出行链(P0)：</strong>支持多段出行模式（如：先步行到地铁站 ➔ 乘地铁 ➔ 出站骑行回校），系统在各阶段无缝自动接力切换对应守护策略。</p>
            </div>

            <div className="p-4 rounded-xl bg-[#180E09] border border-orange-500/20 space-y-2">
              <div className="font-bold text-teal-300">Step 4: 权限授权（明确用途）</div>
              <p className="text-zinc-300">• <strong>GPS：</strong>判断路线和位置、偏航与到达</p>
              <p className="text-zinc-300">• <strong>摄像头：</strong>仅在用户主动开启视觉守护时使用</p>
              <p className="text-zinc-300">• <strong>麦克风：</strong>AI 语音陪伴与情绪感知</p>
            </div>
          </div>
        </div>

        {/* Section 3: 首页详细设计 */}
        <div className="p-6 rounded-2xl bg-[#120804] border border-orange-500/20 shadow-lg space-y-4">
          <div className="flex items-center gap-2.5 text-lg font-bold text-white border-b border-orange-500/15 pb-3">
            <Heart className="w-5 h-5 text-rose-400" />
            <h2>三、首页详细设计（“有人在等我”情感首页）</h2>
          </div>

          <p className="text-xs text-zinc-300">
            <strong>首页目标：</strong>核心是让用户感受到“有人在等我”，而非冷冰冰的安全工具。
          </p>

          <div className="p-4 rounded-xl bg-[#080301] border border-orange-500/20 font-mono text-xs text-zinc-300 overflow-x-auto">
            <pre className="leading-relaxed">
{`--------------------------------
        AI陪伴者
       小夜头像

     “你下课啦？”
     “今天也回学校吗？”
     “我陪你一起走。”
--------------------------------
📍 新东方 → 学校
预计18分钟

[和我一起回去] (核心P0按钮)
--------------------------------
最近一次安全记忆
“这里曾让你感到害怕”
--------------------------------`}
            </pre>
          </div>
        </div>

        {/* Section 4 & 5: 守护模式状态机 & 陪伴模式 */}
        <div className="p-6 rounded-2xl bg-[#120804] border border-orange-500/20 shadow-lg space-y-4">
          <div className="flex items-center gap-2.5 text-lg font-bold text-white border-b border-orange-500/15 pb-3">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h2>四 & 五、守护模式状态机与 AI 陪伴模式</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#080301] border border-orange-500/20 font-mono">
              <div className="font-bold text-emerald-400 mb-2">4.1 守护状态机</div>
              <pre className="text-zinc-300 text-[11px] leading-tight">
{`       开始守护
           |
       正常陪伴 (🟢 当前安全)
           |
 ----------------------
 |                    |
用户不安            环境异常
 |                    |
增强陪伴 (🟡)       风险关注 (🟠)
          |
       风险确认
          |
       紧急响应 (🔴 SOS)`}
              </pre>
            </div>

            <div className="p-4 rounded-xl bg-[#180E09] border border-orange-500/20 space-y-2.5">
              <div className="font-bold text-amber-300">五、三大 AI 陪伴模式</div>
              <div>
                <strong className="text-white">5.1 闺蜜陪伴型：</strong>
                <p className="text-zinc-400">主动聊天，例如用户说“今天上课好累”，AI 回应：“辛苦啦，再走一会儿就到了。”</p>
              </div>
              <div>
                <strong className="text-white">5.2 安静守护型：</strong>
                <p className="text-zinc-400">默认低频输出（“我会陪你走到学校”），仅在历史风险区或步速异常时触发提醒。</p>
              </div>
              <div>
                <strong className="text-white">5.3 全程守护型：</strong>
                <p className="text-zinc-400">持续确认状态，轻柔询问：“现在感觉还好吗？”</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6 & 7: 风险感知与尾随检测 */}
        <div className="p-6 rounded-2xl bg-[#120804] border border-orange-500/20 shadow-lg space-y-4">
          <div className="flex items-center gap-2.5 text-lg font-bold text-white border-b border-orange-500/15 pb-3">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h2>六 & 七、风险感知模型与尾随同行研判</h2>
          </div>

          <div className="p-4 rounded-xl bg-[#1D0F07] border border-amber-500/35 space-y-2 text-xs">
            <div className="font-bold text-amber-300">6.1 风险输入模型公式（权重经严谨人因工学调配）</div>
            <div className="p-3 rounded-lg bg-black/60 font-mono text-zinc-200 border border-orange-500/20">
              风险指数 = 用户感受(60%) + 行为变化(20%) + 环境因素(10%) + 历史数据(10%)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-300 pt-1">
              <div>• <strong>感受识别：</strong>高风险(害怕/救命/有人跟着我)；中风险(怪怪的/不舒服)</div>
              <div>• <strong>行为分析：</strong>正常速度 1.2m/s 突增至 1.8m/s → 判定可能紧张</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#180E09] border border-orange-500/20 space-y-2 text-xs">
            <div className="font-bold text-orange-300">7. 尾随检测与 AI 表达规范（核心安全原则）</div>
            <p className="text-zinc-300">
              • <strong>判断逻辑：</strong>并非武断判定“有人跟踪”，而是评估“是否存在异常同行行为”（同方向、相近距离、持续时间）。
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              <div className="p-2.5 rounded-lg bg-[#2D0D0D] border border-rose-500/40 text-rose-300">
                ❌ <strong>严禁恐慌表达：</strong>“有人在跟踪你！”
              </div>
              <div className="p-2.5 rounded-lg bg-[#0E2014] border border-emerald-500/40 text-emerald-300">
                ✅ <strong>推荐温暖表达：</strong>“别担心，我在看着呢。后面那个人和我们走了一段了，我会继续帮你留意。”
              </div>
            </div>
          </div>
        </div>

        {/* Section 8 - 15: 特殊场景与应急闭环 */}
        <div className="p-6 rounded-2xl bg-[#120804] border border-orange-500/20 shadow-lg space-y-4">
          <div className="flex items-center gap-2.5 text-lg font-bold text-white border-b border-orange-500/15 pb-3">
            <ShieldCheck className="w-5 h-5 text-orange-400" />
            <h2>八 至 十五、特殊场景、安全记忆与应急响应闭环</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
            <div className="p-3.5 rounded-xl bg-[#180E09] border border-orange-500/20 space-y-1.5">
              <div className="font-bold text-white flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-orange-400" />
                <span>八、模拟朋友视频</span>
              </div>
              <p className="text-zinc-400">
                用户说“帮我确认一下环境”触发。画中画伴护、AR同行框选、明确展示“正在观察”。
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#180E09] border border-orange-500/20 space-y-1.5">
              <div className="font-bold text-white flex items-center gap-1">
                <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                <span>十、打车防探来电</span>
              </div>
              <p className="text-zinc-400">
                司机打探隐私（“这么晚一个人？”）时，AI 弹出拟真朋友来电，响亮外放震慑。
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#180E09] border border-orange-500/20 space-y-1.5">
              <div className="font-bold text-white flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>十二、安全记忆系统</span>
              </div>
              <p className="text-zinc-400">
                同一地点 3 次以上相同反馈自动固化为专属安全记忆，路过时提前暖心预警。
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#080301] border border-orange-500/20 space-y-2 text-xs">
            <div className="font-bold text-orange-300">十五、安全到达与行程报告（Section 15）</div>
            <p className="text-zinc-300">
              • <strong>触发：</strong>GPS 识别进入学校/宿舍安全地理围栏。
            </p>
            <p className="text-zinc-300 italic">
              • <strong>结束文案：</strong>“你已经安全到达啦。今天辛苦了。早点休息，祝你有一个好梦。”
            </p>
          </div>
        </div>

        {/* Section 16 - 18: Prompt逻辑与产品创新总结 */}
        <div className="p-6 rounded-2xl bg-[#120804] border border-orange-500/20 shadow-lg space-y-4">
          <div className="flex items-center gap-2.5 text-lg font-bold text-white border-b border-orange-500/15 pb-3">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2>十六 & 十八、AI Prompt 核心原则与产品价值对照</h2>
          </div>

          <div className="p-4 rounded-xl bg-[#180E09] border border-orange-500/20 text-xs space-y-2">
            <div className="font-bold text-white">十六、AI Agent 行为五大黄金法则</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-300">
              <div>1. <strong>不制造恐慌：</strong>绝不使用刺耳惊悚定性词</div>
              <div>2. <strong>不替用户做决定：</strong>提供清晰温和的避险建议</div>
              <div>3. <strong>用户感受优先：</strong>主观害怕权重占 60%</div>
              <div>4. <strong>主动不过度打扰：</strong>低频常驻，异常主动介入</div>
              <div className="sm:col-span-2">5. <strong>像好朋友一样陪伴：</strong>真实口语、有温度、给足安全感</div>
            </div>
          </div>

          {/* Contrast Table (Section 18) */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-orange-500/20 bg-[#1A0E08]">
                  <th className="p-3 font-bold text-zinc-300">维度</th>
                  <th className="p-3 font-bold text-zinc-400">传统安全产品</th>
                  <th className="p-3 font-bold text-orange-300">Nights AI 个人安全 Agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-500/10 text-zinc-300">
                <tr>
                  <td className="p-3 font-semibold text-white">介入时机</td>
                  <td className="p-3 text-zinc-400">危险发生后被动报警</td>
                  <td className="p-3 text-emerald-300 font-semibold">风险发生前全流程陪伴</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">产品属性</td>
                  <td className="p-3 text-zinc-400">冰冷的呼救工具属性</td>
                  <td className="p-3 text-orange-300 font-semibold">有温度的亲密关系属性</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">关注机制</td>
                  <td className="p-3 text-zinc-400">用户主动呼救才响应</td>
                  <td className="p-3 text-amber-300 font-semibold">AI 多模态主动智能关怀</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">场景覆盖</td>
                  <td className="p-3 text-zinc-400">单一孤立求助界面</td>
                  <td className="p-3 text-white">步行/打车/地铁全链路守护</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">终极目标</td>
                  <td className="p-3 text-zinc-400">解决危急事件</td>
                  <td className="p-3 text-orange-300 font-semibold">降低夜行恐惧感，护送安心到家</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* PM Portfolio & Interview Deep-dive Defense Section */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1C0E07] to-[#120804] border border-orange-500/30 space-y-4">
          <div className="flex items-center gap-2 text-lg font-bold text-orange-300">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <span>【产品经理作品集答辩与面试深挖指南】</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-black/60 border border-orange-500/20 space-y-1">
              <div className="font-bold text-white">Q1: 为什么主打“朋友式陪伴”，而不是强化传统的一键110报警？</div>
              <p className="text-zinc-300 leading-relaxed">
                <strong>答辩要点：</strong>绝大多数女性夜间出行面临的不是已经发生的人身伤害，而是“黑暗环境带来的巨大心理恐惧与孤单”。传统报警属于极低频、高阈值工具（用户在没有确凿危险前不敢随便拨打 110），而 Nights 填补了从“心生畏惧”到“真正遇险”之间的全程陪伴真空，以关系属性化解心理焦虑。
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/60 border border-orange-500/20 space-y-1">
              <div className="font-bold text-white">Q2: 如何避免 AI 误判导致用户发生“二次恐慌”？</div>
              <p className="text-zinc-300 leading-relaxed">
                <strong>答辩要点：</strong>在 Prompt 策略上确立了“不制造恐慌”作为最高优先级准则。严禁输出“有人跟踪”等恐吓性定性，转为“客观同行描述 + 关怀建议”（如：“后面那个人走了一段，我正帮你留意着，前面有便利店我们去买瓶水”），既保留了警觉性，又安抚了情绪。
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/60 border border-orange-500/20 space-y-1">
              <div className="font-bold text-white">Q3: 风险公式中“用户感受(60%)”权重最高的设计考量是什么？</div>
              <p className="text-zinc-300 leading-relaxed">
                <strong>答辩要点：</strong>安全感是非常主观的情感体验。传感器的“正常”不代表用户的“安心”。只要用户明确表达“害怕”或“感觉怪怪的”，系统就应立即提升陪伴等级与关怀频次。以人为本，而非以冰冷的设备读数为本。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
