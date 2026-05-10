import React, { useState, useEffect } from 'react';
import { BrainCircuit, TrendingUp, TrendingDown, Sparkles, Loader2, Mail, Send, X } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Predictions = ({ studentId }) => {
  const [predictionData, setPredictionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // --- NEW MODAL STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetEmail, setTargetEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  useEffect(() => {
    if (!studentId) return;

    const fetchPredictions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/predictions/${studentId}`);
        if (!response.ok) throw new Error("Prediction API failed");
        
        const data = await response.json();
        setPredictionData(data);
      } catch (error) {
        console.error("Using fallback prediction data:", error);
        
        setPredictionData({
          predictedScores: [
            { subject: "Physics", exam: "Final Exam", current: 78, predicted: 85 },
            { subject: "Mathematics", exam: "Mid-Terms", current: 82, predicted: 88 },
            { subject: "Computer Science", exam: "Final Exam", current: 90, predicted: 85 } 
          ],
          performanceTrends: [
            { week: "Week 1", score: 75 }, { week: "Week 2", score: 78 },
            { week: "Week 3", score: 82 }, { week: "Week 4", score: 85 },
            { week: "Week 5 (Est)", score: 89 }, { week: "Week 6 (Est)", score: 92 }
          ],
          insight: "Your performance is on a strong upward trajectory. If you maintain your current study pace, you are likely to score above 90% in the Final Examinations."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPredictions();
  }, [studentId]);

  // --- NEW FUNCTION: Send the Email via Backend ---
  const handleSendReport = async () => {
    if (!targetEmail) return;
    setIsSending(true);
    
    try {
      const response = await fetch(`http://localhost:5000/api/predictions/${studentId}/send-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetEmail: targetEmail,
          // Grab the very last estimated score from the array
          predictedScore: predictionData.performanceTrends[predictionData.performanceTrends.length - 1].score,
          insight: predictionData.insight
        })
      });

      if (response.ok) {
        setSendSuccess(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setSendSuccess(false);
          setTargetEmail('');
        }, 2000);
      } else {
         console.error("Server returned an error");
      }
    } catch (error) {
      console.error("Failed to send report", error);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading || !predictionData) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 text-primary animate-pulse">
        <Loader2 size={48} className="animate-spin text-primary" />
        <p className="text-lg font-medium text-muted-foreground">Running predictive models...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in relative">
      
      {/* --- NEW MODAL OVERLAY --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-background p-6 rounded-2xl shadow-xl w-full max-w-md border border-border relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Mail className="text-primary"/> Send Report
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enter an email address to send the current predictive analysis report.
            </p>
            
            <input 
              type="email" 
              placeholder="judge@hackathon.com" 
              value={targetEmail}
              onChange={(e) => setTargetEmail(e.target.value)}
              className="w-full p-3 border rounded-xl mb-4 bg-muted/50 focus:ring-2 focus:ring-primary outline-none"
            />
            
            <button 
              onClick={handleSendReport}
              disabled={isSending || !targetEmail}
              className="w-full bg-primary text-primary-foreground p-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 transition-all"
            >
              {isSending ? <Loader2 className="animate-spin" size={20}/> : sendSuccess ? "Sent Successfully!" : <><Send size={18}/> Send Now</>}
            </button>
          </div>
        </div>
      )}

      {/* --- UPDATED HEADER WITH BUTTON --- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
            <BrainCircuit size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">AI Predictions</h2>
            <p className="text-muted-foreground">Predictive analysis based on your historical data and current trends.</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all border border-primary/20"
        >
          <Mail size={18} />
          Email Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {predictionData.predictedScores.map((pred, idx) => {
          const difference = pred.predicted - pred.current;
          const isPositive = difference >= 0;
          const TrendIcon = isPositive ? TrendingUp : TrendingDown;
          const trendColorClass = isPositive ? "text-emerald-500 bg-emerald-500/10" : "text-red-500 bg-red-500/10";
          const barColorClass = isPositive ? "bg-primary" : "bg-red-500";

          return (
            <div key={idx} className="bg-card p-6 rounded-2xl border shadow-sm relative overflow-hidden group hover:border-primary/50 transition-all">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles size={48} className="text-primary" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">{pred.subject} - {pred.exam}</p>
              <div className="mt-4 flex items-end gap-3">
                <h3 className="text-4xl font-black text-primary">{pred.predicted}%</h3>
                
                <div className={`flex items-center text-xs font-bold mb-1 px-2 py-0.5 rounded-full ${trendColorClass}`}>
                  <TrendIcon size={12} className="mr-1" />
                  {isPositive ? '+' : ''}{difference}%
                </div>

              </div>
              <p className="text-xs text-muted-foreground mt-2">Current Grade: {pred.current}%</p>
              <div className="mt-6 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${barColorClass}`} 
                  style={{ width: `${pred.predicted}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-card p-8 rounded-2xl border shadow-sm">
        <h3 className="font-bold text-xl mb-6">Long-term Performance Forecast</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={predictionData.performanceTrends}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
              <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} domain={['dataMin - 10', 'dataMax + 10']} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="hsl(var(--primary))" 
                fillOpacity={1} 
                fill="url(#colorScore)" 
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6 p-4 bg-primary/5 border border-primary/10 rounded-xl flex items-start gap-3">
          <Sparkles className="text-primary mt-1" size={20} />
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-bold text-foreground">Algorithm Insight:</span> {predictionData.insight}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Predictions;