import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AdaptiveLearningProvider } from './context/AdaptiveLearningContext';
import { LearnerStateProvider } from './context/LearnerStateContext';
import AdaptiveLearningDevHarness from './pages/adaptive-learning/AdaptiveLearningDevHarness';
import AdaptiveLearningHome from './pages/adaptive-learning/AdaptiveLearningHome';
import GeneralIntelligence from './pages/adaptive-learning/GeneralIntelligence';
import PatternSequenceOverview from './pages/adaptive-learning/PatternSequenceOverview';
import IndependentBaseline from './pages/adaptive-learning/IndependentBaseline';
import PatternTemple from './pages/adaptive-learning/PatternTemple';
import AdaptiveSupport from './pages/adaptive-learning/AdaptiveSupport';
import IndependentCheck from './pages/adaptive-learning/IndependentCheck';
import IndependenceResult from './pages/adaptive-learning/IndependenceResult';
import LearnReward from './pages/adaptive-learning/LearnReward';
import AdaptiveResearchSummary from './pages/adaptive-learning/AdaptiveResearchSummary';
import MainLayout from './layouts/MainLayout';
import PlainLayout from './layouts/PlainLayout';

import Splash from './pages/Splash';
import Onboarding from './pages/Onboarding';
import LanguageSelect from './pages/LanguageSelect';
import ProfileSetup from './pages/ProfileSetup';

import Home from './pages/Home';
import MiniGame from './pages/MiniGame';

import Practice from './pages/Practice';
import PrintablePaper from './pages/PrintablePaper';
import PaperUpload from './pages/PaperUpload';
import PaperResults from './pages/PaperResults';
import PastPapers from './pages/PastPapers';

import Mindy from './pages/Mindy';
import HintSession from './pages/HintSession';

import LearningCompanion from './pages/LearningCompanion';

import Progress from './pages/Progress';
import StateFusion from './pages/StateFusion';
import Patterns from './pages/Patterns';
import Journey from './pages/Journey';
import Achievements from './pages/Achievements';

import Profile from './pages/Profile';
import AvatarCustomize from './pages/AvatarCustomize';
import Privacy from './pages/Privacy';
import Parent from './pages/Parent';
import Notifications from './pages/Notifications';
import DemoControls from './pages/DemoControls';
import SmartLearningSupport from './pages/SmartLearningSupport';
import BreakSupport from './pages/BreakSupport';
import SessionSummary from './pages/SessionSummary';
import LearnerStateInsights from './pages/LearnerStateInsights';
import PatternDetails from './pages/PatternDetails';

import './index.css';

export default function App() {
  return (
    <AppProvider>
      <LearnerStateProvider>
        <AdaptiveLearningProvider>
          <HashRouter>
            <div className="app-frame">
              <Routes>
                <Route element={<PlainLayout />}>
                  <Route path="/" element={<Splash />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/language" element={<LanguageSelect />} />
                  <Route path="/profile-setup" element={<ProfileSetup />} />

                  <Route path="/minigame" element={<MiniGame />} />

                  <Route path="/printable-paper" element={<PrintablePaper />} />
                  <Route path="/paper-upload" element={<PaperUpload />} />
                  <Route path="/paper-results" element={<PaperResults />} />
                  <Route path="/past-papers" element={<PastPapers />} />

                  <Route path="/hint-session" element={<HintSession />} />

                  <Route path="/state-fusion" element={<StateFusion />} />
                  <Route path="/patterns" element={<Patterns />} />
                  <Route path="/journey" element={<Journey />} />
                  <Route path="/achievements" element={<Achievements />} />

                  <Route path="/avatar-customize" element={<AvatarCustomize />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/parent" element={<Parent />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/demo-controls" element={<DemoControls />} />
                  <Route path="/smart-learning-support" element={<SmartLearningSupport />} />
                  <Route path="/break-support" element={<BreakSupport />} />
                  <Route path="/session-summary" element={<SessionSummary />} />
                  <Route path="/learner-state-insights" element={<LearnerStateInsights />} />
                  <Route path="/pattern-details" element={<PatternDetails />} />

                  {/* Adaptive Learning — immersive flow screens (no bottom nav). */}
                  <Route path="/learn/baseline" element={<IndependentBaseline />} />
                  <Route path="/learn/temple" element={<PatternTemple />} />
                  <Route path="/learn/support" element={<AdaptiveSupport />} />
                  <Route path="/learn/independent-check" element={<IndependentCheck />} />
                  <Route path="/learn/result" element={<IndependenceResult />} />
                  <Route path="/learn/reward" element={<LearnReward />} />
                  <Route path="/learn/research-summary" element={<AdaptiveResearchSummary />} />

                  {/* Adaptive Learning — dev harness for glyphs and the Research View. */}
                  <Route path="/learn/dev" element={<AdaptiveLearningDevHarness />} />
                </Route>

                <Route element={<MainLayout />}>
                  <Route path="/home" element={<Home />} />
                  <Route path="/practice" element={<Practice />} />
                  <Route path="/mindy" element={<Mindy />} />
                  <Route path="/progress" element={<Progress />} />
                  <Route path="/companion" element={<LearningCompanion />} />
                  <Route path="/profile" element={<Profile />} />

                  {/* Adaptive Learning — child navigation (Phase 3). Nested /learn
                      routes keep the Learn tab highlighted. Later phases add the
                      remaining /learn/* screens under PlainLayout. */}
                  <Route path="/learn" element={<AdaptiveLearningHome />} />
                  <Route path="/learn/general-intelligence" element={<GeneralIntelligence />} />
                  <Route path="/learn/pattern-sequence" element={<PatternSequenceOverview />} />
                </Route>
              </Routes>
            </div>
          </HashRouter>
        </AdaptiveLearningProvider>
      </LearnerStateProvider>
    </AppProvider>
  );
}
