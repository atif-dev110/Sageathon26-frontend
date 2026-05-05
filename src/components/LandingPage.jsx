import React from 'react';
import { BrainCircuit, ArrowRight, Star, Shield, Zap, Sparkles } from 'lucide-react';

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-background overflow-hidden relative selection:bg-primary/30">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <BrainCircuit size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight gradient-text">EduAI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#" className="hover:text-primary transition-colors">Features</a>
          <a href="#" className="hover:text-primary transition-colors">Testimonials</a>
          <a href="#" className="hover:text-primary transition-colors">Pricing</a>
          <button 
            onClick={onGetStarted}
            className="px-5 py-2 bg-primary text-white rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in">
            <Sparkles size={14} /> AI-Powered Learning Revolution
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1] animate-slide-in">
            Predict Your <span className="gradient-text">Future</span> Academic Success.
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed animate-fade-in [animation-delay:200ms]">
            The world's most advanced AI-powered student performance system. Get personalized insights, 
            predict scores, and unlock your full potential with EduAI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in [animation-delay:400ms]">
            <button 
              onClick={onGetStarted}
              className="px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg flex items-center gap-2 hover:gap-4 transition-all shadow-xl shadow-primary/25 group"
            >
              Get Started for Free <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button className="px-8 py-4 bg-card border rounded-2xl font-bold text-lg hover:bg-muted transition-colors">
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 mt-24 w-full animate-fade-in [animation-delay:600ms]">
            <div>
              <p className="text-4xl font-bold mb-2">98%</p>
              <p className="text-muted-foreground text-sm uppercase font-bold tracking-widest">Accuracy</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">50k+</p>
              <p className="text-muted-foreground text-sm uppercase font-bold tracking-widest">Students</p>
            </div>
            <div className="hidden md:block">
              <p className="text-4xl font-bold mb-2">12+</p>
              <p className="text-muted-foreground text-sm uppercase font-bold tracking-widest">Countries</p>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Elements/Mockup */}
      <div className="relative max-w-6xl mx-auto px-8 animate-fade-in [animation-delay:800ms]">
        <div className="bg-card/50 backdrop-blur-sm border rounded-3xl p-4 shadow-2xl rotate-1 group hover:rotate-0 transition-transform duration-700">
          <div className="bg-background rounded-2xl border aspect-video flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10"></div>
             <BrainCircuit size={120} className="text-primary/20 animate-pulse" />
             <div className="absolute bottom-10 left-10 p-6 bg-card rounded-2xl shadow-xl border w-64 translate-y-20 group-hover:translate-y-0 transition-transform duration-1000">
                <div className="flex gap-2 mb-4">
                  <div className="w-8 h-8 rounded bg-blue-500"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-2 bg-muted rounded w-3/4"></div>
                    <div className="h-2 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
                <p className="text-xs font-bold text-emerald-500">+12% Performance Increase</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
