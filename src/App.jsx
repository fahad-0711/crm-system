import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CRMProvider } from './context/CRMContext';
import Sidebar from './components/Layout/Sidebar';
import Topbar from './components/Layout/Topbar';
import DashboardPage from './pages/DashboardPage';
import LeadsPage from './pages/LeadsPage';
import PipelinePage from './pages/PipelinePage';
import ToastContainer from './components/UI/Toast';

function AppContent() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen text-white flex relative overflow-hidden">
      {/* Background Video Loop */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="video-background"
      >
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260514_102933_4e8f73b5-775a-4179-b2fb-472f59063dcd.mp4" type="video/mp4" />
      </video>
      
      {/* Translucent overlay to maintain text readability */}
      <div className="video-overlay" />

      {/* Fixed Left Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      {/* Main Container */}
      <div 
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 relative z-10
          ${collapsed ? 'pl-20' : 'pl-[260px]'}
        `}
      >
        {/* Top welcome & Search bar */}
        <Topbar />
        
        {/* Main Dashboard Pages */}
        <main className="p-8 flex-1 overflow-x-hidden relative">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/leads" element={<LeadsPage />} />
            <Route path="/pipeline" element={<PipelinePage />} />
            {/* Fallback routing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      
      {/* Toast Alert popups */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <CRMProvider>
      <Router>
        <AppContent />
      </Router>
    </CRMProvider>
  );
}
