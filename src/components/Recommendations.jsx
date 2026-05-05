import React, { useState } from 'react';
import { Lightbulb, BookOpen, Zap, Trophy, ArrowRight, Star, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

const iconMap = {
  BookOpen: BookOpen,
  Zap: Zap,
  Trophy: Trophy,
};

const colorMap = {
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  amber: "bg-amber-500",
};

const RecommendationCard = ({ title, description, icon, color }) => {
  const Icon = iconMap[icon] || Lightbulb;
  const colorClass = colorMap[color] || "bg-primary";
  
  // Local state just for the gamified button interaction
  const [isActionTaken, setIsActionTaken] = useState(false);

  return (
    <div className="bg-card border rounded-2xl p-6 shadow-sm card-hover flex flex-col group">
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white mb-6 transition-transform group-hover:scale-110", colorClass)}>
        <Icon size={24} />
      </div>
      <h3 className="font-bold text-xl mb-3">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">{description}</p>
      
      {/* The Interactive Button */}
      <button 
        onClick={() => setIsActionTaken(true)}
        disabled={isActionTaken}
        className={cn(
          "flex items-center gap-2 text-sm font-bold transition-all w-fit",
          isActionTaken 
            ? "text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-lg" 
            : "text-primary hover:gap-3"
        )}
      >
        {isActionTaken ? (
          <>
            <CheckCircle2 size={16} /> Added to Calendar
          </>
        ) : (
          <>
            Take Action <ArrowRight size={16} />
          </>
        )}
      </button>
    </div>
  );
};

// Receiving the hoisted state as props from App.jsx
const Recommendations = ({ insights = [], focusSubject = "", isLoading = false }) => {
  
  // Notice there is no useEffect or data fetching here anymore!

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 text-primary animate-pulse">
        <Loader2 size={48} className="animate-spin text-primary" />
        <p className="text-lg font-medium text-muted-foreground">EduAI is analyzing your learning patterns...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Insights & Tips</h2>
          <p className="text-muted-foreground">Personalized suggestions to boost your academic performance.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-yellow-500/10 text-yellow-600 px-3 py-1.5 rounded-full text-xs font-bold border border-yellow-500/20">
          <Star size={14} fill="currentColor" />
          Powered by EduAI v2.0
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insights.map((rec) => (
          <RecommendationCard key={rec.id} {...rec} />
        ))}
      </div>

      <div className="bg-gradient-to-br from-primary/10 to-purple-600/10 border border-primary/20 rounded-3xl p-8 mt-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-4">Unlock Your Potential in {focusSubject}</h3>
            <p className="text-muted-foreground leading-relaxed">
              Based on your recent metrics, our AI suggests you dedicate 2 extra hours this week specifically to <strong>{focusSubject}</strong>. 
              Students who follow this AI-generated learning path show a 40% higher chance of increasing their grade boundary before finals.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
                Generate Study Material
              </button>
              <button className="px-6 py-3 bg-card border rounded-xl font-bold hover:bg-muted transition-colors">
                View Learning Path
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/3 bg-card/50 backdrop-blur-sm border rounded-2xl p-6">
            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-muted-foreground">Study Streak</h4>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map(d => (
                <div key={d} className={cn(
                  "flex-1 h-12 rounded-lg flex items-center justify-center font-bold text-sm",
                  d < 6 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                )}>
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'][d-1]}
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-sm font-medium">5 Day Streak! 🔥</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;