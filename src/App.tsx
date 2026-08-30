import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CompanionConfig,
  TripConfig,
  PermissionsState,
  CompanionMode,
  GuardState,
  SafetyMemory,
  ScenarioPreset,
} from './types';
import {
  DEFAULT_COMPANION,
  DEFAULT_TRIP,
  INITIAL_SAFETY_MEMORIES,
} from './data/mockData';
import { MobileFrame } from './components/MobileFrame';
import { HeaderNav, ViewMode } from './components/HeaderNav';
import { WelcomeStep } from './components/onboarding/WelcomeStep';
import { CompanionSetupStep } from './components/onboarding/CompanionSetupStep';
import { TripSetupStep } from './components/onboarding/TripSetupStep';
import { PermissionStep } from './components/onboarding/PermissionStep';
import { HomeScreen } from './components/home/HomeScreen';
import { GuardActiveScreen } from './components/guard/GuardActiveScreen';
import { VisualGuardModal } from './components/guard/VisualGuardModal';
import { FakeCallModal } from './components/guard/FakeCallModal';
import { SosModal } from './components/guard/SosModal';
import { ArrivalCelebration } from './components/guard/ArrivalCelebration';
import { DetailedDesignDocument } from './components/ddd/DetailedDesignDocument';

export default function App() {
  // Navigation & View Mode
  const [viewMode, setViewMode] = useState<ViewMode>('SPLIT');

  // App Workflow Stage
  const [appStage, setAppStage] = useState<
    'WELCOME' | 'COMPANION_SETUP' | 'TRIP_SETUP' | 'PERMISSION' | 'HOME' | 'GUARD_ACTIVE' | 'ARRIVAL'
  >('HOME');

  // State
  const [companion, setCompanion] = useState<CompanionConfig>(DEFAULT_COMPANION);
  const [trip, setTrip] = useState<TripConfig>(DEFAULT_TRIP);
  const [permissions, setPermissions] = useState<PermissionsState>({
    gps: true,
    camera: true,
    microphone: true,
  });
  const [memories, setMemories] = useState<SafetyMemory[]>(INITIAL_SAFETY_MEMORIES);
  const [companionMode, setCompanionMode] = useState<CompanionMode>('GIRLFRIEND');

  // Active Modals
  const [isVisualGuardOpen, setIsVisualGuardOpen] = useState(false);
  const [isFakeCallOpen, setIsFakeCallOpen] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);

  // Preset Scenario loader
  const handleSelectPreset = (preset: ScenarioPreset) => {
    if (preset.id === 'preset-safe-arrival') {
      setAppStage('ARRIVAL');
    } else if (preset.id === 'preset-taxi-call') {
      setTrip((prev) => ({ ...prev, transport: '打车' }));
      setAppStage('GUARD_ACTIVE');
      setIsFakeCallOpen(true);
    } else if (preset.id === 'preset-following-video') {
      setAppStage('GUARD_ACTIVE');
      setIsVisualGuardOpen(true);
    } else {
      setAppStage('GUARD_ACTIVE');
    }
  };

  const handleResetOnboarding = () => {
    setAppStage('WELCOME');
  };

  return (
    <div className="min-h-screen bg-[#0A0502] text-zinc-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-orange-500/30 selection:text-orange-200">
      {/* Sleek ambient glow background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-orange-600/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[400px] bg-amber-600/5 rounded-full blur-[160px]" />
      </div>

      {/* Top Header Navigation */}
      <HeaderNav
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onSelectPreset={handleSelectPreset}
        onResetOnboarding={handleResetOnboarding}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 relative z-10">
        {/* Mobile App Simulator Container */}
        {(viewMode === 'APP' || viewMode === 'SPLIT') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full ${
              viewMode === 'SPLIT' ? 'lg:w-[420px] shrink-0 sticky top-20' : 'max-w-md'
            } flex flex-col items-center`}
          >
            {/* Context Badge above phone */}
            <div className="mb-2.5 text-center">
              <span className="text-[11px] font-medium text-orange-200/90 bg-[#160D08]/90 px-3 py-1 rounded-full border border-orange-500/25 shadow-sm shadow-orange-950/40">
                {appStage === 'WELCOME' && '首次使用 Step 1 · 欢迎页面'}
                {appStage === 'COMPANION_SETUP' && '首次使用 Step 2 · 创建 AI 陪伴者'}
                {appStage === 'TRIP_SETUP' && '首次使用 Step 3 · 常用路线出行设置'}
                {appStage === 'PERMISSION' && '首次使用 Step 4 · 安全权限授权'}
                {appStage === 'HOME' && 'Nights 首页 · “有人在等我”'}
                {appStage === 'GUARD_ACTIVE' && '夜间实时守护模式 · 多模态陪伴感知'}
                {appStage === 'ARRIVAL' && '安全到达 · 结束报告与祝福'}
              </span>
            </div>

            <MobileFrame activeTime={trip.commonTime || '22:00'}>
              <AnimatePresence mode="wait">
                {appStage === 'WELCOME' && (
                  <WelcomeStep
                    key="welcome"
                    onStart={() => setAppStage('COMPANION_SETUP')}
                  />
                )}

                {appStage === 'COMPANION_SETUP' && (
                  <CompanionSetupStep
                    key="companion_setup"
                    config={companion}
                    onChange={setCompanion}
                    onNext={() => setAppStage('TRIP_SETUP')}
                    onBack={() => setAppStage('WELCOME')}
                  />
                )}

                {appStage === 'TRIP_SETUP' && (
                  <TripSetupStep
                    key="trip_setup"
                    config={trip}
                    onChange={setTrip}
                    onNext={() => setAppStage('PERMISSION')}
                    onBack={() => setAppStage('COMPANION_SETUP')}
                  />
                )}

                {appStage === 'PERMISSION' && (
                  <PermissionStep
                    key="permission"
                    permissions={permissions}
                    onChange={setPermissions}
                    onComplete={() => setAppStage('HOME')}
                    onBack={() => setAppStage('TRIP_SETUP')}
                  />
                )}

                {appStage === 'HOME' && (
                  <HomeScreen
                    key="home"
                    companion={companion}
                    trip={trip}
                    memories={memories}
                    activeMode={companionMode}
                    onModeChange={setCompanionMode}
                    onTransportChange={(transport) => setTrip((prev) => ({ ...prev, transport }))}
                    onStartGuard={() => setAppStage('GUARD_ACTIVE')}
                    onOpenSettings={() => setAppStage('COMPANION_SETUP')}
                    onTriggerFakeCall={() => setIsFakeCallOpen(true)}
                  />
                )}

                {appStage === 'GUARD_ACTIVE' && (
                  <GuardActiveScreen
                    key="guard_active"
                    companion={companion}
                    trip={trip}
                    memories={memories}
                    companionMode={companionMode}
                    onCompanionModeChange={setCompanionMode}
                    onOpenVisualGuard={() => setIsVisualGuardOpen(true)}
                    onOpenFakeCall={() => setIsFakeCallOpen(true)}
                    onOpenSos={() => setIsSosOpen(true)}
                    onArriveSafely={() => setAppStage('ARRIVAL')}
                  />
                )}

                {appStage === 'ARRIVAL' && (
                  <ArrivalCelebration
                    key="arrival"
                    companion={companion}
                    trip={trip}
                    durationMinutes={trip.estimatedMinutes}
                    onFinish={() => setAppStage('HOME')}
                  />
                )}
              </AnimatePresence>
            </MobileFrame>
          </motion.div>
        )}

        {/* Detailed Design Document (DDD) Explorer */}
        {(viewMode === 'DOCS' || viewMode === 'SPLIT') && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`w-full ${
              viewMode === 'SPLIT' ? 'flex-1 max-w-4xl' : 'max-w-5xl'
            } overflow-y-auto`}
          >
            <DetailedDesignDocument onJumpToScenario={handleSelectPreset as any} />
          </motion.div>
        )}
      </main>

      {/* Global Safety Modals */}
      <VisualGuardModal
        companion={companion}
        isOpen={isVisualGuardOpen}
        onClose={() => setIsVisualGuardOpen(false)}
        onEmergency={() => {
          setIsVisualGuardOpen(false);
          setIsSosOpen(true);
        }}
      />

      <FakeCallModal
        isOpen={isFakeCallOpen}
        onClose={() => setIsFakeCallOpen(false)}
      />

      <SosModal
        trip={trip}
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
      />
    </div>
  );
}
