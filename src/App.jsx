import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import MainLayout from './layouts/MainLayout';
import PlainLayout from './layouts/PlainLayout';

import Splash from './pages/Splash';
import Onboarding from './pages/Onboarding';
import LanguageSelect from './pages/LanguageSelect';
import ProfileSetup from './pages/ProfileSetup';

import Home from './pages/Home';
import Worlds from './pages/Worlds';
import WorldDetail from './pages/WorldDetail';
import MiniGame from './pages/MiniGame';

import Practice from './pages/Practice';
import PrintablePaper from './pages/PrintablePaper';
import PaperUpload from './pages/PaperUpload';
import PaperResults from './pages/PaperResults';

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
      <HashRouter>
        <div className="app-frame">
          <Routes>
            <Route element={<PlainLayout />}>
              <Route path="/" element={<Splash />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/language" element={<LanguageSelect />} />
              <Route path="/profile-setup" element={<ProfileSetup />} />

              <Route path="/worlds/:id" element={<WorldDetail />} />
              <Route path="/minigame" element={<MiniGame />} />

              <Route path="/printable-paper" element={<PrintablePaper />} />
              <Route path="/paper-upload" element={<PaperUpload />} />
              <Route path="/paper-results" element={<PaperResults />} />

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
            </Route>

            <Route element={<MainLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/worlds" element={<Worlds />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/mindy" element={<Mindy />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/companion" element={<LearningCompanion />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </div>
      </HashRouter>
    </AppProvider>
  );
}
