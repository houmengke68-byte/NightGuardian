export type VoiceType = '温柔女性声' | '活泼朋友声' | '沉稳陪伴声';
export type PersonalityType = '温柔安慰型' | '简洁可靠型' | '活泼聊天型' | '成熟陪伴型';
export type AvatarType = 'avatar_night' | 'avatar_warm' | 'avatar_gentle' | 'avatar_cat' | 'avatar_custom';
export type TransportType = '步行' | '骑行' | '地铁' | '打车';

export type GuardState = 'NORMAL' | 'ANXIOUS' | 'SUSPICIOUS' | 'EMERGENCY';
export type CompanionMode = 'GIRLFRIEND' | 'QUIET' | 'FULL_CARE';

export interface CompanionConfig {
  name: string;
  voice: VoiceType;
  personality: PersonalityType;
  avatar: AvatarType;
  customAvatarUrl?: string;
}

export interface TripSegment {
  id: string;
  order: number;
  fromName: string;
  toName: string;
  transport: TransportType;
  estimatedMinutes: number;
  strategyHint?: string;
}

export interface TripConfig {
  departure: string;
  destination: string;
  commonTime: string;
  transport: TransportType;
  transports: TransportType[];
  segments: TripSegment[];
  isMultiSegment: boolean;
  estimatedMinutes: number;
}

export interface PermissionsState {
  gps: boolean;
  camera: boolean;
  microphone: boolean;
}

export interface SafetyMemory {
  id: string;
  locationName: string;
  triggerCount: number;
  userTag: string;
  lastReportTime: string;
  note: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  isAudioPlaying?: boolean;
}

export interface RiskFactors {
  userFeeling: number; // 60% weight (0 - 100)
  behaviorChange: number; // 20% weight (0 - 100)
  environment: number; // 10% weight (0 - 100)
  historyData: number; // 10% weight (0 - 100)
  totalScore: number;
  currentSpeed: number; // m/s
  isSpeedSpike: boolean;
  followingDetected: boolean;
  followingDistanceMeters?: number;
  followingDurationSeconds?: number;
}

export interface ScenarioPreset {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  state: GuardState;
  speed: number;
  triggerMessage: string;
}
