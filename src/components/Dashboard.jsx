import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Users, Clock, Target, AlertTriangle, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { cn } from '../lib/utils';

const StatCard = ({ label, value, icon: Icon, trend, trendValue, color }) => (
  <div className="bg-card p-6 rounded-2xl border shadow-sm card-hover">
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-3 rounded-xl", color)}>
        <Icon size={24} className="text-white" />
      </div>
      {trend && (
        <div className={cn(
          "flex items-center text-xs font-medium px-2 py-1 rounded-full",
          trend === 'up' ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
        )}>
          {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trendValue}%
        </div>
      )}
    </div>
    <p className="text-muted-foreground text-sm font-medium">{label}</p>
    <h3 className="text-2xl font-bold mt-1">{value}</h3>
  </div>
);

const Dashboard = ({ studentId = "69f6a965466b9adf2bf693ca" }) => {
  const [dashboardData, setDashboardData] = useState(null);
  // --- ADD THIS BLOCK ---
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Watch the HTML tag for the 'dark' class
    const checkTheme = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
    checkTheme(); // Check on initial load

    // Listen for the toggle click
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  // Define the raw hex colors for React to use
  const chartPrimary = isDarkMode ? '#818cf8' : '#4f46e5';
  const chartMuted = isDarkMode ? '#334155' : '#e2e8f0';
  // ----------------------
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        // Hitting your live Render backend
        const response = await fetch(`https://sageathon-api.onrender.com/api/students/${studentId}/metrics`);
        if (!response.ok) throw new Error('Failed to fetch student data');

        const json = await response.json();
        setDashboardData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveData();
  }, [studentId]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen text-lg font-medium text-muted-foreground animate-pulse">Loading Live Data...</div>;
  }

  if (error) {
    return <div className="p-8 text-destructive bg-destructive/10 rounded-xl border border-destructive/20 text-center">Error: {error}. Is the Render server awake?</div>;
  }

  // Safely extract data from your backend response
  const { studentProfile, currentRiskLevel, currentRiskScore, weeklyRecords } = dashboardData;

  // Transform backend weeklyRecords into Recharts format
  const performanceTrends = weeklyRecords.map(record => {
    // Calculate attendance % for this specific week to plot on the graph
    let attended = 0;
    let conducted = 0;
    record.subjects.forEach(sub => {
      attended += sub.attended;
      conducted += sub.conducted;
    });
    const weekScore = conducted > 0 ? Math.round((attended / conducted) * 100) : 100;

    return {
      month: `Week ${record.weekNumber}`,
      score: weekScore
    };
  });
  // 2. Transform the most recent week into Recharts BarChart format
  const latestWeek = weeklyRecords[weeklyRecords.length - 1];

  const subjectPerformance = latestWeek ? latestWeek.subjects.map(sub => {
    // Calculate the score for this specific subject
    const score = sub.conducted > 0 ? Math.round((sub.attended / sub.conducted) * 100) : 0;

    return {
      subject: sub.name, // e.g., "DBMS", "OS"
      score: score,
      average: 75 // Hardcoding a mock class average for the visual comparison
    };
  }) : [];

  return (
    <div className="space-y-8 animate-fade-in p-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Student Dashboard</h2>
          <p className="text-muted-foreground ">Welcome back, <strong className='text-l'>{studentProfile.name}</strong>. Here's your performance summary.</p>        </div>
        <div className="flex gap-3">
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg border font-bold text-sm",
            currentRiskLevel === 'Low' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" :
              currentRiskLevel === 'Medium' ? "bg-amber-500/10 text-amber-600 border-amber-500/30" :
                "bg-destructive/10 text-destructive border-destructive/30"
          )}>
            <AlertTriangle size={16} />
            Risk Status: {currentRiskLevel}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Current Risk Score"
          value={`${currentRiskScore} / 100`}
          icon={Target}
          trend={currentRiskScore < 40 ? "up" : "down"}
          trendValue={Math.abs(100 - currentRiskScore)} // Example math
          color={currentRiskScore < 40 ? "bg-emerald-500" : "bg-destructive"}
        />
        <StatCard
          label="Major"
          value={studentProfile.major}
          icon={Clock}
          color="bg-purple-600"
        />
        <StatCard
          label="Semester"
          value={`Sem ${studentProfile.semester}`}
          icon={TrendingUp}
          color="bg-indigo-600"
        />
        <StatCard
          label="Student ID"
          value={studentProfile.studentId}
          icon={Users}
          color="bg-pink-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Live Performance Trend Line Chart */}
        <div className="bg-card p-6 rounded-2xl border shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Weekly Attendance Trend</h3>
          </div>
         <div className="h-[300px] min-h-[300px] w-full" style={{ minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke={chartPrimary}
                  strokeWidth={3}
                  dot={{ fill: chartPrimary, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Subject Performance Bar Chart */}
        <div className="bg-card p-6 rounded-2xl border shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Current Subject Proficiency</h3>
            <div className="flex gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary"></span> You</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-muted"></span> Average</div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectPerformance} margin={{ top: 20, bottom: 40 }}> {/* Added bottom margin for angled text */}
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />

                <XAxis
                  dataKey="subject"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  angle={-45}          /* Angles the text diagonally */
                  textAnchor="end"     /* Aligns the end of the text to the tick mark */
                  dy={15}              /* Pushes the text down slightly */
                  height={60}          /* Gives the angled text room to breathe */
                />

                <YAxis axisLine={false} tickLine={false} domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />

                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />

                {/* Replaced fixed barSize with maxBarSize so it shrinks automatically if crowded */}
                <Bar dataKey="score" fill={chartPrimary} radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="average" fill={chartMuted} radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>        {/* Note: The Subject Proficiency Bar Chart is omitted here temporarily to ensure the code works immediately with your backend data structure. You can map `record.subjects` to a BarChart next! */}
      </div>
    </div>
  );
};

export default Dashboard;