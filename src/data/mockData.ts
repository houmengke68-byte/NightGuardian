import { CompanionConfig, TripConfig, SafetyMemory, ScenarioPreset } from '../types';

export const DEFAULT_COMPANION: CompanionConfig = {
  name: '小夜',
  voice: '温柔女性声',
  personality: '温柔安慰型',
  avatar: 'avatar_night',
};

export const DEFAULT_TRIP: TripConfig = {
  departure: '新东方(中关村校区)',
  destination: '学校(宿舍3号楼)',
  commonTime: '22:00',
  transport: '步行',
  transports: ['步行', '地铁', '骑行'],
  isMultiSegment: true,
  estimatedMinutes: 26,
  segments: [
    {
      id: 'seg-1',
      order: 1,
      fromName: '新东方(中关村校区)',
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
      toName: '学校(宿舍3号楼)',
      transport: '骑行',
      estimatedMinutes: 8,
      strategyHint: '偏航与车速监控 · 尾随研判',
    },
  ],
};

export const MULTI_SEGMENT_PRESETS = [
  {
    id: 'preset-metro-combo',
    title: '步行 + 地铁 + 骑行 (经典全过程通勤)',
    description: '先步行至地铁站，乘坐地铁换乘，出站后扫码骑行回校',
    segments: [
      { id: 'p1-1', order: 1, fromName: '培训机构 / 自习室', toName: '附近地铁站A口', transport: '步行' as const, estimatedMinutes: 6, strategyHint: '暗路与步速感知' },
      { id: 'p1-2', order: 2, fromName: '始发地铁站', toName: '目标地铁站', transport: '地铁' as const, estimatedMinutes: 14, strategyHint: '静默后台待命·到站提醒' },
      { id: 'p1-3', order: 3, fromName: '出站口单车点', toName: '学校东门/宿舍楼', transport: '骑行' as const, estimatedMinutes: 8, strategyHint: '偏航与夜行车速监控' },
    ],
  },
  {
    id: 'preset-metro-walk',
    title: '步行 + 地铁 + 步行 (全程无车直达)',
    description: '两端步行接驳地铁线路，全流程无缝陪伴',
    segments: [
      { id: 'p2-1', order: 1, fromName: '公司 / 培训机构', toName: '地铁站', transport: '步行' as const, estimatedMinutes: 8, strategyHint: '暗路照明感知' },
      { id: 'p2-2', order: 2, fromName: '始发站', toName: '目的地车站', transport: '地铁' as const, estimatedMinutes: 15, strategyHint: '后台待命守护' },
      { id: 'p2-3', order: 3, fromName: '地铁出站口', toName: '宿舍/公寓', transport: '步行' as const, estimatedMinutes: 7, strategyHint: '历史安全记忆防线' },
    ],
  },
  {
    id: 'preset-walk-only',
    title: '全程步行 (短途校园/社区)',
    description: '单一路段持续陪伴，重点识别暗光路段与异常尾随',
    segments: [
      { id: 'p3-1', order: 1, fromName: '新东方校区', toName: '学校宿舍楼', transport: '步行' as const, estimatedMinutes: 18, strategyHint: '暗路与尾随同行研判' },
    ],
  },
  {
    id: 'preset-taxi',
    title: '打车直达 (防探隐私与路线监控)',
    description: '上车路线偏航预警 + 触发拟真朋友电话震慑',
    segments: [
      { id: 'p4-1', order: 1, fromName: '上车点', toName: '下车点', transport: '打车' as const, estimatedMinutes: 20, strategyHint: '路线偏航监控 · 防探来电' },
    ],
  },
];

export const INITIAL_SAFETY_MEMORIES: SafetyMemory[] = [
  {
    id: 'mem-1',
    locationName: '学院南路辅路暗角(距学校400米)',
    triggerCount: 3,
    userTag: '路灯昏暗·常有视线逗留',
    lastReportTime: '3天前 22:45',
    note: '“这里曾让你感到害怕” — 经用户3次标记，已建立专属安全记忆防线。',
  },
  {
    id: 'mem-2',
    locationName: '知春路地下通道口',
    triggerCount: 4,
    userTag: '视野盲区·夜晚人流稀疏',
    lastReportTime: '上周五 23:10',
    note: '系统已记录推荐改走地面主干道(光线良好且有保安亭)。',
  }
];

export const ROUTE_CHECKPOINTS = [
  {
    id: 'cp-0',
    title: '出发地：新东方',
    subtitle: '明亮商业区，人流正常',
    riskLevel: 'LOW',
    distanceLeft: '1.2 km',
    minutesLeft: 18,
    progress: 0,
  },
  {
    id: 'cp-1',
    title: '路段A：中关村南大街主道',
    subtitle: '道路宽阔，沿街商铺营业中',
    riskLevel: 'LOW',
    distanceLeft: '0.9 km',
    minutesLeft: 14,
    progress: 25,
  },
  {
    id: 'cp-2',
    title: '路段B：学院南路中段（记忆风险区）',
    subtitle: '树荫遮挡，路灯间隔较远',
    riskLevel: 'MEDIUM',
    distanceLeft: '0.6 km',
    minutesLeft: 9,
    progress: 55,
  },
  {
    id: 'cp-3',
    title: '避险补给：全家24h便利店',
    subtitle: '明亮避难点，距离当前位置80米',
    riskLevel: 'LOW',
    distanceLeft: '0.4 km',
    minutesLeft: 6,
    progress: 75,
  },
  {
    id: 'cp-4',
    title: '目的地：学校东门 → 宿舍楼',
    subtitle: '校内安保区域，安全到达',
    riskLevel: 'LOW',
    distanceLeft: '0 km',
    minutesLeft: 0,
    progress: 100,
  },
];

export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: 'preset-normal',
    title: '🟢 场景一：正常平稳通勤',
    subtitle: '闺蜜模式·轻柔温和陪伴',
    description: '步速正常 1.2m/s，路况良好，小夜低频温柔回应，让回家路上充满暖意。',
    state: 'NORMAL',
    speed: 1.2,
    triggerMessage: '今天自习上课好累呀，不过马上就能回宿舍了。',
  },
  {
    id: 'preset-speed-spike',
    title: '🟡 场景二：步速突增 & 用户不安',
    subtitle: '状态机流转 -> 增强陪伴',
    description: '步速从 1.2m/s 突增至 1.8m/s，用户发送“感觉怪怪的”，系统主动提升陪伴密度并提示附近便利店。',
    state: 'ANXIOUS',
    speed: 1.8,
    triggerMessage: '后面好像有人走得好急，我感觉有点害怕…',
  },
  {
    id: 'preset-following-video',
    title: '🟠 场景三：疑似同行 & 开启视觉守护',
    subtitle: '多模态环境确认·非恐慌式提醒',
    description: '用户开启“帮我确认环境”，摄像头与AI分析同行路人，AI使用克制关切语：“别担心，我在看着呢。后面那个人和我们走了一段了，我会继续帮你留意。”',
    state: 'SUSPICIOUS',
    speed: 1.5,
    triggerMessage: '小夜，帮我确认一下身后的环境。',
  },
  {
    id: 'preset-taxi-call',
    title: '🚕 场景四：夜间打车 & 伪装防探电话',
    subtitle: '司机探听隐私 -> 拟真来电化解',
    description: '检测到司机过度打探（“这么晚一个人啊？”），AI弹出模拟电话，接通后好朋友声音响亮：“喂！我已经在小区东门便利店等你啦！”',
    state: 'ANXIOUS',
    speed: 6.5,
    triggerMessage: '司机师傅刚才突然问我是不是一个人住，我有点紧张。',
  },
  {
    id: 'preset-safe-arrival',
    title: '🎉 场景五：安全到达目标区域',
    subtitle: 'GPS入圈 -> 温暖道别 & 守护报告',
    description: '进入学校安全围栏，小夜送上“今天辛苦啦，做个好梦”，生成本次行程的安全守护报告与关注点记录。',
    state: 'NORMAL',
    speed: 0.9,
    triggerMessage: '我进宿舍大门啦！',
  },
];
