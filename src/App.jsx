import React, { useState, Suspense, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import StudentProfile from './components/StudentProfile';
import Predictions from './components/Predictions';
import Recommendations from './components/Recommendations';
import AdminDashboard from './components/AdminDashboard';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import { ThemeProvider } from './context/ThemeContext';
import Chatbot from './components/Chatbot';

const App = () => {
  const [appView, setAppView] = useState('landing'); 
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // --- NEW: Master Auth States ---
  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'student' or 'faculty'

  const [globalInsights, setGlobalInsights] = useState([]);
  const [globalFocusSubject, setGlobalFocusSubject] = useState("");
  const [isInsightsLoading, setIsInsightsLoading] = useState(true);

  // Fetch AI Insights only if a STUDENT logs in
  useEffect(() => {
    if (!currentStudentId || userRole !== 'student') return;

    const generateLiveInsights = async () => {
      setIsInsightsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/insights/${currentStudentId}/generate`, { 
          method: 'POST' 
        });
        
        if (!response.ok) throw new Error("API Failed");
        
        const data = await response.json();
        
        // Safety check for empty structure
        if (!data || !data.aiActionPlan || !Array.isArray(data.aiActionPlan.actionSteps)) {
          throw new Error("Missing data structure");
        }

        const plan = data.aiActionPlan;
        setGlobalFocusSubject(plan.weakestSubject || "General Studies");

        const icons = ['BookOpen', 'Zap', 'Trophy'];
        const colors = ['blue', 'purple', 'amber'];
        const titles = ['Primary Focus', 'Secondary Action', 'Long-term Goal'];

        const mappedInsights = plan.actionSteps.map((step, index) => ({
          id: index,
          title: titles[index] || `Action Item ${index + 1}`,
          description: step,
          icon: icons[index % 3],
          color: colors[index % 3]
        }));

        setGlobalInsights(mappedInsights);
        
      } catch (err) {
        console.error("Using Fallback Data due to API Error:", err);
        setGlobalFocusSubject("Physics");
        setGlobalInsights([
          {
            id: 1, title: "Primary Focus", description: "Review Electromagnetism formulas. Your recent quiz scores show a 15% drop.", icon: "BookOpen", color: "blue"
          },
          {
            id: 2, title: "Secondary Action", description: "Complete the practice worksheet 'Circuits 101' before Thursday.", icon: "Zap", color: "purple"
          },
          {
            id: 3, title: "Long-term Goal", description: "Aim for an 85% on the upcoming mid-term.", icon: "Trophy", color: "amber"
          }
        ]);
      } finally {
        setIsInsightsLoading(false);
      }
    };

    generateLiveInsights();
  }, [currentStudentId, userRole]);

  const handleGetStarted = () => setAppView('login');
  
  // Receives the ID AND the Role from LoginPage.jsx
  const handleLogin = (id, role) => {
    setCurrentStudentId(id);
    setUserRole(role);
    setAppView('dashboard');
  };
  
  const handleBackToLanding = () => setAppView('landing');

  const handleLogout = () => {
    setCurrentStudentId(null);
    setUserRole(null);
    setAppView('landing');
    setActiveTab('dashboard'); 
  };

  const renderStudentContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard studentId={currentStudentId} />;
      case 'profile': return <StudentProfile studentId={currentStudentId} />;
      case 'predictions': return <Predictions studentId={currentStudentId} />;
      case 'recommendations': return <Recommendations studentId={currentStudentId} insights={globalInsights} focusSubject={globalFocusSubject} isLoading={isInsightsLoading} />;
      default: return <Dashboard studentId={currentStudentId} />;
    }
  };

  if (appView === 'landing') return <LandingPage onGetStarted={handleGetStarted} />;
  if (appView === 'login') return <LoginPage onLogin={handleLogin} onBack={handleBackToLanding} />;

  return (
    <ThemeProvider>
      <div className="flex min-h-screen bg-background font-sans text-foreground relative">
        
        {/* CONDITIONAL ROUTING: Only show Sidebar to Students */}
        {userRole === 'student' && (
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            isOpen={isMobileMenuOpen} 
            setIsOpen={setIsMobileMenuOpen}
          />
        )}

        <div className="flex-1 flex flex-col min-w-0">
          <Navbar 
            userRole={userRole} 
            studentId={currentStudentId} 
            onMenuClick={() => setIsMobileMenuOpen(true)}
          />

          <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12">
            <div className="max-w-7xl mx-auto">
              <Suspense fallback={
                <div className="space-y-4 animate-pulse">
                  <div className="h-8 bg-muted rounded w-1/4"></div>
                  <div className="h-32 bg-muted rounded w-full"></div>
                </div>
              }>
                {/* CONDITIONAL ROUTING: Render Admin or Student Content */}
                {userRole === 'faculty' ? (
                  <AdminDashboard />
                ) : (
                  renderStudentContent()
                )}
              </Suspense>
            </div>
          </main>
        </div>
        
        {userRole === 'student' && currentStudentId && (
          <Chatbot studentId={currentStudentId} />
        )}

        <button 
          onClick={handleLogout}
          className="fixed md:absolute bottom-6 right-6 px-4 py-2 z-50 bg-destructive/10 text-destructive border border-destructive/20 font-bold rounded-lg hover:bg-destructive hover:text-white transition-colors shadow-lg"
        >
          Logout
        </button>
      </div>
    </ThemeProvider>
  );
};

export default App;