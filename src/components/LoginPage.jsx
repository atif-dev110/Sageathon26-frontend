import React, { useState } from 'react';
import { BrainCircuit, Mail, Lock, ArrowRight, Github, Globe, GraduationCap, Briefcase } from 'lucide-react';
import { cn } from '../lib/utils'; // Make sure you have this utility!

const LoginPage = ({ onLogin, onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  
  // 1. Added State for the Toggle
  const [activeRole, setActiveRole] = useState('student');

  // Student data for auto-fill
  const students = [
    { "_id": "69f6a965466b9adf2bf693bc", "name": "Akshita Yadav" },
    { "_id": "69f6a965466b9adf2bf693c1", "name": "Kaif Khan" },
    { "_id": "69f6a965466b9adf2bf693bf", "name": "Garima Sharma" },
    { "_id": "69f6a965466b9adf2bf693cd", "name": "Atif Raza" }
  ];

  const studentOptions = students.map(student => student._id);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prevent empty submissions ONLY for students
    if (activeRole === 'student' && !userId.trim()) return;

    setIsLoading(true);
    
    // 2. Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      // 3. Pass BOTH the ID and the Role up to App.jsx!
    onLogin(activeRole === 'faculty' ? 'dummy-faculty-id' : userId.trim(), activeRole);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full max-w-md animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div 
            onClick={onBack}
            className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20 mb-6 cursor-pointer hover:scale-105 transition-transform"
          >
            <BrainCircuit size={28} />
          </div>
          <h2 className="text-3xl font-black tracking-tight">Welcome Back</h2>
          <p className="text-muted-foreground mt-2">Enter your credentials to access your insights</p>
        </div>

        <div className="bg-card border rounded-3xl p-8 shadow-2xl">
          
          {/* --- NEW TOGGLE BUTTONS --- */}
          <div className="flex p-1 mb-8 bg-muted/50 rounded-xl border">
            <button
              type="button"
              onClick={() => setActiveRole('student')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all",
                activeRole === 'student' ? "bg-card shadow text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <GraduationCap size={18} /> Student
            </button>
            <button
              type="button"
              onClick={() => setActiveRole('faculty')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all",
                activeRole === 'faculty' ? "bg-card shadow text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Briefcase size={18} /> Faculty
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">
                {activeRole === 'faculty' ? 'Faculty ID or Email' : 'Email or Student ID'}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  required={activeRole === 'student'}
                  type="text" 
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder={activeRole === 'faculty' ? "admin@school.edu" : "Enter student ID or select from list"}
                  list={activeRole === 'student' ? "students" : undefined}
                  className="w-full bg-muted/50 border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-2xl pl-12 pr-4 py-3 outline-none transition-all"
                />
                {activeRole === 'student' && (
                  <datalist id="students">
                    {studentOptions.map((option, index) => (
                      <option key={index} value={option} />
                    ))}
                  </datalist>
                )}
              </div>
            </div>

            {/* <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold">Password</label>
                <a href="#" className="text-xs text-primary font-bold hover:underline">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  required={activeRole === 'student'}
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-muted/50 border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-2xl pl-12 pr-4 py-3 outline-none transition-all"
                />
              </div>
            </div> */}

            <button 
              disabled={isLoading}
              type="submit"
              className="w-full bg-primary text-white rounded-2xl py-4 font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-70 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase font-bold text-muted-foreground">
              <span className="bg-card px-4">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 border rounded-2xl py-3 hover:bg-muted transition-colors text-sm font-bold">
              <Globe size={18} /> Google
            </button>
            <button className="flex items-center justify-center gap-2 border rounded-2xl py-3 hover:bg-muted transition-colors text-sm font-bold">
              <Github size={18} /> GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;